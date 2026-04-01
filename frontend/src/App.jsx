import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import AIChat from './components/AIChat';
import Landing from './components/Landing';
import MarketTrends from './components/MarketTrends';
import CareerRoadmap from './components/CareerRoadmap';
import CareerCompass from './components/CareerCompass';
import ProjectTranslator from './components/ProjectTranslator';

function App() {
  return (
    <Router>
      {/* Full Width Navbar */}
      <nav className="navbar navbar-custom w-100 px-3 px-md-4 d-flex align-items-center flex-nowrap" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Link className="navbar-brand fw-bold mb-0 h1 flex-shrink-0 me-4" to="/">
          EduTech
        </Link>
        <div className="d-flex align-items-center pb-1">
          <ul className="navbar-nav flex-row align-items-center m-0 p-0 gap-2 gap-md-3 flex-nowrap">
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/assessment">
                Start Assessment
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/trends">Market Trends</Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/roadmap">Career Roadmap</Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/upload">Analyze Resume</Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/chat">AI Assistant</Link>
            </li>
            <li className="nav-item">
              <Link className="btn-nav-assessment" to="/translator">Project Translator</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container-fluid px-4 px-md-5 mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/assessment" element={<CareerCompass />} />

          <Route path="/trends" element={<MarketTrends />} />
          <Route path="/roadmap" element={<CareerRoadmap />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/translator" element={<ProjectTranslator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
