const fs = require('fs');
const pdfparser = require('pdf-parse');
const mammoth = require('mammoth');
const { getResumeScore } = require('../utils/score');

// Parse PDF
const parsePDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfparser(dataBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Error parsing PDF: ' + error.message);
    }
};

// Parse DOCX
const parseDOCX = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value;
    } catch (error) {
        throw new Error('Error parsing DOCX: ' + error.message);
    }
};

module.exports = {
    parsePDF,
    parseDOCX,
    getResumeScore,
};