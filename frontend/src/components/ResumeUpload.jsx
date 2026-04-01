import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CareerRoadmap.css';

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const resultsRef = useRef(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setRecommendations([]);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://127.0.0.1:5050/api/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const extractedData = res.data.data;
            setResult(extractedData);

            if (extractedData.detectedSkills && extractedData.detectedSkills.length > 0) {
                const mlRes = await axios.post('http://localhost:8000/recommend-jobs', {
                    user_skills: extractedData.detectedSkills,
                    user_interests: []
                });
                if (mlRes.data.success) {
                    setRecommendations(mlRes.data.data);
                    setTimeout(() => {
                        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                }
            }
        } catch (e) {
            console.error(e);
            alert('Error analyzing resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="career-roadmap-container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8 text-center">
                    <h2 className="display-5 fw-bold text-gradient mb-3">Resume AI Analyzer</h2>
                    <p className="lead text-muted">Upload your PDF resume to extract core skills and instantly match with your ideal roles.</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-sm border-0 rounded-4 roadmap-form-card mb-5">
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleUpload}>
                                <div className="row g-4 justify-content-center align-items-end">
                                    <div className="col-md-8">
                                        <label className="form-label fw-medium">Upload PDF Resume</label>
                                        <input type="file" className="form-control form-control-lg" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <button type="submit" className="btn w-100 btn-primary btn-lg rounded-pill shadow-sm" disabled={!file || loading}>
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Thinking...</>
                                            ) : (
                                                'Analyze Profile'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {result && (
                        <div className="roadmap-results fade-in mb-5">
                            <div className="card shadow-sm border-0 rounded-4 path-card overflow-hidden">
                                <div className="card-header bg-primary text-white p-4 border-0">
                                    <h4 className="fw-bold mb-0"><i className="bi bi-file-earmark-text-fill me-2"></i> Extraction Summary</h4>
                                </div>
                                <div className="card-body p-4 p-md-5 bg-light">
                                    <h5 className="fw-bold text-dark mb-3">Detected Proficiencies</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-4">
                                        {result.detectedSkills.length > 0 ? result.detectedSkills.map(skill => (
                                            <span key={skill} className="badge bg-success-soft text-success px-3 py-2 rounded-pill border border-success border-opacity-25">{skill}</span>
                                        )) : <span className="small text-muted">No specific tech skills parsed.</span>}
                                    </div>
                                    <h5 className="fw-bold text-dark mb-3">Parsed Resume Text</h5>
                                    <div className="bg-white p-4 rounded-4 shadow-sm border-0">
                                        <p className="small text-muted mb-0" style={{ maxHeight: '150px', overflowY: 'auto' }}>{result.textSnippet}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Recommendations Results Section */}
                    {recommendations.length > 0 && (
                        <div className="row pt-4 fade-in" ref={resultsRef}>
                            <div className="col-12 text-center mb-5">
                                <h3 className="fw-bold text-gradient display-6">Top Role Matches</h3>
                                <p className="text-muted">Based on the verified capabilities pulled from your resume.</p>
                            </div>
                            
                            <div className="row g-4">
                                {recommendations.map((rec, index) => (
                                    <div className="col-md-4 mb-4" key={index}>
                                        <div className="card h-100 shadow-sm border-0 rounded-4" style={{ background: index === 0 ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(255, 255, 255, 0.7)', color: index === 0 ? '#ffffff' : '#1a1a1a', backdropFilter: 'blur(20px)' }}>
                                            <div className="card-body p-4 d-flex flex-column">
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className={`badge ${index === 0 ? 'bg-light text-primary' : 'bg-primary text-white'} rounded-pill px-3 py-2 fw-bold`}>
                                                        {rec.match_percentage}% Match
                                                    </span>
                                                    {index === 0 && <span className="small fw-bold text-light"><i className="bi bi-star-fill text-warning me-1"></i> Best Fit</span>}
                                                </div>
                                                <h4 className="fw-bold mb-2">{rec.target_job}</h4>
                                                <p className="mb-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}><i className="bi bi-building me-2"></i>{rec.domain}</p>
                                                <p className="mb-4" style={{ fontSize: '0.9rem', opacity: 0.9 }}><i className="bi bi-wallet2 me-2"></i>{rec.expected_salary}</p>
                                                
                                                <button
                                                    className={`btn w-100 mt-auto fw-bold py-2 shadow-sm ${index === 0 ? 'btn-light text-primary' : 'btn-outline-primary bg-white'}`}
                                                    style={{ borderRadius: '50px' }}
                                                    onClick={() => navigate('/roadmap', {
                                                        state: {
                                                            userSkills: result.detectedSkills.join(', '),
                                                            userInterests: '',
                                                            targetJob: rec.target_job
                                                        }
                                                    })}
                                                >
                                                    View Roadmap <i className="bi bi-arrow-right ms-2"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeUpload;
