import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareerCompass.css';

const SKILLS_LIST = [
    "Python", "C", "C++", "C#", "Java", "Terraform", "Kubernetes", "TensorFlow", "Docker", "Unity", "PyTorch", "Maya", "AWS", "Unreal Engine", "Figma", "Wireshark", "React", "Blender", "CUDA", "Hardhat", "CrowdStrike", "Splunk", "Qiskit", "Houdini", "REST APIs", "Node.js", "ROS2", "Gazebo", "MATLAB", "OpenCV", "Solidity", "Ansible", "Palo Alto", "Vulkan", "Unreal", "Cirq", "PennyLane", "Substance Painter", "LangChain", "JAX", "dbt", "BigQuery", "Snowflake", "Postman", "IPFS", "ethers.js", "Azure", "GCP", "GitHub Actions", "Nessus", "Jenkins", "Prometheus", "OpenGL", "HLSL", "RenderDoc", "OpenXR", "WebXR", "QuTiP", "3ds Max", "ZBrush", "AWS SageMaker", "Hugging Face", "SHAP", "OpenAI API", "Weights & Biases", "TensorRT", "ONNX", "Airflow", "ARKit", "ARCore", "OpenAI Gym", "PostgreSQL", "Apache Spark", "Kafka", "Web3.js", "VMware", "Helm", "Backstage", "ArgoCD", "NLTK", "SpaCy", "IBM QRadar", "SQL", "Tableau", "scikit-learn", "The Graph", "MQTT", "STM32", "Arduino", "TypeScript", "Tailwind CSS", "DirectX", "GLSL", "Metal", "SteamVR", "HoloLens SDK", "Nagios", "Linux", "Maze", "Hotjar", "JIRA", "IBM Quantum", "LabVIEW", "MoveIt", "AWS Security Hub", "Grafana", "PagerDuty", "AWS/Azure/GCP", "Git", "Selenium", "pytest", "Storybook", "Cinema 4D", "After Effects", "Marmoset Toolbag", "Substance Designer", "Rhino", "KeyShot", "IBM AI Fairness 360", "LIME", "Fairlearn", "Aequitas", "Jira", "HuggingFace", "Azure AI", "GCP Vertex AI", "NVIDIA Jetson", "OpenVINO", "Looker", "FastAPI", "Swagger", "Express", "Django REST", "Vuforia", "Spark AR", "Lens Studio", "Custom simulators", "Prolog", "CARLA", "Apollo", "NVIDIA DRIVE", "Django", "Spring Boot", "Redis", "Hadoop", "Hive", "Databricks", "AWS EMR", "Ethereum", "Truffle", "MythX", "Slither", "Echidna", "Manticore", "CloudFormation", "AWS EC2", "VPC", "OpenStack", "AWS Transit Gateway", "Azure Virtual WAN", "Cisco Meraki", "AWS GuardDuty", "Azure Defender", "Prisma Cloud", "IBM Watson", "Neo4j", "YOLO", "Detectron2", "Rasa", "Dialogflow", "Botpress", "Twilio", "Erwin", "AWS Glue", "Apache Atlas", "Python (scikit-learn)", "R", "KNIME", "Weka", "Jupyter", "Autopsy", "FTK", "Volatility", "EnCase", "SIFT", "Apache Kafka", "ZooKeeper", "etcd", "gRPC", "Cassandra", "AWS Greengrass", "Azure IoT Edge", "K3s", "FreeRTOS", "Keil", "JTAG", "Oscilloscope", "Vue.js", "Webpack", "MongoDB", "FMOD", "LLVM", "Custom engines", "Unity (C# internals)", "DirectX 12", "MPI", "OpenMP", "SLURM", "Intel MKL", "HPC clusters", "User testing tools", "Qualys", "ROS", "Simulink", "Adobe XD", "InVision", "Raspberry Pi", "AWS IoT Core", "Node-RED", "MLflow", "Kubeflow", "IDA Pro", "Ghidra", "Cuckoo Sandbox", "YARA", "OllyDbg", "Decentraland SDK", "Roblox Studio", "Flutter", "React Native", "Swift", "Kotlin", "Xcode", "Android Studio", "BERT", "Cisco IOS", "Juniper", "SolarWinds", "Cisco ASA", "Snort", "Suricata", "Zeek", "Linux kernel", "GDB", "Valgrind", "QEMU", "Rust", "Assembly", "Kali Linux", "Metasploit", "Burp Suite", "Nmap", "Cobalt Strike", "Selenium (basic)", "TestRail", "BrowserStack", "NIST PQC algorithms", "OpenSSL PQC", "Qiskit ML", "TensorFlow Quantum", "Q#", "custom cryogenic control systems", "Stable Baselines3", "RLlib", "Unity ML-Agents", "NVIDIA RTX", "NVIDIA Isaac", "URDF", "FPGA tools", "Unity Shader Graph", "Unreal Material Editor", "MATLAB Simulink", "PhysX", "Foundry", "OpenZeppelin", "Etherscan", "Event-driven architecture tools", "UML", "IntelliJ", "VS Code", "Python/Java/C++", "CI/CD", "JUnit", "Chaos Monkey", "Active Directory", "Bash", "PowerShell", "Enterprise service buses", "TOGAF tools", "Playwright", "Cypress", "Appium", "Recorded Future", "ThreatConnect", "MISP", "MITRE ATT&CK", "Framer", "Nuke", "Arnold", "RenderMan", "Meta Quest SDK", "WordPress", "MySQL", "PHP", "Bootstrap", "Zscaler", "Palo Alto Prisma", "Okta", "BeyondTrust"
];

