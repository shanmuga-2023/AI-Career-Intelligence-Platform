const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractSkills } = require('../services/resumeService');
const { getCareerAdvice } = require('../services/aiService');

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Resume parsing route
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const extractedData = await extractSkills(req.file.buffer);
        res.json({ success: true, data: extractedData });
    } catch (error) {
        console.error('Error parsing resume:', error);
        res.status(500).json({ error: 'Internal server error while processing resume' });
    }
});

// Gemini AI route
router.post('/career-advice', async (req, res) => {
    try {
        const { question, context } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const advice = await getCareerAdvice(question, context);
        res.json({ success: true, answer: advice });
    } catch (error) {
        console.error('Error getting AI advice:', error);
        res.status(500).json({ error: 'Internal server error from AI service' });
    }
});

// Assessment route
router.post('/assessment', async (req, res) => {
    try {
        const { name, area_of_interest, soft_skills, tech_skills } = req.body;

        if (!name || !area_of_interest) {
            return res.status(400).json({ error: 'Name and Area of Interest are required' });
        }

        const db = require('../database');

        const query = `INSERT INTO assessments (name, area_of_interest, soft_skills, tech_skills) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, area_of_interest, soft_skills, tech_skills], function (err) {
            if (err) {
                console.error('Error inserting assessment:', err);
                return res.status(500).json({ error: 'Failed to save assessment' });
            }
            res.json({ success: true, message: 'Assessment saved successfully', id: this.lastID });
        });

    } catch (error) {
        console.error('Error processing assessment:', error);
        res.status(500).json({ error: 'Internal server error processing assessment' });
    }
});

// Get Assessment Data
router.get('/assessment', (req, res) => {
    const db = require('../database');
    db.all(`SELECT * FROM assessments`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching assessments:', err);
            return res.status(500).json({ error: 'Failed to fetch assessments' });
        }
        res.json({ success: true, data: rows });
    });
});

// Get Market Trends
router.get('/market-trends', (req, res) => {
    // Mocked data for job market trends
    const trends = {
        topSkills: ["Python", "React", "Machine Learning", "Cloud Computing (AWS/GCP)", "Data Analysis"],
        trendingRoles: [
            { role: "AI/ML Engineer", growth: "+45%", avgSalary: "$130,000" },
            { role: "Full Stack Developer", growth: "+25%", avgSalary: "$110,000" },
            { role: "Data Scientist", growth: "+30%", avgSalary: "$125,000" },
            { role: "Cloud Architect", growth: "+35%", avgSalary: "$145,000" }
        ],
        industryInsights: "The tech industry is seeing a massive shift towards Artificial Intelligence and Cloud capabilities. Roles requiring a mix of software engineering and data science are highly sought after."
    };

    res.json({ success: true, data: trends });
});

module.exports = router;
