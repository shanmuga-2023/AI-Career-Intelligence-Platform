import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import './CareerRoadmap.css';

function AIChat() {
    const [question, setQuestion] = useState('');
    const [chatLog, setChatLog] = useState([
        { role: 'ai', text: 'Hello! I am your AI Career Assistant. Ask me about careers, required skills, or roadmaps!' }
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
            setChatLog([...newLog, { role: 'ai', text: 'I didn’t understand that. Would you like to continue with career recommendations?' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="career-roadmap-container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="display-5 fw-bold text-gradient mb-3">AI Career Assistant</h2>
                    <p className="lead text-muted">Chat with our AI to get personalized advice, explore career options, and set your goals.</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 rounded-4 roadmap-form-card mb-5" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="card-body p-4 p-md-5 bg-light" style={{ overflowY: 'auto', flexGrow: 1, borderRadius: '1rem 1rem 0 0' }}>
                            {chatLog.map((msg, i) => (
                                <div key={i} className={`mb-3 text-${msg.role === 'user' ? 'end' : 'start'}`}>
                                    <div className={`d-inline-block p-3 rounded-4 text-start ${msg.role === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-white border-0 shadow-sm'}`} style={{ maxWidth: '85%' }}>
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
                            {loading && <div className="text-start mb-3"><span className="p-3 shadow-sm rounded-4 bg-white fst-italic display-inline-block">AI is typing...</span></div>}
                        </div>

                        <div className="card-footer bg-white p-4" style={{ borderRadius: '0 0 1rem 1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
                                <input
                                    type="text"
                                    className="form-control border-0 px-4"
                                    placeholder="E.g. What skills do I need for Data Science?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' ? askGemini() : null}
                                />
                                <button className="btn btn-primary px-4 fw-bold" onClick={askGemini} disabled={loading}>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AIChat;
