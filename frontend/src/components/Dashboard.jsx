import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
    const [userSkills, setUserSkills] = useState('python, sql, pandas');
    const [jobSkills, setJobSkills] = useState('python, machine learning, sql');
    const [matchResult, setMatchResult] = useState(null);

    const [numSkills, setNumSkills] = useState(5);
    const [expYears, setExpYears] = useState(2);
    const [certCount, setCertCount] = useState(1);
    const [empScore, setEmpScore] = useState(null);

    // Assessment State
    const [assessName, setAssessName] = useState('');
    const [assessInterest, setAssessInterest] = useState('');
    const [assessSoftSkills, setAssessSoftSkills] = useState('');
    const [assessTechSkills, setAssessTechSkills] = useState('');
    const [assessStatus, setAssessStatus] = useState(null);
    const [showAssessmentForm, setShowAssessmentForm] = useState(false);

    const handleMatchSkills = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/match-skills', {
                user_skills: userSkills.split(',').map(s => s.trim()),
                job_skills: jobSkills.split(',').map(s => s.trim())
            });
            setMatchResult(res.data.data);
        } catch (e) {
            console.error(e);
            alert('Error connecting to ML Engine for Skill Match');
        }
    };

    const handlePredictEmployability = async () => {
        try {
            const res = await axios.post('http://127.0.0.1:8000/predict-employability', {
                num_skills: numSkills,
                experience_years: expYears,
                certifications_count: certCount
            });
            setEmpScore(res.data.score);
        } catch (e) {
            console.error(e);
            alert('Error connecting to ML Engine for Prediction');
        }
    };

    const handleAssessmentSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5050/api/assessment', {
                name: assessName,
                area_of_interest: assessInterest,
                soft_skills: assessSoftSkills,
                tech_skills: assessTechSkills
            });
            if (res.data.success) {
                setAssessStatus('success');
                setAssessName('');
                setAssessInterest('');
                setAssessSoftSkills('');
                setAssessTechSkills('');
                setTimeout(() => {
                    setAssessStatus(null);
                    setShowAssessmentForm(false);
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            setAssessStatus('error');
            setTimeout(() => setAssessStatus(null), 3000);
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-column mb-5 mt-4">
                <h2 className="fw-bold section-title mb-2">Interactive Career Tools</h2>
                <p className="text-muted">Take an assessment, match your skills to jobs, and predict your employability.</p>
            </div>

            <div className="row">
                {/* Assessment Navigation Button */}
                <div className="col-12 mb-4 text-center">
                    <Link
                        className="btn btn-warning btn-lg fw-bold px-5 py-3 shadow-sm rounded-pill transition-all"
                        style={{ transition: 'all 0.3s ease' }}
                        to="/assessment"
                    >
                        <i className="bi bi-play-circle me-2"></i>
                        Start Assessment
                    </Link>
                </div>

                {/* Skill Matcher */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Skill Matcher (ML Engine)</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label>Your Skills (comma separated)</label>
                                <input type="text" className="form-control" value={userSkills} onChange={(e) => setUserSkills(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Target Job Skills</label>
                                <input type="text" className="form-control" value={jobSkills} onChange={(e) => setJobSkills(e.target.value)} />
                            </div>
                            <button className="btn btn-success w-100" onClick={handleMatchSkills}>Calculate Match</button>

                            {matchResult && (
                                <div className="mt-4 p-3 border rounded bg-light">
                                    <h6>Match Percentage: {matchResult.match_percentage}%</h6>
                                    <p className="mb-1 text-success">Matching: {matchResult.matching_skills.join(', ')}</p>
                                    <p className="mb-0 text-danger">Missing: {matchResult.missing_skills.join(', ')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Employability Score */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-info text-dark">
                            <h5 className="mb-0">Predict Employability (Linear Regression)</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label>Number of Skills</label>
                                <input type="number" className="form-control" value={numSkills} onChange={(e) => setNumSkills(parseInt(e.target.value))} />
                            </div>
                            <div className="mb-3">
                                <label>Years of Experience</label>
                                <input type="number" className="form-control" value={expYears} onChange={(e) => setExpYears(parseFloat(e.target.value))} />
                            </div>
                            <div className="mb-3">
                                <label>Certifications</label>
                                <input type="number" className="form-control" value={certCount} onChange={(e) => setCertCount(parseInt(e.target.value))} />
                            </div>
                            <button className="btn btn-info w-100" onClick={handlePredictEmployability}>Predict Score</button>

                            {empScore !== null && (
                                <div className="mt-4 text-center">
                                    <h1 className="display-4 fw-bold">{empScore} / 100</h1>
                                    <p className="text-muted">Predicted Score</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
