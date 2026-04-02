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

async function conductMockInterview(role, techStack, userMessage, history = []) {
    if (!ai) {
        return "Gemini API key not configured. Mock Interview response: That sounds good. Can you explain how you would manage state in React?";
    }

    try {
        let historyPromptContext = history.length > 0 
            ? `Previous Conversation History:\n${history.map(h => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.content}`).join('\n')}\n\n`
            : "";

        const prompt = `You are an expert technical interviewer conducting a mock interview for the role of "${role}" focusing on the tech stack: "${techStack}".
        
        ${historyPromptContext}
        Candidate's latest response: "${userMessage || 'Hi, I am ready to start the interview.'}"
        
        Your instructions:
        1. If this is the start of the interview (Candidate's response is just a greeting or empty history), greet the candidate professionally and ask the first technical question based on the stack.
        2. If assessing a candidate's response, provide brief, constructive feedback or a grade (e.g., "Good answer, you covered the main points."), and then IMMEDIATELY ask the next technical question.
        3. Do NOT provide comprehensive answers to your own questions. Play the role of the strict but fair interviewer. Keep responses concise and focused primarily on the next question.`;

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

module.exports = { getCareerAdvice, conductMockInterview };