const INTEREST_LIST = [
    "Drawing and Sketching", "Digital Art and Illustration", "3D Modeling and Animation", "Video Editing and Visual Effects", "Designing User Interfaces",
    "Designing User Experiences", "Creating Mobile Apps", "Building Websites", "Creating Video Games", "Programming and Coding",
    "Scripting and Automation", "Problem Solving and Logical Thinking", "Mathematics and Algorithms", "Artificial Intelligence and Chatbots",
    "Machine Learning and Deep Learning", "Computer Vision and Image Processing", "Natural Language Processing", "Data Analysis and Data Visualization",
    "Big Data Processing", "Cybersecurity and Ethical Hacking", "Investigating Digital Crimes", "Network Engineering and Infrastructure",
    "Cloud Computing and DevOps", "Building Distributed Systems", "Blockchain and Cryptocurrency", "Developing Smart Contracts",
    "Robotics and Automation", "Building Autonomous Vehicles", "Building Smart Devices (IoT)", "Embedded Systems Programming",
    "Testing Software and Debugging", "Virtual Reality Development", "Metaverse and Immersive Systems", "Researching Future Technologies",
    "Working with Databases", "Building APIs and Backend Systems", "Working with Open Source Software"
];

function CareerCompass() {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const resultsRef = useRef(null);

    const toggleSkill = (skill) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleRecommendations = async () => {
        if (selectedSkills.length === 0 && selectedInterests.length === 0) {
            alert("Please select at least one skill or interest to get recommendations.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/recommend-jobs', {
                user_skills: selectedSkills,
                user_interests: selectedInterests
            });
            if (res.data.success) {
                setRecommendations(res.data.data);
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
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
                <h1 className="compass-title display-5 fw-bold">Career Assessment</h1>
                <p className="compass-subtitle text-center mx-auto mt-3">
                    Discover the right career path based on your skills and interests. Select the technologies you are familiar with and get personalized recommendations.
                </p>
            </div>

            <hr className="compass-divider" />

            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row">
                    {/* Left Column - Skills */}
                    <div className="col-md-9 mb-4 pr-lg-5">
                        <div className="mb-5">
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Select Your Skills</h4>
                            <div className="d-flex flex-wrap gap-2">
                                {(showAllSkills ? SKILLS_LIST : SKILLS_LIST.slice(0, Math.ceil(SKILLS_LIST.length / 4))).map((skill, index) => {
                                    const isSelected = selectedSkills.includes(skill);
                                    return (
                                        <button
                                            key={`skill-${index}`}
                                            className={`skill-pill ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleSkill(skill)}
                                        >
                                            {skill}
                                        </button>
                                    );
                                })}
                            </div>
                            {SKILLS_LIST.length > Math.ceil(SKILLS_LIST.length / 4) && (
                                <div className="mt-3 text-start">
                                    <button 
                                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" 
                                        onClick={() => setShowAllSkills(!showAllSkills)}
                                    >
                                        {showAllSkills ? 'Show Less' : `Show ${SKILLS_LIST.length - Math.ceil(SKILLS_LIST.length / 4)} More`} <i className={`bi bi-chevron-${showAllSkills ? 'up' : 'down'} ms-1`}></i>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Select Your Interests</h4>
                            <div className="d-flex flex-wrap gap-2">
                                {INTEREST_LIST.map((interest, index) => {
                                    const isSelected = selectedInterests.includes(interest);
                                    return (
                                        <button
                                            key={`interest-${index}`}
                                            className={`skill-pill ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleInterest(interest)}
                                        >
                                            {interest}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Selected Skills Panel */}
                    <div className="col-md-3">
                        <div className="selected-panel">
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Your Profile</h4>

                            {selectedSkills.length === 0 && selectedInterests.length === 0 ? (
                                <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>No selections yet</p>
                            ) : (
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {selectedSkills.length > 0 && (
                                        <div>
                                            <span className="text-muted small fw-bold text-uppercase d-block mb-2">Skills</span>
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedSkills.map((skill, index) => (
                                                    <span key={`s-${index}`} className="selected-badge">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedInterests.length > 0 && (
                                        <div>
                                            <span className="text-muted small fw-bold text-uppercase d-block mb-2">Interests</span>
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedInterests.map((interest, index) => (
                                                    <span key={`i-${index}`} className="selected-badge border-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white' }}>
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                    <div className="row mt-5 pt-4" ref={resultsRef}>
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
                                            onClick={() => navigate('/roadmap', {
                                                state: {
                                                    userSkills: selectedSkills.join(', '),
                                                    userInterests: selectedInterests.join(', '),
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
                )}
            </div>
        </div>
    );
}

export default CareerCompass;
