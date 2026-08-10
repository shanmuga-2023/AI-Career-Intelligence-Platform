require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5050;

// Configure CORS for Vercel production deployment and local development
const allowedOrigins = [
    'https://ai-career-intelligence-platform-weld.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true); // Allow all during transition if needed
        }
    },
    credentials: true
}));

app.use(express.json());

// Health check endpoints for Render monitoring (supports /health and /var/data)
app.get(['/health', '/var/data', '/var/data/*path'], (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: db.driver || 'connected'
    });
});

// Main API routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'AI Career Intelligence Backend is running',
        environment: process.env.NODE_ENV || 'development',
        databaseDriver: db.driver || 'sqlite'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [DB Driver: ${db.driver || 'sqlite'}]`);
});
