import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareerCompass.css';

const SKILLS_LIST = [
  "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "Dart", "Go", "Rust", "Kotlin", "Swift", "R", "Julia", "MATLAB", "Solidity", "HTML",
  "CSS", "React", "Angular", "Vue.js", "Node.js", "Express.js", "Next.js", "Django", "Flask", "Flutter", "React Native", "Android SDK", "iOS SDK",
  "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "OpenCV", "Hugging Face Transformers", "Hadoop", "Apache Spark", "Kafka", "Airflow", "PostgreSQL",
  "MySQL", "MongoDB", "Redis", "Cassandra", "AWS", "Microsoft Azure", "Google Cloud", "Firebase", "Docker", "Kubernetes", "Terraform", "Jenkins", "Git",
  "GitHub Actions", "Wireshark", "Metasploit", "Nmap", "Burp Suite", "Kali Linux", "Web3.js", "Hardhat", "Truffle", "Ganache", "Unity", "Unreal Engine",
  "OpenGL", "Vulkan", "Three.js", "ROS", "Arduino", "Raspberry Pi", "Gazebo", "WebXR", "A-Frame", "Blender"
];

function CareerCompass() {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleRecommendations = async () => {
        if (selectedSkills.length === 0) {
            alert("Please select at least one skill to get recommendations.");
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/recommend-jobs', {
                user_skills: selectedSkills
            });
            if (res.data.success) {
                setRecommendations(res.data.data);
            } else {
                setError('Failed to fetch recommendations.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to ML Engine. Ensure python backend is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="compass-container">
            <div className="compass-header">
                <h1 className="compass-title display-5">CareerCompass</h1>
                <p className="compass-subtitle">
                    Discover the right career path based on your skills and interests. Select the technologies you are familiar with and get personalized recommendations.
                </p>
            </div>

            <hr className="compass-divider" />

            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row">
                    {/* Left Column - Skills */}
                    <div className="col-md-9 mb-4 pr-lg-5">
                        <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Select Your Skills</h4>
                        <div className="d-flex flex-wrap gap-3">
                            {SKILLS_LIST.map((skill, index) => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                    <button
                                        key={index}
                                        className={`skill-pill ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column - Selected Skills Panel */}
                    <div className="col-md-3">
                        <div className="selected-panel">
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Selected Skills</h4>
                            
                            {selectedSkills.length === 0 ? (
                                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>No skills selected yet</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    {selectedSkills.map((skill, index) => (
                                        <span key={index} className="selected-badge">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <button 
                                className="btn-recommend w-100 mb-2"
                                onClick={handleRecommendations}
                                disabled={loading}
                            >
                                {loading ? 'Analyzing...' : 'Get Recommendations'}
                            </button>
                            {error && <div className="text-danger small mt-2">{error}</div>}
                        </div>
                    </div>
                </div>

                {/* Recommendations Results Section */}
                {recommendations.length > 0 && (
                    <div className="row mt-5">
                        <div className="col-12">
                            <h3 className="fw-bold mb-4 border-bottom pb-2">Top Recommended Paths</h3>
                        </div>
                        {recommendations.map((rec, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card h-100 shadow-sm border-0 rounded-4" style={{ backgroundColor: index === 0 ? '#1a1a1a' : '#ffffff', color: index === 0 ? '#ffffff' : '#1a1a1a' }}>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className={`badge ${index === 0 ? 'bg-light text-dark' : 'bg-dark text-white'} rounded-pill px-3 py-2 fw-normal`}>
                                                {rec.match_percentage}% Match
                                            </span>
                                            {index === 0 && <span className="small fw-bold text-success">Best Fit</span>}
                                        </div>
                                        <h4 className="fw-bold mb-2">{rec.target_job}</h4>
                                        <p className="mb-1" style={{ fontSize: '0.9rem', opacity: 0.8 }}><i className="bi bi-building me-2"></i>{rec.domain}</p>
                                        <p className="mb-4" style={{ fontSize: '0.9rem', opacity: 0.8 }}><i className="bi bi-wallet2 me-2"></i>{rec.expected_salary}</p>
                                        
                                        <button 
                                            className={`btn w-100 mt-auto fw-bold py-2 ${index === 0 ? 'btn-light' : 'btn-outline-dark'}`}
                                            style={{ borderRadius: '6px' }}
                                            onClick={() => navigate('/roadmap', { state: { userSkills: selectedSkills.join(', '), targetJob: rec.target_job } })}
                                        >
                                            View Roadmap <i className="bi bi-arrow-right ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CareerCompass;
