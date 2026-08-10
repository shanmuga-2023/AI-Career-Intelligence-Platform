require('dotenv').config();
const path = require('path');

let dbDriver = 'sqlite';
let supabaseClient = null;
let pgPool = null;
let sqliteDb = null;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        const { createClient } = require('@supabase/supabase-js');
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
        dbDriver = 'supabase';
        console.log('Connected to Supabase REST client.');
    } catch (e) {
        console.error('Failed to initialize Supabase client:', e.message);
    }
} else if (DATABASE_URL) {
    try {
        const { Pool } = require('pg');
        pgPool = new Pool({
            connectionString: DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' || DATABASE_URL.includes('supabase') ? { rejectUnauthorized: false } : false
        });
        dbDriver = 'postgres';
        console.log('Connected to PostgreSQL database (Supabase).');

        pgPool.query(`
            CREATE TABLE IF NOT EXISTS assessments (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                area_of_interest TEXT NOT NULL,
                soft_skills TEXT,
                tech_skills TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `).catch(err => console.error('Error creating assessments table in Postgres:', err.message));
    } catch (e) {
        console.error('Failed to initialize PostgreSQL pool:', e.message);
    }
}

if (dbDriver === 'sqlite') {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'database.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening local SQLite database:', err.message);
        } else {
            console.log('Connected to local SQLite database.');
            sqliteDb.run(`CREATE TABLE IF NOT EXISTS assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                area_of_interest TEXT NOT NULL,
                soft_skills TEXT,
                tech_skills TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) console.error('Error creating table in SQLite:', err.message);
                else console.log('Assessments table ready in SQLite.');
            });
        }
    });
}

// Unified Async Database API
async function saveAssessment({ name, area_of_interest, soft_skills, tech_skills }) {
    if (dbDriver === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('assessments')
            .insert([{ name, area_of_interest, soft_skills, tech_skills }])
            .select();
        if (error) throw new Error(error.message);
        return data && data[0] ? data[0].id : Date.now();
    } else if (dbDriver === 'postgres' && pgPool) {
        const res = await pgPool.query(
            `INSERT INTO assessments (name, area_of_interest, soft_skills, tech_skills) VALUES ($1, $2, $3, $4) RETURNING id`,
            [name, area_of_interest, soft_skills || '', tech_skills || '']
        );
        return res.rows[0].id;
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.run(
                `INSERT INTO assessments (name, area_of_interest, soft_skills, tech_skills) VALUES (?, ?, ?, ?)`,
                [name, area_of_interest, soft_skills, tech_skills],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }
}

async function getAllAssessments() {
    if (dbDriver === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient
            .from('assessments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data || [];
    } else if (dbDriver === 'postgres' && pgPool) {
        const res = await pgPool.query(`SELECT * FROM assessments ORDER BY created_at DESC`);
        return res.rows;
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM assessments`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });
    }
}

// Legacy callback adapter for existing call sites
const legacyAdapter = {
    run: function (sql, params, callback) {
        if (dbDriver === 'sqlite' && sqliteDb) {
            return sqliteDb.run(sql, params, callback);
        }
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        const [name, area_of_interest, soft_skills, tech_skills] = params || [];
        saveAssessment({ name, area_of_interest, soft_skills, tech_skills })
            .then(id => {
                if (callback) callback.call({ lastID: id }, null);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    },
    all: function (sql, params, callback) {
        if (dbDriver === 'sqlite' && sqliteDb) {
            return sqliteDb.all(sql, params, callback);
        }
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        getAllAssessments()
            .then(rows => {
                if (callback) callback(null, rows);
            })
            .catch(err => {
                if (callback) callback(err, null);
            });
    }
};

module.exports = {
    driver: dbDriver,
    saveAssessment,
    getAllAssessments,
    run: legacyAdapter.run,
    all: legacyAdapter.all
};
