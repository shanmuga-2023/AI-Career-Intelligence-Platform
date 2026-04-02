import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import './MockInterview.css';

function MockInterview() {
    const [phase, setPhase] = useState('setup'); // 'setup' | 'interviewing'
    const [role, setRole] = useState('');
    const [techStack, setTechStack] = useState('');
    const [messages, setMessages] = useState([]); 
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(prev => prev ? prev + " " + transcript : transcript);
            };
            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => scrollToBottom(), [messages, loading]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const startInterview = async (e) => {
        e.preventDefault();
        setPhase('interviewing');
        // Trigger the initial question
        await sendMessage('', true);
    };

    const sendMessage = async (customMessage = null, isInitial = false) => {
        const textToSend = isInitial ? '' : (customMessage !== null ? customMessage : inputValue);
        if (!isInitial && !textToSend.trim()) return;

        let currentHistory = [...messages];
        if (!isInitial) {
            currentHistory.push({ role: 'user', content: textToSend });
            setMessages([...currentHistory]);
            setInputValue('');
        }
        
        setLoading(true);

        try {
            const res = await axios.post('http://127.0.0.1:5050/api/mock-interview', {
                role,
                techStack,
                message: textToSend,
                history: isInitial ? [] : messages
            });
            setMessages([...currentHistory, { role: 'ai', content: res.data.answer }]);
        } catch (e) {
            console.error(e);
            setMessages([...currentHistory, { role: 'ai', content: 'Connection Error. Ensure Backend is running.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (phase === 'setup') {
        return (
            <div className="career-roadmap-container py-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-md-8 text-center">
                        <h2 className="display-5 fw-bold text-gradient mb-3">Mock Interview Simulator</h2>
                        <p className="lead text-muted">Configure your target role and let our AI interrogate you with relevant technical questions.</p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 mb-4">
                        <div className="card shadow-sm border-0 rounded-4 roadmap-form-card p-4 mx-auto">
                            <h4 className="mb-4 text-center fw-bold">Interview Configuration</h4>
                            <form onSubmit={startInterview}>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase letter-spacing-1">Target Job Role</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 py-2" 
                                        value={role} 
                                        onChange={e => setRole(e.target.value)} 
                                        required 
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold small text-uppercase letter-spacing-1">Tech Stack to cover</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light border-0 py-2" 
                                        value={techStack} 
                                        onChange={e => setTechStack(e.target.value)} 
                                        required 
                                        placeholder="e.g. React, Next.js, CSS"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">
                                    Start Interview
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="career-roadmap-container py-4">
            <div className="row justify-content-center h-100">
                <div className="col-lg-10 h-100 d-flex flex-column">
                    <div className="text-center mb-4">
                         <h3 className="fw-bold text-gradient">Interviewing for {role}</h3>
                    </div>
                    
                    <div className="card shadow-sm border-0 rounded-4 roadmap-form-card mb-4" style={{ height: '65vh', display: 'flex', flexDirection: 'column' }}>
                        
                        <div className="card-body p-4 p-md-5 bg-light" style={{ overflowY: 'auto', flexGrow: 1, borderRadius: '1rem 1rem 0 0' }}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-3 text-${msg.role === 'user' ? 'end' : 'start'}`}>
                                    <span className="badge mb-1 text-muted">{msg.role === 'user' ? 'You' : 'AI Interviewer'}</span>
                                    <br />
                                    <div className={`d-inline-block p-3 rounded-4 text-start ${msg.role === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-white border-0 shadow-sm'}`} style={{ maxWidth: '85%' }}>
                                        {msg.role === 'ai' ? (
                                            <div
                                                className="react-markdown-container m-0 p-0"
                                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                                            />
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="mb-3 text-start">
                                    <span className="badge mb-1 text-muted">AI Interviewer</span>
                                    <br />
                                    <div className="d-inline-block p-3 rounded-4 bg-white border-0 shadow-sm fst-italic text-muted">
                                        Analyzing response and generating next question...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="card-footer bg-white p-4" style={{ borderRadius: '0 0 1rem 1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden bg-white">
                                <button 
                                    className={`btn ${isListening ? 'btn-danger' : 'btn-light px-4 border-end'}`} 
                                    onClick={toggleListening}
                                    type="button"
                                    title="Dictate Answer"
                                >
                                    {isListening ? '🛑 Stop' : '🎤 Mic'}
                                </button>
                                <textarea
                                    className="form-control border-0 px-3"
                                    placeholder="Type your answer here or use the mic..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows="1"
                                    style={{ resize: 'none', paddingTop: '0.8rem' }}
                                />
                                <button 
                                    className="btn btn-primary px-4 fw-bold" 
                                    onClick={() => sendMessage()} 
                                    disabled={loading || !inputValue.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MockInterview;
