import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import AIChat from './components/AIChat';
import Landing from './components/Landing';
import Features from './components/Features';
import MarketTrends from './components/MarketTrends';
import CareerRoadmap from './components/CareerRoadmap';

function App() {
  return (
    <Router>
      {/* Full Width Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom w-100 px-4">
        <Link className="navbar-brand fw-bold text-white mb-0 h1" to="/">
          CareerAI
        </Link>
        <div className="collapse navbar-collapse d-flex justify-content-end">
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Career Assessment</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/features">Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/trends">Market Trends</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/roadmap">Career Roadmap</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">Analyze Resume</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">AI Assistant</Link>
            </li>
            <li className="nav-item ms-3">
              <Link className="btn btn-nav-assessment" to="/dashboard">
                Start Assessment
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container-fluid px-4 px-md-5 mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/trends" element={<MarketTrends />} />
          <Route path="/roadmap" element={<CareerRoadmap />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/chat" element={<AIChat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
