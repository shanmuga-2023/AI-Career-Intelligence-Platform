const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('--- Assessment Database Contents ---');

db.all('SELECT * FROM assessments', [], (err, rows) => {
    if (err) {
        throw err;
    }

    if (rows.length === 0) {
        console.log('No assessments found yet.');
    } else {
        console.table(rows);
    }
});

db.close();
