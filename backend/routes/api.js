const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractSkills } = require('../services/resumeService');
const { getCareerAdvice, conductMockInterview } = require('../services/aiService');
const fs = require('fs');
const path = require('path');

// Helper to parse simple CSV without quoted commas
function parseSimpleCSV(filePath) {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const obj = {};
        headers.forEach((h, index) => {
            obj[h.trim()] = row[index] ? row[index].trim() : '';
        });
        data.push(obj);
    }
    return data;
}

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
    try {
        const historyPath = path.resolve(__dirname, '../../ml-engine/history.csv');
        const techPath = path.resolve(__dirname, '../../ml-engine/technology.csv');
        
        const historyData = parseSimpleCSV(historyPath);
        const techData = parseSimpleCSV(techPath);
        
        let topSkills = ["Python", "React", "Machine Learning", "Cloud Computing (AWS/GCP)", "Data Analysis"];
        if (techData && techData.length > 0) {
            // Filter random top skills from CSV for variety or just grab top 5
            topSkills = techData.slice(0, 5).map(t => t.tech_name);
        }
        
        let trendingRoles;
        let industryInsights = "The tech industry is seeing a massive shift towards Artificial Intelligence and Cloud capabilities. Roles requiring a mix of software engineering and data science are highly sought after.";
        if (historyData && historyData.length > 0) {
            const rolesMap = {};
            historyData.forEach(row => {
                const role = row.career_name;
                const year = parseInt(row.year);
                const salary = parseInt(row.avg_salary_usd);
                const hires = parseInt(row.hires);
                
                if (!role || isNaN(year)) return;
                
                if (!rolesMap[role]) {
                    rolesMap[role] = { latestYear: year, latestHires: hires, prevHires: 0, avgSalary: salary };
                } else {
                    if (year > rolesMap[role].latestYear) {
                        rolesMap[role].prevHires = rolesMap[role].latestHires;
                        rolesMap[role].latestYear = year;
                        rolesMap[role].latestHires = hires;
                        rolesMap[role].avgSalary = salary;
                    } else if (year === rolesMap[role].latestYear - 1) {
                        rolesMap[role].prevHires = hires;
                    }
                }
            });
            
            trendingRoles = [];
            for (const [role, data] of Object.entries(rolesMap)) {
                let growth = 0;
                if (data.prevHires > 0) {
                    growth = Math.round(((data.latestHires - data.prevHires) / data.prevHires) * 100);
                } else {
                    growth = 15; // default reasonable growth if missing prev
                }
                trendingRoles.push({
                    role: role,
                    growth: growth >= 0 ? `+${growth}%` : `${growth}%`,
                    avgSalary: `INR ${(data.avgSalary || 120000).toLocaleString()}`
                });
            }
            
            trendingRoles.sort((a, b) => parseInt(b.growth) - parseInt(a.growth));
            trendingRoles = trendingRoles.slice(0, 5); // top 5
            if (trendingRoles.length > 2) {
                industryInsights = `Derived from real historical data. Roles like ${trendingRoles[0].role} and ${trendingRoles[1].role} are seeing the highest year-over-year gains in hiring volume.`;
            }
        } else {
            // Fallback mock
            trendingRoles = [
                { role: "AI/ML Engineer", growth: "+45%", avgSalary: "INR 130,000" },
                { role: "Full Stack Developer", growth: "+25%", avgSalary: "INR 110,000" },
                { role: "Data Scientist", growth: "+30%", avgSalary: "INR 125,000" },
                { role: "Cloud Architect", growth: "+35%", avgSalary: "INR 145,000" }
            ];
        }

        const trends = {
            topSkills: topSkills,
            trendingRoles: trendingRoles,
            industryInsights: industryInsights
        };
    
        res.json({ success: true, data: trends });
    } catch (err) {
        console.error('Error serving market trends:', err);
        res.status(500).json({ error: 'Failed to process market trends' });
    }
});

// Mock Interview route
router.post('/mock-interview', async (req, res) => {
    try {
        const { role, techStack, message, history } = req.body;
        if (!role || !techStack) {
            return res.status(400).json({ error: 'Role and Tech Stack are required' });
        }

        const aiResponse = await conductMockInterview(role, techStack, message, history);
        res.json({ success: true, answer: aiResponse });
    } catch (error) {
        console.error('Error conducting mock interview:', error);
        res.status(500).json({ error: 'Internal server error from AI service' });
    }
});

module.exports = router;
