const { GoogleGenAI } = require('@google/genai');

// Need to assure we load API key from environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

async function getCareerAdvice(question, context) {
    if (!ai) {
        return "Gemini API key not configured. Mock response: We recommend focusing on Python and Machine Learning for Data Science roles.";
    }

    try {
        const prompt = `You are an AI Career Assistant. The user's context is: ${JSON.stringify(context || {})}.
        Answer the following question about career guidance, required skills, and learning roadmaps:
        User Question: ${question}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error('Failed to communicate with Gemini API');
    }
}

module.exports = { getCareerAdvice };
