const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use DB_PATH from environment variable if provided (e.g., /var/data/database.sqlite for Render)
// Otherwise fallback to local file
const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create the assessments table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area_of_interest TEXT NOT NULL,
            soft_skills TEXT,
            tech_skills TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Assessments table ready.');
            }
        });
    }
});

module.exports = db;
