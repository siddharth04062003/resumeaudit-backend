const express = require('express');
const multer = require('multer');
const path = require('path');
const ResumeController = require('../controller/resumeController');
const { getResumeScore } = require('../utils/score');

const router = express.Router();

// Multer configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, '/tmp');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Process Resume
router.post('/process', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No resume file uploaded' });
        if (!req.body.jobDescription) return res.status(400).json({ error: 'Job description is required' });

        let resumeText = '';
        if (req.file.originalname.endsWith('.pdf')) {
            resumeText = await ResumeController.parsePDF(req.file.path);
        } else if (req.file.originalname.endsWith('.docx')) {
            resumeText = await ResumeController.parseDOCX(req.file.path);
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        const result = getResumeScore(resumeText, req.body.jobDescription);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(500).json({ error: 'Error processing resume.', details: error.message });
    }
});

module.exports = router;