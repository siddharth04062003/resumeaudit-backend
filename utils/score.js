const stopWords = [ 
    "a", "an", "the", "and", "but", "if", "or", "as", "is", "are", "to", "with", 
    "of", "for", "on", "in", "at", "by", "from", "that", "which", "who", "whom", 
    "this", "these", "those", "it", "its", "be", "was", "were", "been", "being", 
    "have", "has", "had", "having", "do", "does", "did", "we", "our", "looking", 
    "highly", "skilled", "proficient", "ideal", "candidate", "responsible", 
    "designing", "developing", "maintaining", "ensuring", "strong", "experience", 
    "required", "plus", "seeking", "deep", "must", "include", "managing", 
    "ensuring", "preferred", "will", "advantage", "role", "involves", "expertise", 
    "hands-on", "skills", "like", "each", "demands", "problem-solving", "fast-paced", 
    "environment", "collaboration", "cross-functional", "teams", "building", 
    "enhance", "focus", "modern", "efficiently", "ensuring", "high", "cloud-based",
    "university", "school", "bachelor", "engineering", "cgpa", "intermediate", 
    "matriculation", "technical", "tools", "methodologies", "projects", "present", 
    "technologies", "designed", "developed", "utilized", "ensuring", "secure", 
    "deployed", "application", "allowing", "enabling", "real-time", "efficient", 
    "strong", "process", "data", "monitor", "reporting", "analysis", "classification", 
    "leveraged", "identified", "lead", "managing", "mentorship", "facilitated", 
    "knowledge", "sharing", "ensuring", "effective", "review", "process", 
    "delivering", "solutions", "certifications", "achievements", "ranking", "rating", 
    "place", "category", "problem", "statement", "organized", "managed", "organized", 
    "coordinated", "oversaw", "responsibilities", "ensuring", "leadership", "teamwork", 
    "presentation", "collaboration", "mentored", "time", "management", "task", 
    "critical", "thinking", "adaptability"
];

// Function to filter stop words from text
const filterStopWords = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    return words.filter(word => !stopWords.includes(word));
};

// Function to calculate resume score and suggest missing keywords
function getResumeScore(resumeText, jobDescription) {
    const resumeWords = new Set(filterStopWords(resumeText)); // Unique words in Resume
    const jobDescriptionWords = new Set(filterStopWords(jobDescription)); // Unique words in JD

    // Find common words
    const commonWordsCount = [...resumeWords].filter(word => jobDescriptionWords.has(word)).length;

    // Prevent division by zero
    if (jobDescriptionWords.size === 0) return { score: 0, suggestions: [] };

    // Calculate score (bounded by 100)
    const score = Math.min((commonWordsCount / jobDescriptionWords.size) * 100, 100);
    const roundedScore = Number(score.toFixed(2)); // Round to 2 decimal places

    // Suggest missing keywords if score is below 90
    let suggestions = [];
    if (roundedScore < 90) {
        suggestions = [...jobDescriptionWords].filter(word => !resumeWords.has(word));
    }

    return { score: roundedScore, suggestions };
}

// Export function
module.exports = { getResumeScore };
