const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../../config/database');
const { generateExecutiveReport } = require('../services/executiveReportGenerator');
const { generateTechnicalReport } = require('../services/technicalReportGenerator');
const { generateComplianceReport } = require('../services/complianceReportGenerator');

/**
 * Reports API Routes
 * Handles report generation and management for different report types
 */

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Reports API is running',
        timestamp: new Date().toISOString()
    });
});

// Download a specific report
router.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '../reports', filename);
        
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                error: 'Report file not found'
            });
        }
        
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error('Error downloading report:', err);
                res.status(500).json({
                    success: false,
                    error: 'Failed to download report'
                });
            }
        });
    } catch (error) {
        console.error('Error downloading report:', error);
        res.status(500).json({
            success: false,
            error: `Failed to download report: ${error.message}`
        });
    }
});

// Delete a specific report
router.delete('/delete/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(__dirname, '../reports', filename);
        
        // Delete file from filesystem
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        
        // Delete record from database
        const stmt = db.prepare('DELETE FROM reports WHERE filename = ?');
        const result = stmt.run(filename);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Report record not found in database'
            });
        }
        
        res.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({
            success: false,
            error: `Failed to delete report: ${error.message}`
        });
    }
});

// Generate executive summary report
router.post('/generate/executive', async (req, res) => {
    try {
        const assessmentData = req.body;
        
        // Validate required fields
        if (!assessmentData.organizationName || !assessmentData.riskScore) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: organizationName, riskScore'
            });
        }
        
        // Generate executive report
        const result = await generateExecutiveReport(assessmentData);
        
        // Store report metadata in database
        const stmt = db.prepare(`
            INSERT INTO reports (
                filename, filepath, report_type, organization_name, 
                industry_sector, risk_score, risk_level, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            result.filename,
            result.filepath,
            'executive',
            assessmentData.organizationName,
            assessmentData.industrySector,
            assessmentData.riskScore,
            assessmentData.riskLevel,
            new Date().toISOString()
        );
        
        res.json({
            success: true,
            message: 'Executive report generated successfully',
            data: result
        });
    } catch (error) {
        console.error('Executive report generation error:', error);
        res.status(500).json({
            success: false,
            error: `Executive report generation failed: ${error.message}`
        });
    }
});

// Unified report generation endpoint (for dynamic frontend)
router.post('/generate', async (req, res) => {
    try {
        const { assessmentId, reportType, assessmentData } = req.body;
        
        // Validate required fields
        if (!assessmentId || !reportType || !assessmentData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: assessmentId, reportType, assessmentData'
            });
        }
        
        let result;
        
        // Generate appropriate report based on type
        switch (reportType.toLowerCase()) {
            case 'executive':
                result = await generateExecutiveReport(assessmentData);
                break;
            case 'technical':
                result = await generateTechnicalReport(assessmentData);
                break;
            case 'compliance':
                result = await generateComplianceReport(assessmentData);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid report type. Must be: executive, technical, or compliance'
                });
        }
        
        // Store report metadata in database
        const stmt = db.prepare(`
            INSERT INTO reports (
                filename, filepath, report_type, organization_name, 
                industry_sector, risk_score, risk_level, nist_score, iso_score, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            result.filename,
            result.filepath,
            reportType,
            assessmentData.organizationName || assessmentData.organization?.name,
            assessmentData.industrySector || assessmentData.organization?.sector,
            assessmentData.riskScore || assessmentData.overallScore,
            assessmentData.riskLevel || assessmentData.riskInfo?.level,
            assessmentData.compliance?.nistScore || null,
            assessmentData.compliance?.isoScore || null,
            new Date().toISOString()
        );
        
        res.json({
            success: true,
            message: `${reportType} report generated successfully`,
            data: {
                filename: result.filename,
                filepath: result.filepath,
                reportType: reportType
            }
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({
            success: false,
            error: `Report generation failed: ${error.message}`
        });
    }
});

