const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const Resume = require('./models/Resume');
const resumeRoutes = require('./routes/resumeRoutes'); // Adjust path if necessary

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resume upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || 'uploads/';  // Using environment variable for upload directory
        cb(null, uploadDir); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /pdf|docx|txt/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Route for uploading resume
app.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newResume = new Resume({
        fileName: req.file.originalname,
        filePath: req.file.path,
    });

    try {
        await newResume.save();
        res.status(200).send({
            message: 'File uploaded successfully & Saved to DB.',
            file: req.file,
        });
    } catch (error) {
        console.error('Error saving the file:', error);
        res.status(500).send('Error saving the file to database.');
    }
});

// Routes for processing resume
app.use('/api/resumes', resumeRoutes); // Make sure this route is correct

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection failed:', error);
    }
};

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    if (err.message.includes('Invalid file type')) {
        return res.status(400).send({ error: err.message });
    }
    if (err.message.includes('File too large')) {
        return res.status(413).send({ error: 'File size exceeds the limit. Max size is 5MB.' });
    }
    res.status(500).send({ error: 'An unexpected error occurred' });
});

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
