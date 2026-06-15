const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs'); // Added for file system operations
const path = require('path');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. INTERNAL DIRECTORY CHECK (Safety Net)
// Ensure the 'uploads' folder exists for Multer to store images
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('✅ System: "uploads" directory created successfully.');
}

// 4. Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 5. Static Folder (Optional but recommended)
// Allows viewing uploaded images via browser if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Mount Routers
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));

// Root Route
app.get('/', (req, res) => {
    res.send('Plant Scan AI - Backend API is running...');
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 8. Start Server
// Using 5000 as a standard port for Node.js
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});