// Generate technical analysis report
router.post('/generate/technical', async (req, res) => {
    try {
        const assessmentData = req.body;
        
        // Validate required fields
        if (!assessmentData.organizationName || !assessmentData.riskScore) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: organizationName, riskScore'
            });
        }
        
        // Generate technical report
        const result = await generateTechnicalReport(assessmentData);
        
        // Store report metadata in database
        const stmt = db.prepare(`
            INSERT INTO reports (
                filename, filepath, report_type, organization_name, 
                industry_sector, risk_score, risk_level, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            result.filename,
            result.filepath,
            'technical',
            assessmentData.organizationName,
            assessmentData.industrySector,
            assessmentData.riskScore,
            assessmentData.riskLevel,
            new Date().toISOString()
        );
        
        res.json({
            success: true,
            message: 'Technical report generated successfully',
            data: result
        });
    } catch (error) {
        console.error('Technical report generation error:', error);
        res.status(500).json({
            success: false,
            error: `Technical report generation failed: ${error.message}`
        });
    }
});

// Generate compliance assessment report
router.post('/generate/compliance', async (req, res) => {
    try {
        const assessmentData = req.body;
        
        // Validate required fields
        if (!assessmentData.organizationName || !assessmentData.compliance) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: organizationName, compliance'
            });
        }
        
        // Generate compliance report
        const result = await generateComplianceReport(assessmentData);
        
        // Store report metadata in database
        const stmt = db.prepare(`
            INSERT INTO reports (
                filename, filepath, report_type, organization_name, 
                industry_sector, nist_score, iso_score, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
            result.filename,
            result.filepath,
            'compliance',
            assessmentData.organizationName,
            assessmentData.industrySector,
            assessmentData.compliance.nistScore,
            assessmentData.compliance.isoScore,
            new Date().toISOString()
        );
        
        res.json({
            success: true,
            message: 'Compliance report generated successfully',
            data: result
        });
    } catch (error) {
        console.error('Compliance report generation error:', error);
        res.status(500).json({
            success: false,
            error: `Compliance report generation failed: ${error.message}`
        });
    }
});

// List all reports
router.get('/list', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, filename, filepath, report_type, organization_name, 
                   industry_sector, risk_score, risk_level, nist_score, iso_score, created_at
            FROM reports 
            ORDER BY created_at DESC
        `);
        
        const reports = stmt.all();
        
        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error listing reports:', error);
        res.status(500).json({
            success: false,
            error: `Failed to list reports: ${error.message}`
        });
    }
});

// List executive reports only
router.get('/list/executive', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, filename, filepath, report_type, organization_name, 
                   industry_sector, risk_score, risk_level, created_at
            FROM reports 
            WHERE report_type = 'executive'
            ORDER BY created_at DESC
        `);
        
        const reports = stmt.all();
        
        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error listing executive reports:', error);
        res.status(500).json({
            success: false,
            error: `Failed to list executive reports: ${error.message}`
        });
    }
});

// List technical reports only
router.get('/list/technical', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, filename, filepath, report_type, organization_name, 
                   industry_sector, risk_score, risk_level, created_at
            FROM reports 
            WHERE report_type = 'technical'
            ORDER BY created_at DESC
        `);
        
        const reports = stmt.all();
        
        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error listing technical reports:', error);
        res.status(500).json({
            success: false,
            error: `Failed to list technical reports: ${error.message}`
        });
    }
});

// List compliance reports only
router.get('/list/compliance', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT id, filename, filepath, report_type, organization_name, 
                   industry_sector, nist_score, iso_score, created_at
            FROM reports 
            WHERE report_type = 'compliance'
            ORDER BY created_at DESC
        `);
        
        const reports = stmt.all();
        
        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        console.error('Error listing compliance reports:', error);
        res.status(500).json({
            success: false,
            error: `Failed to list compliance reports: ${error.message}`
        });
    }
});

// Get report statistics
router.get('/stats', (req, res) => {
    try {
        const statsStmt = db.prepare(`
            SELECT 
                report_type,
                COUNT(*) as count,
                AVG(risk_score) as avg_risk_score,
                AVG(nist_score) as avg_nist_score,
                AVG(iso_score) as avg_iso_score
            FROM reports 
            GROUP BY report_type
        `);
        
        const stats = statsStmt.all();
        
        const totalStmt = db.prepare('SELECT COUNT(*) as total FROM reports');
        const total = totalStmt.get();
        
        res.json({
            success: true,
            data: {
                total: total.total,
                byType: stats
            }
        });
    } catch (error) {
        console.error('Error getting report statistics:', error);
        res.status(500).json({
            success: false,
            error: `Failed to get report statistics: ${error.message}`
        });
    }
});

module.exports = router;