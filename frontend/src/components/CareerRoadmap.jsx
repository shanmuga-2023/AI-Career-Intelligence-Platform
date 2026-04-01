import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './CareerRoadmap.css';

function CareerRoadmap() {
    const location = useLocation();
    const [userSkills, setUserSkills] = useState(location.state?.userSkills || '');
    const [targetJob, setTargetJob] = useState(location.state?.targetJob || '');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-fetch if navigating from CareerCompass
    useEffect(() => {
        if (location.state && location.state.targetJob) {
            generateRoadmap(location.state.userSkills || '', location.state.targetJob);
        }
    }, [location.state]);

    const generateRoadmap = async (skillsToUse, jobToUse) => {
        setLoading(true);
        setError(null);
        setRoadmap(null);

        try {
            // Assuming ML Engine is running on port 8000
            const skillsArray = skillsToUse.split(',').map(s => s.trim()).filter(s => s);
            const response = await axios.post('http://localhost:8000/simulate-career', {
                user_skills: skillsArray,
                target_job: jobToUse.trim()
            });

            if (response.data.success && !response.data.data.error) {
                setRoadmap(response.data.data);
            } else {
                setError(response.data.data.error || 'Failed to generate roadmap.');
            }
        } catch (err) {
            console.error('Error generating roadmap:', err);
            setError('Network error. Ensure ML Engine is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!targetJob.trim()) return;
        generateRoadmap(userSkills, targetJob);
    };

    return (
        <div className="career-roadmap-container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="display-5 fw-bold text-gradient mb-3">AI Career Roadmap</h2>
                    <p className="lead text-muted">Enter your current skills and target job to get a personalized learning path and career trajectory.</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 rounded-4 roadmap-form-card mb-5">
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label htmlFor="userSkills" className="form-label fw-medium">Current Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="userSkills"
                                            placeholder="e.g. Python, SQL, React"
                                            value={userSkills}
                                            onChange={(e) => setUserSkills(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="targetJob" className="form-label fw-medium">Target Job Role</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="targetJob"
                                            placeholder="e.g. Data Scientist, Web Developer"
                                            value={targetJob}
                                            onChange={(e) => setTargetJob(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <button type="submit" className="btn btn-primary btn-lg px-5 rounded-pill" disabled={loading}>
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...</>
                                            ) : (
                                                'Generate Roadmap'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger shadow-sm rounded-4" role="alert">
                            {error}
                        </div>
                    )}

                    {roadmap && (
                        <div className="roadmap-results fade-in">
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0 rounded-4 highlight-card result-info-card">
                                        <div className="card-body p-4 text-center">
                                            <h5 className="text-muted fw-bold mb-2 text-uppercase letter-spacing-1">Target Role</h5>
                                            <h3 className="fw-bold text-primary mb-0">{roadmap.target_job}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0 rounded-4 highlight-card result-info-card">
                                        <div className="card-body p-4 text-center">
                                            <h5 className="text-muted fw-bold mb-2 text-uppercase letter-spacing-1">Expected Salary</h5>
                                            <h3 className="fw-bold text-success mb-0">{roadmap.expected_salary}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {roadmap.job_description && roadmap.job_description !== "N/A" && (
                                <div className="row g-4 mb-4">
                                    <div className="col-12">
                                        <div className="card shadow-sm border-0 rounded-4" style={{ borderLeft: '4px solid #0dcaf0' }}>
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-2 text-info"><i className="bi bi-info-circle-fill me-2"></i>Job Definition</h5>
                                                <p className="text-muted mb-0">{roadmap.job_description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {roadmap.openings_plot_base64 && (
                                <div className="row g-4 mb-4">
                                    <div className="col-12">
                                        <div className="card shadow-sm border-0 rounded-4 highlight-card bg-white">
                                            <div className="card-body p-3 text-center">
                                                <img
                                                    src={roadmap.openings_plot_base64}
                                                    alt="Market Demand Trend for Next 3 Years"
                                                    className="img-fluid rounded pointer-events-none"
                                                    style={{ maxHeight: '450px', width: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {roadmap.domain && roadmap.domain !== "N/A" && (
                                <div className="row g-4 mb-4">
                                    <div className="col-md-4">
                                        <div className="card h-100 shadow-sm border-0 rounded-4 highlight-card bg-light">
                                            <div className="card-body p-3 text-center">
                                                <h6 className="text-muted fw-bold mb-1 text-uppercase letter-spacing-1" style={{ fontSize: "0.8rem" }}>Domain</h6>
                                                <h5 className="fw-bold text-dark mb-0">{roadmap.domain}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card h-100 shadow-sm border-0 rounded-4 highlight-card bg-light">
                                            <div className="card-body p-3 text-center">
                                                <h6 className="text-muted fw-bold mb-1 text-uppercase letter-spacing-1" style={{ fontSize: "0.8rem" }}>Difficulty</h6>
                                                <h5 className="fw-bold text-warning mb-0">{roadmap.difficulty_level}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card h-100 shadow-sm border-0 rounded-4 highlight-card bg-light">
                                            <div className="card-body p-3 text-center">
                                                <h6 className="text-muted fw-bold mb-1 text-uppercase letter-spacing-1" style={{ fontSize: "0.8rem" }}>AI Automation Risk</h6>
                                                <h5 className="fw-bold text-danger mb-0">{roadmap.ai_automation_risk}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {roadmap.pros && roadmap.pros.length > 0 && (
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <div className="card h-100 shadow-sm border-0 rounded-4" style={{ borderTop: "4px solid #198754 !important" }}>
                                            <div className="card-body p-4">
                                                <h5 className="text-success fw-bold mb-3"><i className="bi bi-hand-thumbs-up-fill me-2"></i> Pros</h5>
                                                <ul className="mb-0 text-muted" style={{ paddingLeft: "1.2rem" }}>
                                                    {roadmap.pros.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card h-100 shadow-sm border-0 rounded-4" style={{ borderTop: "4px solid #dc3545 !important" }}>
                                            <div className="card-body p-4">
                                                <h5 className="text-danger fw-bold mb-3"><i className="bi bi-hand-thumbs-down-fill me-2"></i> Cons</h5>
                                                <ul className="mb-0 text-muted" style={{ paddingLeft: "1.2rem" }}>
                                                    {roadmap.cons.map((c, i) => <li key={i}>{c}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row g-4 mb-5">
                                <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0 rounded-4 skills-card present-skills-card">
                                        <div className="card-body p-4">
                                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                                <i className="bi bi-check-circle-fill text-success me-2"></i> Acquired Skills
                                            </h5>
                                            {roadmap.present_skills.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {roadmap.present_skills.map((skill, index) => (
                                                        <span key={index} className="badge bg-success-soft text-success px-3 py-2 rounded-pill border border-success border-opacity-25">{skill}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">No matching skills found.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-100 shadow-sm border-0 rounded-4 skills-card missing-skills-card">
                                        <div className="card-body p-4">
                                            <h5 className="fw-bold mb-3 d-flex align-items-center">
                                                <i className="bi bi-exclamation-circle-fill text-danger me-2"></i> Missing Skills
                                            </h5>
                                            {roadmap.missing_skills.length > 0 ? (
                                                <div className="d-flex flex-wrap gap-2">
                                                    {roadmap.missing_skills.map((skill, index) => (
                                                        <a
                                                            key={index}
                                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="badge bg-danger-soft text-danger px-3 py-2 rounded-pill border border-danger border-opacity-25 text-decoration-none hover-shadow transition-all d-flex align-items-center gap-1"
                                                            title={`Find ${skill} tutorials on YouTube`}
                                                        >
                                                            {skill} <i className="bi bi-youtube ms-1"></i>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">You have all required skills!</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm border-0 rounded-4 path-card overflow-hidden">
                                <div className="card-header bg-primary text-white p-4 border-0">
                                    <h4 className="fw-bold mb-0"><i className="bi bi-map-fill me-2"></i> Personalized Learning Path</h4>
                                </div>
                                <div className="card-body p-4 p-md-5 bg-light">
                                    <div className="timeline">
                                        {roadmap.learning_path.map((step, index) => (
                                            <div key={index} className="timeline-item">
                                                <div className="timeline-marker bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="timeline-content bg-white p-4 rounded-4 shadow-sm border-0 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                                                    <p className="mb-0 fw-medium text-dark fs-5">{step}</p>
                                                    <a
                                                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(step + " tutorial course")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2 align-self-start align-self-sm-auto"
                                                    >
                                                        <i className="bi bi-youtube fs-5"></i>
                                                        <span>Watch Tutorials</span>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CareerRoadmap;