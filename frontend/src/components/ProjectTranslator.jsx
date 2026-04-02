import React, { useState } from 'react';
import './ProjectTranslator.css';

const ProjectTranslator = () => {
  const [formData, setFormData] = useState({ name: '', stack: '', desc: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recruiter_view');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/translate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if(data.success) {
        setResults(data.data);
      } else {
        alert('Translation failed.');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Error connecting to ML engine.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (results && results[activeTab]) {
      navigator.clipboard.writeText(results[activeTab]);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="career-roadmap-container py-5">
      <div className="row justify-content-center mb-5">
         <div className="col-12 col-md-8 text-center">
            <h2 className="display-5 fw-bold text-gradient mb-3">Project-to-Role Translator</h2>
            <p className="lead text-muted">Translate your technical projects into recruiter, tech lead, or elevator pitch friendly formats.</p>
         </div>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm border-0 rounded-4 roadmap-form-card p-4 h-100">
            <h4 className="mb-4 fw-bold text-center">Project Details</h4>
            <form onSubmit={handleTranslate}>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold small text-uppercase letter-spacing-1">Project Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. SmartHome"
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-bold small text-uppercase letter-spacing-1">Tech Stack</label>
                <input 
                  type="text" 
                  className="form-control bg-light border-0 py-2" 
                  name="stack" 
                  value={formData.stack} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Python, React"
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-bold small text-uppercase letter-spacing-1">Description</label>
                <textarea 
                  className="form-control bg-light border-0 py-2" 
                  name="desc" 
                  value={formData.desc} 
                  onChange={handleInputChange} 
                  required 
                  rows="4" 
                  placeholder="A brief description of what the project does..."
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 fw-bold py-2 mt-2" 
                disabled={loading}
              >
                {loading ? 'Translating...' : 'Translate for Career'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0 rounded-4 roadmap-form-card p-4 h-100 d-flex flex-column">
            
            <div className="d-flex overflow-auto pb-2 mb-3 border-bottom border-light">
               <div className="btn-group w-100" role="group">
                  <button 
                    type="button"
                    className={`btn ${activeTab === 'recruiter_view' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('recruiter_view')}
                  >
                    Recruiter View
                  </button>
                  <button 
                     type="button"
                    className={`btn ${activeTab === 'tech_lead_view' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('tech_lead_view')}
                  >
                    Tech Lead View
                  </button>
                  <button 
                     type="button"
                    className={`btn ${activeTab === 'elevator_pitch' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('elevator_pitch')}
                  >
                    Elevator Pitch
                  </button>
               </div>
            </div>
            
            <div className="flex-grow-1 p-3 bg-light rounded-3 d-flex flex-column justify-content-center border" style={{ minHeight: '200px' }}>
              {loading && <p className="text-muted text-center mb-0 fst-italic">Generating tailored description...</p>}
              {!loading && !results && <p className="text-muted text-center mb-0">Submit your project details to see the translation.</p>}
              {!loading && results && (
                <div className="result-text position-relative h-100">
                   <p className="mb-0 fs-5 text-dark">{results[activeTab]}</p>
                </div>
              )}
            </div>
            {!loading && results && (
               <button onClick={copyToClipboard} className="btn btn-outline-secondary mt-3 align-self-end fw-bold">
                 Copy to Clipboard
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTranslator;
