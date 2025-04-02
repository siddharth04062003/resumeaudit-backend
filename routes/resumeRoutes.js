const express = require('express');
const multer = require('multer');
const path = require('path');

const ResumeController = require('../controller/resumeController');  // Adjust the path if necessary
const { getResumeScore } = require('../utils/score');  // Import the getResumeScore function from utils/score

const router = express.Router();

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST route to process the resume and return score
router.post('/process', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No resume file uploaded');
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription;
    
    if (!jobDescription) {
      return res.status(400).send('Job description is required');
    }

    let resumeText = '';

    // Check file type and parse accordingly
    if (req.file.originalname.endsWith('.pdf')) {
      resumeText = await ResumeController.parsePDF(filePath);
    } else if (req.file.originalname.endsWith('.docx')) {
      resumeText = await ResumeController.parseDOCX(filePath);
    } else {
      return res.status(400).send('Unsupported file type');
    }

    // Get the score based on resume text and job description
    const score = getResumeScore(resumeText, jobDescription);

    res.status(200).json({ score });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).send({ message: 'Error processing resume.', error: error.message });
  }
});

module.exports = router;
