import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

function AIChat() {
    const [question, setQuestion] = useState('');
    const [chatLog, setChatLog] = useState([
        { role: 'ai', text: 'Hello! I am your AI Career Assistant powered by Gemini. Ask me about careers, required skills, or roadmaps!' }
    ]);
    const [loading, setLoading] = useState(false);

    const askGemini = async () => {
        if (!question.trim()) return;

        const newLog = [...chatLog, { role: 'user', text: question }];
        setChatLog(newLog);
        setQuestion('');
        setLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:5050/api/career-advice', {
                question,
                context: { user_topic: 'career gap analysis' }
            });
            setChatLog([...newLog, { role: 'ai', text: res.data.answer }]);
        } catch (e) {
            console.error(e);
            setChatLog([...newLog, { role: 'ai', text: 'Sorry, I am having trouble connecting to the backend or API.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mx-auto" style={{ maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header bg-dark text-white">
                <h4 className="mb-0">AI Career Assistant</h4>
            </div>

            <div className="card-body bg-light" style={{ overflowY: 'auto', flexGrow: 1 }}>
                {chatLog.map((msg, i) => (
                    <div key={i} className={`mb-3 text-${msg.role === 'user' ? 'end' : 'start'}`}>
                        <div className={`d-inline-block p-3 rounded text-start ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border shadow-sm'}`} style={{ maxWidth: '85%' }}>
                            {msg.role === 'ai' ? (
                                <div
                                    className="react-markdown-container"
                                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                                />
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-start mb-3"><span className="p-3 border shadow-sm rounded bg-white fst-italic">AI is typing...</span></div>}
            </div>

            <div className="card-footer bg-white">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. What skills do I need for Data Science?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' ? askGemini() : null}
                    />
                    <button className="btn btn-dark" onClick={askGemini} disabled={loading}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default AIChat;
