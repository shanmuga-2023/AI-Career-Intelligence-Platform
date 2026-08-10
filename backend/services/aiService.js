const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

async function getCareerAdvice(question, context) {
    if (!ai) {
        return "I am your AI Career Assistant. To excel in tech roles, focus on mastering core data structures, system design, and building real-world portfolio projects in your target stack.";
    }

    try {
        const prompt = `You are an AI Career Assistant. The user's context is: ${JSON.stringify(context || {})}.
        Answer the following question about career guidance, required skills, and learning roadmaps:
        User Question: ${question}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini AI Advice Error:", error.message);
        return "Based on current industry trends, focusing on practical projects, cloud certifications (AWS/Azure/GCP), and building strong open-source contributions will boost your career prospects.";
    }
}

async function conductMockInterview(role, techStack, userMessage, history = []) {
    if (!ai) {
        return `Welcome to your mock interview for the ${role} position (${techStack}). Could you start by explaining how you handle performance optimization in your projects?`;
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
        2. If assessing a candidate's response, provide brief, constructive feedback or a grade, and then IMMEDIATELY ask the next technical question.
        3. Keep responses concise and focused on conducting an realistic interview.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Mock Interview Error:", error.message);
        return `Thank you for sharing that answer. Next question for the ${role} role: How do you design applications for scalability and maintainability?`;
    }
}

module.exports = { getCareerAdvice, conductMockInterview };
