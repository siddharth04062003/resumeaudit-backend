// List of common stop words to filter out
const stopWords = [
    "a", "an", "the", "and", "but", "if", "or", "as", "is", "are", 
    "to", "with", "of", "for", "on", "in", "at", "by", "from", "that", 
    "which", "who", "whom", "this", "these", "those", "it", "its", "be", "was", 
    "were", "been", "being", "have", "has", "had", "having", "do", "does", "did"
  ];
  
  // Filter out stop words from a string
  const filterStopWords = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => !stopWords.includes(word));
  }
  
  // Define the resume scoring function
  function getResumeScore(resumeText, jobDescription) {
      const resumeWords = filterStopWords(resumeText);
      const jobDescriptionWords = filterStopWords(jobDescription);
  
      // Count the common words between the resume and job description
      let commonWordsCount = 0;
      resumeWords.forEach(word => {
          if (jobDescriptionWords.includes(word)) {
              commonWordsCount++;
          }
      });
  
      // Calculate the score as the percentage of common words
      const score = (commonWordsCount / jobDescriptionWords.length) * 100;
      return score;
  }
  
  module.exports = { getResumeScore };
  