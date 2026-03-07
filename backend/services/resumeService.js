const { PDFParse } = require('pdf-parse');

// Basic mock implementation. We will extract text and then run a simple keyword matching
// against a predefined list of skills, or send it to ML Engine or Gemini.
async function extractSkills(pdfBuffer) {
    try {
        const parser = new PDFParse({ data: pdfBuffer });
        const pdftxt = await parser.getText();
        const text = pdftxt.text;

        // Simple mock skill detection for now.
        // In reality, we might pass this text to Gemini or the ML engine to extract NLP-detected skills.
        const commonSkills = ['Python', 'Java', 'SQL', 'Machine Learning', 'React', 'Node.js', 'Pandas', 'Express'];
        const detectedSkills = commonSkills.filter(skill =>
            text.toLowerCase().includes(skill.toLowerCase())
        );

        return {
            detectedSkills,
            textSnippet: text.substring(0, 200) + '...', // Just showing a snippet for demo
            textLength: text.length
        };
    } catch (error) {
        throw new Error('Failed to parse PDF: ' + error.message);
    }
}

module.exports = { extractSkills };
