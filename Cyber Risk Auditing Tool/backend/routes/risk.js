const express = require('express');
const router = express.Router();
const { calculateRiskScore, saveAssessment } = require('../services/riskCalculator');

/**
 * Risk Assessment API Routes
 * Handles risk calculation and assessment management
 */

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Risk Assessment API is running',
        timestamp: new Date().toISOString()
    });
});

// Calculate risk score
router.post('/calculate', async (req, res) => {
    try {
        const assessmentData = req.body;
        
        // Validate required fields
        if (!assessmentData.organizationName || !assessmentData.industrySector || !assessmentData.answers) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: organizationName, industrySector, answers'
            });
        }
        
        // Calculate risk score
        const riskResult = calculateRiskScore(assessmentData);
        
        // Save assessment to database
        const saveResult = await saveAssessment(assessmentData, riskResult);
        
        res.json({
            success: true,
            message: 'Risk assessment completed successfully',
            data: {
                ...riskResult,
                saveResult
            }
        });
    } catch (error) {
        console.error('Risk calculation error:', error);
        res.status(500).json({
            success: false,
            error: `Risk calculation failed: ${error.message}`
        });
    }
});

// Import database functions
const { getAssessmentById, getAssessmentsByOrganization } = require('../../config/database');

// Get assessment history
router.get('/history', (req, res) => {
    try {
        const { db } = require('../../config/database');
        const stmt = db.prepare(`
            SELECT id, organization_name, industry_sector, risk_score, risk_level, 
                   nist_score, iso_score, created_at
            FROM assessments 
            ORDER BY created_at DESC
        `);
        
        const assessments = stmt.all();
        
        res.json({
            success: true,
            data: assessments
        });
    } catch (error) {
        console.error('Error fetching assessment history:', error);
        res.status(500).json({
            success: false,
            error: `Failed to fetch assessment history: ${error.message}`
        });
    }
});

// Get assessment by ID
router.get('/assessment/:id', (req, res) => {
    try {
        const assessmentId = req.params.id;
        
        // Use the database function to get assessment
        const { db } = require('../../config/database');
        const stmt = db.prepare(`
            SELECT id, organization_name, industry_sector, risk_score, risk_level,
                   nist_score, iso_score, answers, recommendations, created_at
            FROM assessments 
            WHERE id = ?
        `);
        
        const assessment = stmt.get(assessmentId);
        
        if (!assessment) {
            return res.status(404).json({
                success: false,
                error: 'Assessment not found'
            });
        }
        
        res.json({
            success: true,
            data: assessment
        });
    } catch (error) {
        console.error('Error fetching assessment:', error);
        res.status(500).json({
            success: false,
            error: `Failed to fetch assessment: ${error.message}`
        });
    }
});

// Get category scores for assessment
router.get('/scores/:assessmentId', (req, res) => {
    try {
        const assessmentId = req.params.assessmentId;
        
        // Use the database function to get category scores
        const { db } = require('../../config/database');
        const stmt = db.prepare(`
            SELECT category_name, score, max_score
            FROM category_scores 
            WHERE assessment_id = ?
            ORDER BY category_name
        `);
        
        const scores = stmt.all(assessmentId);
        
        res.json({
            success: true,
            data: scores
        });
    } catch (error) {
        console.error('Error fetching category scores:', error);
        res.status(500).json({
            success: false,
            error: `Failed to fetch category scores: ${error.message}`
        });
    }
});

module.exports = router;