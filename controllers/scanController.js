const asyncHandler = require('express-async-handler');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Scan = require('../models/Scan');
const User = require('../models/User');
const Disease = require('../models/Disease');

// @desc    Upload plant image & Get Analysis Result from Real AI Service
// @route   POST /api/scans
// @access  Private
const uploadScan = asyncHandler(async (req, res) => {
  // 1. Validation: Check if a file is uploaded by Multer
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  try {
    // 2. Prepare Data for AI Service
    // We create a FormData object to send the image file via HTTP
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    // 3. INTERNAL API CALL: Communicating with Python AI Server (Flask)
    // Running locally on port 5001 for maximum performance (Zero Latency)
    const aiResponse = await axios.post('http://localhost:5001/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Extract real data from AI Service response
    const { disease, confidence } = aiResponse.data;
    const parsedConfidence =
      typeof confidence === 'string'
        ? parseFloat(confidence.replace('%', '').trim())
        : Number(confidence);

    if (!Number.isFinite(parsedConfidence)) {
      res.status(502);
      throw new Error('AI service returned an invalid confidence value.');
    }

    // 4. Fetch Disease Info from Database (The Look-up Step)
    // We search our MongoDB for the treatment and symptoms of the detected disease
    const diseaseInfo = await Disease.findOne({ name: disease });

    // 5. Prepare Data for History (Snapshot)
    // Providing fallback values if the disease is not yet in our database
    let treatmentText = "Consult an agricultural expert.";
    let symptomsText = "Information not available.";
    let preventionText = "No prevention data available.";

    if (diseaseInfo) {
      treatmentText = diseaseInfo.treatment;
      symptomsText = diseaseInfo.symptoms;
      preventionText = diseaseInfo.prevention || "N/A";
    }

    // 6. Create Scan Record (Save to History)
    // This allows the user to see their previous scans later
    const scan = await Scan.create({
      user: req.user.id,
      imageUrl: req.file.path,   // Local path or Cloudinary URL
      result: disease,           // Real disease name from AI
      confidence: parsedConfidence, // Real confidence score from AI
      treatment: treatmentText,
      symptoms: symptomsText,
      prevention: preventionText
    });

    // 7. Return Final Response to Frontend
    res.status(200).json(scan);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const isConnectionError =
        !error.response ||
        ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNABORTED', 'ENOTFOUND', 'EAI_AGAIN'].includes(error.code);

      if (isConnectionError) {
        console.error('AI Service Connection Error:', error.message);
        res.status(502);
        throw new Error('AI Analysis Service is currently unavailable. Please try again later.');
      }

      const upstreamStatus = error.response.status || 502;
      const upstreamMessage = error.response.data?.error || 'AI analysis failed.';
      console.error('AI Service Response Error:', upstreamMessage);
      res.status(upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 502);
      throw new Error(upstreamMessage);
    }

    console.error('Scan Processing Error:', error.message);
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }
    throw new Error(error.message || 'Unexpected server error while processing scan.');
  }
});

// @desc    Get current user's scan history
// @route   GET /api/scans
// @access  Private
const getMyScans = asyncHandler(async (req, res) => {
  const scans = await Scan.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(scans);
});

module.exports = {
  uploadScan,
  getMyScans,
};