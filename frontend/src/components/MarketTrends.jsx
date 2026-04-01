import { useState, useEffect } from 'react';
import axios from 'axios';
import './MarketTrends.css';

function MarketTrends() {
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/market-trends');
                if (response.data.success) {
                    setTrends(response.data.data);
                } else {
                    setError('Failed to load market trends.');
                }
            } catch (err) {
                console.error('Error fetching market trends:', err);
                setError('Network error or server is down.');
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Analyzing Real-time Market Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger shadow-sm rounded-4" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="market-trends-container py-5">
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-10 text-center">
                    <h2 className="display-5 fw-bold text-gradient mb-3">Real-time Job Market Trends</h2>
                    <p className="lead text-muted">{trends.industryInsights}</p>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-4">
                    <div className="card h-100 shadow-sm border-0 rounded-4 trend-card top-skills-card">
                        <div className="card-body p-4 p-lg-5">
                            <div className="avatar-blue"></div>
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Top In-Demand Skills</h4>
                            <ul className="list-group list-group-flush">
                                {trends.topSkills.map((skill, index) => (
                                    <li key={index} className="list-group-item bg-transparent px-2 border-light d-flex align-items-center">
                                        <span className="fw-medium text-dark flex-grow-1">{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card h-100 shadow-sm border-0 rounded-4 trend-card roles-card">
                        <div className="card-body p-4 p-lg-5">
                            <div className="avatar-green"></div>
                            <h4 className="fw-bold mb-4" style={{ color: '#1a1a1a' }}>Trending Roles & Growth</h4>
                            <div className="table-responsive">
                                <table className="table align-middle mb-0 border-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="border-0 rounded-start">Role</th>
                                            <th scope="col" className="border-0 text-center">Growth</th>
                                            <th scope="col" className="border-0 rounded-end text-end">Avg Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trends.trendingRoles.map((role, index) => (
                                            <tr key={index}>
                                                <td className="fw-medium text-dark border-light py-4 px-3" style={{ fontSize: '0.95rem' }}>{role.role}</td>
                                                <td className="text-center border-light py-4">
                                                    <span className="growth-badge">
                                                        {role.growth}
                                                    </span>
                                                </td>
                                                <td className="text-end border-light py-4 px-3 salary-text">{role.avgSalary}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarketTrends;
