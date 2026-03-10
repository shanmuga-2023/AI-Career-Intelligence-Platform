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
                        <div className="card-body p-4">
                            <div className="icon-wrapper mb-3 bg-primary-soft text-primary">
                                <i className="bi bi-stars fs-3"></i>
                            </div>
                            <h4 className="fw-bold mb-4">Top In-Demand Skills</h4>
                            <ul className="list-group list-group-flush">
                                {trends.topSkills.map((skill, index) => (
                                    <li key={index} className="list-group-item bg-transparent px-0 border-light d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-3"></i>
                                        <span className="fw-medium text-dark">{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card h-100 shadow-sm border-0 rounded-4 trend-card roles-card">
                        <div className="card-body p-4">
                            <div className="icon-wrapper mb-3 bg-secondary-soft text-secondary">
                                <i className="bi bi-graph-up-arrow fs-3"></i>
                            </div>
                            <h4 className="fw-bold mb-4">Trending Roles & Growth</h4>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="border-0 rounded-start">Role</th>
                                            <th scope="col" className="border-0 text-center">YoY Growth</th>
                                            <th scope="col" className="border-0 rounded-end text-end">Avg Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trends.trendingRoles.map((role, index) => (
                                            <tr key={index}>
                                                <td className="fw-medium text-dark border-light py-3">{role.role}</td>
                                                <td className="text-center border-light py-3">
                                                    <span className="badge bg-success-soft text-success rounded-pill px-3 py-2">
                                                        {role.growth} <i className="bi bi-arrow-up-short"></i>
                                                    </span>
                                                </td>
                                                <td className="text-end fw-bold text-primary border-light py-3">{role.avgSalary}</td>
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
