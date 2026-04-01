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
    <div className="translator-wrapper">
      <div className="row justify-content-center">
        <h2 className="title mb-4 text-center">Project-to-Role Translator</h2>
        <div className="col-lg-5 mb-4">
          <div className="glass-card translator-card p-4 h-100">
            <h4 className="mb-3">Project Details</h4>
            <form onSubmit={handleTranslate}>
              <div className="mb-3">
                <label className="form-label text-muted">Project Name</label>
                <input 
                  type="text" 
                  className="form-control glass-input" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. SmartHome"
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted">Tech Stack</label>
                <input 
                  type="text" 
                  className="form-control glass-input" 
                  name="stack" 
                  value={formData.stack} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. Python, React"
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted">Description</label>
                <textarea 
                  className="form-control glass-input" 
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
                className="btn btn-primary w-100 translator-btn" 
                disabled={loading}
              >
                {loading ? 'Translating...' : 'Translate for Career'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7 mb-4">
          <div className="glass-card translator-card p-4 h-100 d-flex flex-column">
            <div className="tabs-container d-flex gap-2 mb-3">
              <button 
                className={`tab-btn ${activeTab === 'recruiter_view' ? 'active' : ''}`}
                onClick={() => setActiveTab('recruiter_view')}
              >
                Recruiter View
              </button>
              <button 
                className={`tab-btn ${activeTab === 'tech_lead_view' ? 'active' : ''}`}
                onClick={() => setActiveTab('tech_lead_view')}
              >
                Tech Lead View
              </button>
              <button 
                className={`tab-btn ${activeTab === 'elevator_pitch' ? 'active' : ''}`}
                onClick={() => setActiveTab('elevator_pitch')}
              >
                Elevator Pitch
              </button>
            </div>
            
            <div className="result-container flex-grow-1 p-3 d-flex flex-column justify-content-center">
              {loading && <p className="text-secondary text-center mb-0">Generating tailored description...</p>}
              {!loading && !results && <p className="text-secondary text-center mb-0">Submit your project details to see the translation.</p>}
              {!loading && results && (
                <div className="result-text position-relative h-100">
                   <p className="mb-0">{results[activeTab]}</p>
                </div>
              )}
            </div>
            {!loading && results && (
               <button onClick={copyToClipboard} className="btn copy-btn mt-3 align-self-end">
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
