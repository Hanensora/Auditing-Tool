const express = require('express');
const router = express.Router();

/**
 * Dropdown Data Routes
 * Provides data for dynamic dropdowns and selection lists
 */

/**
 * Get list of supported industries
 */
router.get('/industries', (req, res) => {
    const industries = [
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Financial Services' },
        { value: 'education', label: 'Education' },
        { value: 'government', label: 'Government' },
        { value: 'retail', label: 'Retail' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'technology', label: 'Technology' },
        { value: 'energy', label: 'Energy & Utilities' },
        { value: 'transportation', label: 'Transportation & Logistics' },
        { value: 'telecommunications', label: 'Telecommunications' }
    ];
    
    res.json({
        success: true,
        industries: industries
    });
});

/**
 * Get list of organization sizes
 */
router.get('/organization-sizes', (req, res) => {
    const sizes = [
        { value: 'small', label: 'Small (1-50 employees)' },
        { value: 'medium', label: 'Medium (51-500 employees)' },
        { value: 'large', label: 'Large (501+ employees)' },
        { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
    ];
    
    res.json({
        success: true,
        sizes: sizes
    });
});

/**
 * Get list of risk levels
 */
router.get('/risk-levels', (req, res) => {
    const riskLevels = [
        { value: 'low', label: 'Low Risk', color: '#27ae60' },
        { value: 'medium', label: 'Medium Risk', color: '#f1c40f' },
        { value: 'high', label: 'High Risk', color: '#e67e22' },
        { value: 'critical', label: 'Critical Risk', color: '#e74c3c' }
    ];
    
    res.json({
        success: true,
        riskLevels: riskLevels
    });
});

/**
 * Get MFA (Multi-Factor Authentication) options
 */
router.get('/mfa-options', (req, res) => {
    const mfaOptions = [
        { value: '4', label: 'Enterprise MFA (Hardware tokens, biometrics, smart cards)' },
        { value: '3', label: 'Standard MFA (Mobile authenticator apps, hardware tokens)' },
        { value: '2', label: 'Basic MFA (SMS, email verification, software tokens)' },
        { value: '1', label: 'No MFA (Single-factor authentication only)' }
    ];
    
    res.json({
        success: true,
        mfaOptions: mfaOptions
    });
});

/**
 * Get password policy options
 */
router.get('/password-policies', (req, res) => {
    const passwordPolicies = [
        { value: '4', label: 'Strong Policy (12+ chars, complexity, history, expiration)' },
        { value: '3', label: 'Good Policy (8+ chars, complexity, history)' },
        { value: '2', label: 'Basic Policy (8+ chars, basic complexity)' },
        { value: '1', label: 'Weak Policy (No enforcement, simple passwords)' }
    ];
    
    res.json({
        success: true,
        passwordPolicies: passwordPolicies
    });
});

/**
 * Get firewall implementation options
 */
router.get('/firewall-options', (req, res) => {
    const firewallOptions = [
        { value: '4', label: 'Next-Generation Firewall (NGFW) with advanced threat detection' },
        { value: '3', label: 'Enterprise Firewall with application control and logging' },
        { value: '2', label: 'Standard Firewall with basic rules and monitoring' },
        { value: '1', label: 'Basic Firewall or no firewall protection' }
    ];
    
    res.json({
        success: true,
        firewallOptions: firewallOptions
    });
});

/**
 * Get network segmentation options
 */
router.get('/segmentation-options', (req, res) => {
    const segmentationOptions = [
        { value: '4', label: 'Comprehensive Segmentation (Micro-segmentation, zero-trust)' },
        { value: '3', label: 'Advanced Segmentation (VLANs, DMZ, strict controls)' },
        { value: '2', label: 'Basic Segmentation (Simple VLANs, basic isolation)' },
        { value: '1', label: 'No Segmentation (Flat network, no isolation)' }
    ];
    
    res.json({
        success: true,
        segmentationOptions: segmentationOptions
    });
});

/**
 * Get endpoint protection options
 */
router.get('/endpoint-options', (req, res) => {
    const endpointOptions = [
        { value: '4', label: 'Advanced EDR (Endpoint Detection & Response with AI/ML)' },
        { value: '3', label: 'Enterprise Antivirus (Real-time protection, centralized management)' },
        { value: '2', label: 'Standard Antivirus (Basic protection, manual updates)' },
        { value: '1', label: 'No Endpoint Protection (Unprotected devices)' }
    ];
    
    res.json({
        success: true,
        endpointOptions: endpointOptions
    });
});

/**
 * Get data encryption options
 */
router.get('/encryption-options', (req, res) => {
    const encryptionOptions = [
        { value: '4', label: 'Full Disk Encryption (FDE) with centralized key management' },
        { value: '3', label: 'File-level Encryption (Selective encryption of sensitive files)' },
        { value: '2', label: 'Basic Encryption (Simple encryption tools, manual management)' },
        { value: '1', label: 'No Encryption (Data stored in plain text)' }
    ];
    
    res.json({
        success: true,
        encryptionOptions: encryptionOptions
    });
});

/**
 * Get backup strategy options
 */
router.get('/backup-options', (req, res) => {
    const backupOptions = [
        { value: '4', label: '3-2-1 Backup Strategy (3 copies, 2 different media, 1 offsite)' },
        { value: '3', label: 'Regular Automated Backups (Daily, tested recovery)' },
        { value: '2', label: 'Manual Backups (Weekly, basic recovery testing)' },
        { value: '1', label: 'No Backup Strategy (No regular backups)' }
    ];
    
    res.json({
        success: true,
        backupOptions: backupOptions
    });
});

/**
 * Get data classification options
 */
router.get('/classification-options', (req, res) => {
    const classificationOptions = [
        { value: '4', label: 'Automated Classification (AI-driven, real-time classification)' },
        { value: '3', label: 'Manual Classification (Structured process, regular reviews)' },
        { value: '2', label: 'Basic Classification (Simple categories, infrequent updates)' },
        { value: '1', label: 'No Classification (All data treated equally)' }
    ];
    
    res.json({
        success: true,
        classificationOptions: classificationOptions
    });
});

/**
 * Get security monitoring options
 */
router.get('/monitoring-options', (req, res) => {
    const monitoringOptions = [
        { value: '4', label: '24/7 SOC (Security Operations Center with real-time monitoring)' },
        { value: '3', label: 'Business Hours Monitoring (Professional monitoring during work hours)' },
        { value: '2', label: 'Basic Monitoring (Log collection, periodic review)' },
        { value: '1', label: 'No Monitoring (No security monitoring in place)' }
    ];
    
    res.json({
        success: true,
        monitoringOptions: monitoringOptions
    });
});

/**
 * Get security training options
 */
router.get('/training-options', (req, res) => {
    const trainingOptions = [
        { value: '4', label: 'Comprehensive Training (Monthly, role-specific, phishing simulations)' },
        { value: '3', label: 'Regular Training (Quarterly, general security awareness)' },
        { value: '2', label: 'Basic Training (Annual, general security topics)' },
        { value: '1', label: 'No Training (No security awareness program)' }
    ];
    
    res.json({
        success: true,
        trainingOptions: trainingOptions
    });
});

/**
 * Get NIST Cybersecurity Framework categories
 */
router.get('/nist-categories', (req, res) => {
    const categories = [
        {
            value: 'IDENTIFY',
            label: 'IDENTIFY (ID)',
            description: 'Develop organizational understanding of cybersecurity risk to system, assets, data, and capabilities'
        },
        {
            value: 'PROTECT',
            label: 'PROTECT (PR)',
            description: 'Develop and implement appropriate safeguards to ensure delivery of critical services'
        },
        {
            value: 'DETECT',
            label: 'DETECT (DE)',
            description: 'Develop and implement appropriate activities to identify the occurrence of a cybersecurity event'
        },
        {
            value: 'RESPOND',
            label: 'RESPOND (RS)',
            description: 'Develop and implement appropriate activities to take action regarding a detected cybersecurity event'
        },
        {
            value: 'RECOVER',
            label: 'RECOVER (RC)',
            description: 'Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity event'
        }
    ];
    
    res.json({
        success: true,
        categories: categories
    });
});

/**
 * Get ISO 27001 control categories
 */
router.get('/iso-27001-controls', (req, res) => {
    const controls = [
        {
            value: 'A.9',
            label: 'A.9 Access Control',
            description: 'Ensure only authorized access to information systems and data'
        },
        {
            value: 'A.10',
            label: 'A.10 Cryptography',
            description: 'Ensure proper protection of information using cryptographic controls'
        },
        {
            value: 'A.12',
            label: 'A.12 Operations Security',
            description: 'Ensure correct and secure operations of information processing facilities'
        },
        {
            value: 'A.13',
            label: 'A.13 Communications Security',
            description: 'Manage security of information in networks and network services'
        },
        {
            value: 'A.14',
            label: 'A.14 System Acquisition',
            description: 'Ensure security is built into information systems'
        },
        {
            value: 'A.16',
            label: 'A.16 Information Security Incident Management',
            description: 'Ensure timely detection and response to information security incidents'
        },
        {
            value: 'A.17',
            label: 'A.17 Information Security Aspects of Business Continuity',
            description: 'Maintain business continuity of information security management'
        }
    ];
    
    res.json({
        success: true,
        controls: controls
    });
});

/**
 * Get assessment question categories
 */
router.get('/assessment-categories', (req, res) => {
    const categories = [
        {
            value: 'asset-management',
            label: 'Asset Management',
            nistCategory: 'IDENTIFY',
            description: 'Inventory and control of assets'
        },
        {
            value: 'risk-assessment',
            label: 'Risk Assessment',
            nistCategory: 'IDENTIFY',
            description: 'Risk assessment and risk management processes'
        },
        {
            value: 'access-control',
            label: 'Access Control',
            nistCategory: 'PROTECT',
            description: 'Access control management and implementation'
        },
        {
            value: 'data-protection',
            label: 'Data Protection',
            nistCategory: 'PROTECT',
            description: 'Data security and encryption controls'
        },
        {
            value: 'monitoring',
            label: 'Continuous Monitoring',
            nistCategory: 'DETECT',
            description: 'Security monitoring and detection capabilities'
        },
        {
            value: 'incident-response',
            label: 'Incident Response',
            nistCategory: 'RESPOND',
            description: 'Incident response planning and execution'
        },
        {
            value: 'recovery-planning',
            label: 'Recovery Planning',
            nistCategory: 'RECOVER',
            description: 'Business continuity and disaster recovery'
        }
    ];
    
    res.json({
        success: true,
        categories: categories
    });
});

/**
 * Get scoring scale options
 */
router.get('/scoring-scales', (req, res) => {
    const scales = [
        {
            value: 'percentage',
            label: 'Percentage Scale (0-100%)',
            description: 'Score as percentage of compliance or effectiveness'
        },
        {
            value: 'five-point',
            label: 'Five Point Scale (1-5)',
            description: 'Score on a 1-5 scale where 5 is excellent'
        },
        {
            value: 'three-point',
            label: 'Three Point Scale (1-3)',
            description: 'Score on a 1-3 scale where 3 is good'
        },
        {
            value: 'binary',
            label: 'Binary Scale (Yes/No)',
            description: 'Simple yes/no compliance check'
        }
    ];
    
    res.json({
        success: true,
        scales: scales
    });
});

/**
 * Get report types
 */
router.get('/report-types', (req, res) => {
    const reportTypes = [
        {
            value: 'executive',
            label: 'Executive Summary Report',
            description: 'High-level overview for management and executives'
        },
        {
            value: 'technical',
            label: 'Technical Analysis Report',
            description: 'Detailed technical analysis for IT security teams'
        },
        {
            value: 'compliance',
            label: 'Compliance Assessment Report',
            description: 'Regulatory compliance status and requirements'
        },
        {
            value: 'detailed',
            label: 'Detailed Assessment Report',
            description: 'Comprehensive analysis with all findings and recommendations'
        }
    ];
    
    res.json({
        success: true,
        reportTypes: reportTypes
    });
});

/**
 * Get time periods for trend analysis
 */
router.get('/time-periods', (req, res) => {
    const periods = [
        { value: 'last-7-days', label: 'Last 7 Days' },
        { value: 'last-30-days', label: 'Last 30 Days' },
        { value: 'last-90-days', label: 'Last 90 Days' },
        { value: 'last-6-months', label: 'Last 6 Months' },
        { value: 'last-year', label: 'Last Year' },
        { value: 'custom', label: 'Custom Range' }
    ];
    
    res.json({
        success: true,
        periods: periods
    });
});

/**
 * Get dashboard widgets
 */
router.get('/dashboard-widgets', (req, res) => {
    const widgets = [
        {
            value: 'risk-score-overview',
            label: 'Risk Score Overview',
            description: 'Current overall risk score and trend'
        },
        {
            value: 'category-breakdown',
            label: 'Category Breakdown',
            description: 'Risk scores by NIST framework categories'
        },
        {
            value: 'compliance-status',
            label: 'Compliance Status',
            description: 'NIST and ISO 27001 compliance percentages'
        },
        {
            value: 'recent-assessments',
            label: 'Recent Assessments',
            description: 'List of recent risk assessments'
        },
        {
            value: 'recommendations-priority',
            label: 'Priority Recommendations',
            description: 'Top recommendations by priority level'
        },
        {
            value: 'security-posture-trend',
            label: 'Security Posture Trend',
            description: 'Historical trend of security posture'
        }
    ];
    
    res.json({
        success: true,
        widgets: widgets
    });
});

module.exports = router;