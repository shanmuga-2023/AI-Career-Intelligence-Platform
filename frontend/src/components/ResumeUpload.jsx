import React, { useState } from 'react';
import axios from 'axios';

function ResumeUpload() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://127.0.0.1:5050/api/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data.data);
        } catch (e) {
            console.error(e);
            alert('Error analyzing resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mx-auto mt-5" style={{ maxWidth: '600px' }}>
            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Resume AI Analyzer</h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleUpload}>
                    <div className="mb-3">
                        <label className="form-label">Upload PDF Resume</label>
                        <input type="file" className="form-control" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={!file || loading}>
                        {loading ? 'Analyzing...' : 'Extract Skills'}
                    </button>
                </form>

                {result && (
                    <div className="mt-4 border rounded p-3 bg-light">
                        <h5>Detected Skills</h5>
                        <div className="mb-3">
                            {result.detectedSkills.map(skill => (
                                <span key={skill} className="badge bg-success me-2">{skill}</span>
                            ))}
                        </div>
                        <h6>Parsed Text Snippet:</h6>
                        <p className="small text-muted">{result.textSnippet}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResumeUpload;
