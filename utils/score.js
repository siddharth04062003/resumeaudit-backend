const stopWords = [  
  "a", "an", "the", "and", "but", "if", "or", "as", "is", "are", "to", "with", 
  "of", "for", "on", "in", "at", "by", "from", "that", "which", "who", "whom", 
  "this", "these", "those", "it", "its", "be", "was", "were", "been", "being", 
  "have", "has", "had", "having", "do", "does", "did", "we", "our", "you", "your", 
  "looking", "highly", "motivated", "proficient", "ideal", "should", "demonstrate", 
  "understanding", "expected", "exposure", "desirable", "knowledge", "including", 
  "comfortable", "such", "like", "plus", "candidate", "responsible", "designing", 
  "developing", "maintaining", "ensuring", "strong", "experience", "required", 
  "seeking", "deep", "must", "include", "managing", "preferred", "will", "advantage", 
  "role", "involves", "expertise", "hands-on", "skills", "each", "demands", 
  "problem-solving", "fast-paced", "environment", "collaboration", "cross-functional", 
  "teams", "building", "enhance", "focus", "modern", "efficiently", "high", 
  "cloud-based", "university", "school", "bachelor", "engineering", "cgpa", 
  "intermediate", "matriculation", "technical", "tools", "methodologies", "projects", 
  "present", "technologies", "designed", "developed", "utilized", "secure", 
  "deployed", "application", "allowing", "enabling", "real-time", "efficient", 
  "process", "data", "monitor", "reporting", "analysis", "classification", 
  "leveraged", "identified", "lead", "mentorship", "facilitated", "sharing", 
  "effective", "review", "delivering", "solutions", "certifications", "achievements", 
  "ranking", "rating", "place", "category", "problem", "statement", "organized", 
  "managed", "coordinated", "oversaw", "responsibilities", "leadership", "teamwork", 
  "presentation", "mentored", "time", "management", "task", "critical", "thinking", 
  "adaptability", "motivated", "passion", "drive", "interest", "learning", "eager", 
  "opportunity", "enthusiastic", "fresh", "recent", "join", "part", "work", "grow"
];


// Function to filter stop words from text
const filterStopWords = (text) => {
    // Remove punctuation and convert to lowercase
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanedText.split(/\s+/);

    return words.filter(word => !stopWords.includes(word) && word.length > 1);
};

// Function to calculate resume score and suggest missing keywords
function getResumeScore(resumeText, jobDescription) {
    const resumeWords = new Set(filterStopWords(resumeText)); // Unique words in Resume
    const jobDescriptionWords = new Set(filterStopWords(jobDescription)); // Unique words in JD

    console.log("🔍 Resume Words:", resumeWords);
    console.log("📄 Job Description Words:", jobDescriptionWords);

    // Find common words
    const commonWordsCount = [...resumeWords].filter(word => jobDescriptionWords.has(word)).length;

    // Prevent division by zero
    if (jobDescriptionWords.size === 0) return { score: 0, suggestions: [] };

    // Calculate score (bounded by 100)
    const score = Math.min((commonWordsCount / jobDescriptionWords.size) * 100, 99.98);
    const roundedScore = Number(score.toFixed(2)); // Round to 2 decimal places

    // Suggest missing keywords if score is below 90
    let suggestions = [];
    if (roundedScore < 90) {
        suggestions = [...jobDescriptionWords].filter(word => !resumeWords.has(word));
    }

    console.log("⚠️ Missing Keywords:", suggestions);
    return { score: roundedScore, suggestions };
}

// Export function
module.exports = { getResumeScore };
