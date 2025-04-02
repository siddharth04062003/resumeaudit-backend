const fs = require('fs');
const pdfparser = require('pdf-parse');
const mammoth = require('mammoth');

// If the function is defined elsewhere, import it
const { getResumeScore } = require('../utils/score'); // Adjust path as needed

// Function to parse PDF files
const parsePDF = (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    return pdfparser(dataBuffer).then((data) => {
        return data.text; // Extracted text from PDF
    }).catch((error) => {
        throw new Error('Error parsing PDF: ' + error.message);
    });
};

// Function to parse DOCX files
const parseDOCX = (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    return mammoth.extractRawText({ buffer: dataBuffer })
      .then((result) => {
        return result.value;  // The extracted text from the DOCX
      }).catch((error) => {
          throw new Error('Error parsing DOCX: ' + error.message);
      });
};


module.exports = {
    parsePDF,
    parseDOCX,
    getResumeScore,
};
