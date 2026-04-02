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
            <div className="interview-wrapper py-5">
                <div className="row justify-content-center">
                    <h2 className="title mb-4 text-center">Mock Interview Simulator</h2>
                    <div className="col-lg-6 mb-4">
                        <div className="glass-card p-4">
                            <h4 className="mb-4 text-white">Interview Configuration</h4>
                            <form onSubmit={startInterview}>
                                <div className="mb-4">
                                    <label className="form-label text-muted">Target Job Role</label>
                                    <input 
                                        type="text" 
                                        className="form-control glass-input" 
                                        value={role} 
                                        onChange={e => setRole(e.target.value)} 
                                        required 
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted">Tech Stack to cover</label>
                                    <input 
                                        type="text" 
                                        className="form-control glass-input" 
                                        value={techStack} 
                                        onChange={e => setTechStack(e.target.value)} 
                                        required 
                                        placeholder="e.g. React, Next.js, CSS"
                                    />
                                </div>
                                <button type="submit" className="btn interview-btn w-100 mt-2">
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
        <div className="interview-wrapper py-3">
            <div className="row justify-content-center h-100">
                <div className="col-lg-10 h-100 d-flex flex-column">
                    <h3 className="title mb-4 text-center">Interviewing for {role}</h3>
                    
                    <div className="glass-card flex-grow-1 d-flex flex-column overflow-hidden" style={{ minHeight: '65vh' }}>
                        
                        <div className="chat-container flex-grow-1 p-3 overflow-auto">
                            {messages.map((msg, i) => (
                                <div key={i} className={`mb-3 d-flex flex-column ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                                    <span className="badge mb-1" style={{ color: '#94a3b8' }}>{msg.role === 'user' ? 'You' : 'AI Interviewer'}</span>
                                    <div className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
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
                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <span className="badge mb-1" style={{ color: '#94a3b8' }}>AI Interviewer</span>
                                    <div className="chat-bubble ai-bubble fst-italic">Analyzing response and generating next question...</div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
                            <div className="input-group">
                                <button 
                                    className={`btn ${isListening ? 'btn-danger' : 'btn-outline-info'} voice-btn`} 
                                    onClick={toggleListening}
                                    type="button"
                                    title="Dictate Answer"
                                >
                                    {isListening ? '🛑 Stop' : '🎤 Mic'}
                                </button>
                                <textarea
                                    className="form-control glass-input mx-2"
                                    placeholder="Type your answer here or use the mic..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows="2"
                                    style={{ resize: 'none' }}
                                />
                                <button 
                                    className="btn interview-btn px-4" 
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
