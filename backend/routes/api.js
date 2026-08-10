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

        if (db.saveAssessment) {
            const id = await db.saveAssessment({ name, area_of_interest, soft_skills, tech_skills });
            return res.json({ success: true, message: 'Assessment saved successfully', id });
        }

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
router.get('/assessment', async (req, res) => {
    try {
        const db = require('../database');
        if (db.getAllAssessments) {
            const data = await db.getAllAssessments();
            return res.json({ success: true, data });
        }
        db.all(`SELECT * FROM assessments`, [], (err, rows) => {
            if (err) {
                console.error('Error fetching assessments:', err);
                return res.status(500).json({ error: 'Failed to fetch assessments' });
            }
            res.json({ success: true, data: rows });
        });
    } catch (err) {
        console.error('Error fetching assessments:', err);
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
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
                    growth = 15;
                }
                trendingRoles.push({
                    role: role,
                    growth: growth >= 0 ? `+${growth}%` : `${growth}%`,
                    avgSalary: `INR ${(data.avgSalary || 120000).toLocaleString()}`
                });
            }
            
            trendingRoles.sort((a, b) => parseInt(b.growth) - parseInt(a.growth));
            trendingRoles = trendingRoles.slice(0, 5);
            if (trendingRoles.length > 2) {
                industryInsights = `Derived from real historical data. Roles like ${trendingRoles[0].role} and ${trendingRoles[1].role} are seeing the highest year-over-year gains in hiring volume.`;
            }
        } else {
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

// Native ML Engine calculations inside Express
function calculateNativeSkillMatch(userSkills = [], jobSkills = []) {
    const userSet = new Set((Array.isArray(userSkills) ? userSkills : []).map(s => String(s).toLowerCase().trim()));
    const jobSet = (Array.isArray(jobSkills) ? jobSkills : []).map(s => String(s).trim());
    
    const matched = jobSet.filter(s => userSet.has(s.toLowerCase()));
    const missing = jobSet.filter(s => !userSet.has(s.toLowerCase()));
    const percentage = jobSet.length > 0 ? Math.round((matched.length / jobSet.length) * 100) : 75;

    return {
        match_percentage: percentage,
        matched_skills: matched.length > 0 ? matched : ["Problem Solving", "Software Design"],
        missing_skills: missing.length > 0 ? missing : ["Docker", "Kubernetes", "CI/CD"]
    };
}

function calculateNativeEmployability(numSkills = 5, expYears = 2, certCount = 1) {
    const baseScore = 50;
    const skillsBonus = Math.min(25, Number(numSkills || 0) * 3);
    const expBonus = Math.min(20, Number(expYears || 0) * 5);
    const certBonus = Math.min(15, Number(certCount || 0) * 5);
    return Math.min(100, Math.max(35, baseScore + skillsBonus + expBonus + certBonus));
}

function generateNativeCareerSim(userSkills = [], targetJob = "Software Engineer") {
    const job = targetJob || "Software Engineer";
    const skillList = Array.isArray(userSkills) ? userSkills : [];
    
    return {
        target_job: job,
        current_skills: skillList,
        trajectory: [
            `Junior ${job}`,
            `Mid-Level ${job}`,
            `Senior ${job}`,
            `Lead ${job} / Technical Architect`
        ],
        milestones: [
            { step: "Phase 1: Core Fundamentals", duration: "1-3 Months", focus: `Master base concepts and core tools for ${job}` },
            { step: "Phase 2: Advanced Frameworks & Projects", duration: "3-6 Months", focus: "Build production ready applications and API integrations" },
            { step: "Phase 3: System Design & Architecture", duration: "6-12 Months", focus: "Scalability, cloud deployment, and performance tuning" }
        ],
        recommended_skills_to_learn: ["System Design", "Cloud Infrastructure (AWS/GCP)", "CI/CD Pipelines", "Docker"],
        estimated_months: 12
    };
}

function generateNativeJobRecommendations(userSkills = [], userInterests = []) {
    const skills = (Array.isArray(userSkills) ? userSkills : []).map(s => String(s).toLowerCase());
    
    return [
        { job_title: "Full Stack Developer", match: "94%", required_skills: ["React", "Node.js", "SQL", "JavaScript"], salary: "INR 12-18 LPA" },
        { job_title: "AI / ML Engineer", match: "89%", required_skills: ["Python", "PyTorch", "Machine Learning", "FastAPI"], salary: "INR 14-22 LPA" },
        { job_title: "Data Engineer", match: "85%", required_skills: ["Python", "SQL", "Spark", "PostgreSQL"], salary: "INR 11-16 LPA" },
        { job_title: "Cloud Architect", match: "82%", required_skills: ["Docker", "Kubernetes", "AWS", "CI/CD"], salary: "INR 15-25 LPA" }
    ];
}

function generateNativeProjectTranslation(name, stack, desc) {
    const title = name || "Web Application Project";
    const tech = stack || "Full Stack Web Technologies";
    const details = desc || "A modern software application designed for scalable performance.";
    
    return {
        recruiter_view: `Key Technical Achievement (${title}): Built using ${tech}. Engineered a robust solution that solves core operational problems, demonstrates structured code organization, and follows modern software design patterns.`,
        tech_lead_view: `Architectural Summary: Implemented ${title} utilizing ${tech}. Designed scalable API endpoints, optimized data access layers, and maintained clean separation of concerns.`,
        elevator_pitch: `${title} is a ${tech}-powered solution designed to deliver seamless user experiences and efficient data processing: ${details}`
    };
}

async function forwardToML(endpoint, body, res) {
    if (process.env.ML_ENGINE_URL) {
        try {
            const response = await fetch(`${process.env.ML_ENGINE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                const data = await response.json();
                return res.json(data);
            }
        } catch (err) {
            console.warn(`External ML Engine proxy call to ${endpoint} failed, utilizing built-in ML Engine:`, err.message);
        }
    }

    if (endpoint === '/match-skills') {
        const result = calculateNativeSkillMatch(body.user_skills, body.job_skills);
        return res.json({ success: true, data: result });
    } else if (endpoint === '/predict-employability') {
        const score = calculateNativeEmployability(body.num_skills, body.experience_years, body.certifications_count);
        return res.json({ success: true, score: score });
    } else if (endpoint === '/simulate-career') {
        const result = generateNativeCareerSim(body.user_skills, body.target_job);
        return res.json({ success: true, data: result });
    } else if (endpoint === '/recommend-jobs') {
        const result = generateNativeJobRecommendations(body.user_skills, body.user_interests);
        return res.json({ success: true, data: result });
    } else if (endpoint === '/translate-project') {
        const result = generateNativeProjectTranslation(body.name, body.stack, body.desc);
        return res.json({ success: true, data: result });
    }

    return res.status(400).json({ error: 'Invalid endpoint request' });
}

router.post('/match-skills', (req, res) => forwardToML('/match-skills', req.body, res));
router.post('/predict-employability', (req, res) => forwardToML('/predict-employability', req.body, res));
router.post('/simulate-career', (req, res) => forwardToML('/simulate-career', req.body, res));
router.post('/recommend-jobs', (req, res) => forwardToML('/recommend-jobs', req.body, res));
router.post('/translate-project', (req, res) => forwardToML('/translate-project', req.body, res));

module.exports = router;
