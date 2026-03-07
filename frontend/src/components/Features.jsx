import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

const Features = () => {
    return (
        <div className="features-page-container">
            {/* Intro Section */}
            <section className="features-header text-center">
                <div className="container">
                    <h1 className="features-intro-title mb-4">
                        Powerful Features for a <span className="highlight-text">Smarter Career</span>
                    </h1>
                    <p className="features-intro-subtitle mx-auto" style={{ maxWidth: '700px' }}>
                        Explore the advanced AI tools and interactive dashboards we've built to help you navigate, plan, and accelerate your professional journey with absolute confidence.
                    </p>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="container py-5">
                <div className="row g-5">
                    {/* Feature 1 */}
                    <div className="col-lg-6">
                        <div className="detailed-feature-card h-100">
                            <div className="feature-image-wrapper">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <div className="feature-content">
                                <span className="feature-badge">Prediction Engine</span>
                                <h3 className="feature-title">AI Employability Predictor</h3>
                                <p className="feature-desc">
                                    Leverage our advanced Linear Regression models to evaluate your current standing in the job market and get actionable insights to improve your score.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Factor in years of experience</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Analyze certification impact</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Skill depth evaluation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="col-lg-6">
                        <div className="detailed-feature-card h-100">
                            <div className="feature-image-wrapper">
                                <i className="bi bi-diagram-3"></i>
                            </div>
                            <div className="feature-content">
                                <span className="feature-badge">Matching System</span>
                                <h3 className="feature-title">Smart Skill Matcher</h3>
                                <p className="feature-desc">
                                    Stop guessing what employers want. Our NLP engine compares your exact skill matrix against target job descriptions to identify precise gaps.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Instant gap analysis</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Missing skills identification</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Match percentage scoring</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="col-lg-6">
                        <div className="detailed-feature-card h-100">
                            <div className="feature-image-wrapper">
                                <i className="bi bi-file-earmark-pdf"></i>
                            </div>
                            <div className="feature-content">
                                <span className="feature-badge">Resume Analysis</span>
                                <h3 className="feature-title">Intelligent Resume Parsing</h3>
                                <p className="feature-desc">
                                    Upload your PDF resume and let our system automatically extract key experience, soft skills, and tech abilities, giving you an immediate assessment profile.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Automated data extraction</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Formatting feedback</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Keyword optimization mapping</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="col-lg-6">
                        <div className="detailed-feature-card h-100">
                            <div className="feature-image-wrapper">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div className="feature-content">
                                <span className="feature-badge">24/7 Assistant</span>
                                <h3 className="feature-title">Interactive AI Mentor</h3>
                                <p className="feature-desc">
                                    Stuck on interview prep? Need immediate advice on switching tech stacks? Chat directly with our context-aware AI tuned specifically for career guidance.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="bi bi-check-circle-fill"></i> Mock interview practice</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Real-time career advice</li>
                                    <li><i className="bi bi-check-circle-fill"></i> Salary negotiation tips</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container">
                <div className="cta-section text-center shadow-lg">
                    <div className="cta-blob cta-blob-1"></div>
                    <div className="cta-blob cta-blob-2"></div>
                    <div className="position-relative z-1">
                        <h2 className="fw-bold mb-4">Ready to Transform Your Career?</h2>
                        <p className="mb-4 mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }}>
                            Join thousands of professionals securing better roles with data-driven insights. It takes less than 2 minutes to get started.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Link to="/dashboard" className="btn btn-light btn-lg rounded-pill fw-bold px-5 text-primary">
                                Explore Dashboard
                            </Link>
                            <Link to="/upload" className="btn btn-outline-light btn-lg rounded-pill fw-bold px-5">
                                Upload Resume
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
