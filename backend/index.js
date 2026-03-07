require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main API routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('AI Career Intelligence Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
