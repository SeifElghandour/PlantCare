const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadScan, getMyScans } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// 1. Configure Multer for local storage
// Images will be temporarily stored in the 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// --- Protected Routes (Require Authentication Token) ---

/**
 * @route   POST /api/scans
 * @desc    Receive image from Frontend, send to AI Service, and save result
 * @access  Private (User must be logged in)
 */
// The field name 'image' must match what the Frontend sends in FormData
router.post('/', protect, upload.single('image'), uploadScan);

/**
 * @route   GET /api/scans
 * @desc    Retrieve the history of plant scans for the authenticated user
 * @access  Private
 */
router.get('/', protect, getMyScans);

module.exports = router;