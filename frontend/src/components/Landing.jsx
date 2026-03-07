import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero-section d-flex align-items-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 hero-text-content">
                            <h1 className="hero-title fw-bold mb-4">
                                Unlock Your Potential with <span className="highlight-text">CareerAI</span>
                            </h1>
                            <p className="hero-description mb-5">
                                Navigate your professional journey with precision. Our AI-driven platform analyzes your unique skills, predicts industry trends, and charts a personalized path to your dream career.
                            </p>
                            <div className="hero-buttons d-flex gap-3">
                                <Link to="/dashboard" className="btn btn-primary btn-lg custom-btn-primary shadow-sm text-decoration-none">
                                    Start Assessment
                                </Link>
                                <Link to="/upload" className="btn btn-outline-primary btn-lg custom-btn-outline shadow-sm text-decoration-none">
                                    Analyze Resume
                                </Link>
                            </div>
                            <div className="hero-stats mt-5 d-flex gap-4">
                                <div className="stat-item">
                                    <h3 className="fw-bold mb-0">98%</h3>
                                    <small className="text-muted">Prediction Accuracy</small>
                                </div>
                                <div className="stat-item">
                                    <h3 className="fw-bold mb-0">50K+</h3>
                                    <small className="text-muted">Careers Guided</small>
                                </div>
                                <div className="stat-item">
                                    <h3 className="fw-bold mb-0">24/7</h3>
                                    <small className="text-muted">AI Assistance</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 mt-5 mt-lg-0 hero-visual">
                            <div className="glass-card main-glass-card shadow-lg p-4">
                                <div className="glass-header d-flex justify-content-between align-items-center mb-4">
                                    <div className="dot-group d-flex gap-2">
                                        <span className="dot red"></span>
                                        <span className="dot yellow"></span>
                                        <span className="dot green"></span>
                                    </div>
                                    <span className="badge bg-primary text-white rounded-pill px-3 py-2">AI Active</span>
                                </div>
                                <div className="glass-body">
                                    <div className="chat-bubble bot-bubble mb-3 p-3 rounded-4 shadow-sm">
                                        Analyzing skills matrix... matching with top tech roles in your area.
                                    </div>
                                    <div className="chat-bubble user-bubble mb-3 p-3 rounded-4 shadow-sm text-end align-self-end ms-auto">
                                        I know React and Python. What's next?
                                    </div>
                                    <div className="chat-bubble bot-bubble p-3 rounded-4 shadow-sm">
                                        Based on current market trends, Full-Stack Developer or AI Engineer are top matches. Let's tailor your learning path! 🚀
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements behind the card */}
                            <div className="blob blob-1"></div>
                            <div className="blob blob-2"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5" id="features">
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold section-title">Supercharge Your Career</h2>
                        <p className="text-muted text-center max-w-lg mx-auto mt-3">Discover the tools designed to give you a competitive edge in today's fast-paced job market.</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                                <div className="feature-icon bg-primary-light text-primary mb-4 mx-auto rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="bi bi-bullseye fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Skill Assessment</h4>
                                <p className="text-muted mb-0">Evaluate your current proficiencies and identify critical gaps blocking your next promotion.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                                <div className="feature-icon bg-success-light text-success mb-4 mx-auto rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="bi bi-file-earmark-text fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-3">Smart Resume Parsing</h4>
                                <p className="text-muted mb-0">Upload your resume for an instant AI review, highlighting keywords and formatting improvements.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card h-100 p-4 border-0 shadow-sm rounded-4 text-center">
                                <div className="feature-icon bg-info-light text-info mb-4 mx-auto rounded-circle d-flex align-items-center justify-content-center">
                                    <i className="bi bi-chat-dots fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-3">24/7 AI Mentor</h4>
                                <p className="text-muted mb-0">Got career questions? Our intelligent bot is always ready to brainstorm, practice interviews, or offer advice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
