const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../database/assessments.db');

// Create database instance
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

/**
 * Initialize database tables and structure
 */
function initializeDatabase() {
    // Create assessments table
    const createAssessmentsTable = `
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            organization_name TEXT NOT NULL,
            industry_sector TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Create category_scores table
    const createCategoryScoresTable = `
        CREATE TABLE IF NOT EXISTS category_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id INTEGER,
            category TEXT NOT NULL,
            score INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assessment_id) REFERENCES assessments(id)
        )
    `;
    
    // Create reports table
    const createReportsTable = `
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id INTEGER,
            report_type TEXT NOT NULL,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assessment_id) REFERENCES assessments(id)
        )
    `;
    
    // Execute table creation queries
    db.run(createAssessmentsTable, (err) => {
        if (err) {
            console.error('Error creating assessments table:', err.message);
        } else {
            console.log('Assessments table ready.');
        }
    });
    
    db.run(createCategoryScoresTable, (err) => {
        if (err) {
            console.error('Error creating category_scores table:', err.message);
        } else {
            console.log('Category scores table ready.');
        }
    });
    
    db.run(createReportsTable, (err) => {
        if (err) {
            console.error('Error creating reports table:', err.message);
        } else {
            console.log('Reports table ready.');
        }
    });
}

/**
 * Close database connection
 */
function closeDatabase() {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

module.exports = {
    db,
    closeDatabase
};