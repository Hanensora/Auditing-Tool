const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { db } = require('../../config/database');

/**
 * Executive Report Generator Service
 * Generates professional executive summary PDF reports with enhanced visibility and comprehensive content
 */

/**
 * Generate executive summary report with enhanced visibility and comprehensive content
 */
function generateExecutiveReport(assessmentData) {
    try {
        const { organizationName, industrySector, riskScore, riskLevel, nistScores, isoScores, recommendations, compliance } = assessmentData;
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Cover Page with enhanced visibility
        doc.setFillColor(44, 62, 80); // Dark blue background
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.text('CYBER RISK ASSESSMENT', 20, 30);
        doc.setFontSize(16);
        doc.text('Executive Summary Report', 20, 40);
        
        // Organization Information with white background for contrast
        doc.setTextColor(44, 62, 80);
        doc.setFillColor(255, 255, 255); // White background for better text visibility
        doc.rect(20, 50, pageWidth - 40, 60, 'F');
        doc.setFontSize(20);
        doc.text('Organization Overview', 25, 65);
        doc.setFontSize(12);
        doc.text(`Organization: ${organizationName}`, 25, 75);
        doc.text(`Industry Sector: ${industrySector}`, 25, 85);
        doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 25, 95);
        doc.text(`Assessment ID: ${assessmentData.assessmentId || 'N/A'}`, 25, 105);
        
        // Risk Score Dashboard with enhanced visibility
        doc.setFontSize(18);
        doc.text('Risk Assessment Summary', 20, 125);
        
        // Risk Score Circle with enhanced styling and visibility
        doc.setFillColor(255, 255, 255);
        doc.circle(160, 150, 35, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.circle(160, 150, 35, 'D');
        
        // Risk level color coding with enhanced visibility
        let riskColor = [46, 204, 113]; // Green
        let riskText = 'LOW RISK';
        if (riskLevel.includes('Medium')) {
            riskColor = [241, 196, 15]; // Yellow
            riskText = 'MEDIUM RISK';
        } else if (riskLevel.includes('High')) {
            riskColor = [231, 76, 60]; // Red
            riskText = 'HIGH RISK';
        } else if (riskLevel.includes('Critical')) {
            riskColor = [52, 73, 94]; // Dark
            riskText = 'CRITICAL RISK';
        }
        
        doc.setFillColor(...riskColor);
        doc.circle(160, 150, 35 * (riskScore / 100), 'F');
        
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text(`${riskScore}%`, 145, 155);
        doc.setFontSize(12);
        doc.text(riskText, 140, 165);
        
        // NIST Framework Scores with enhanced layout and visibility
        doc.setFontSize(16);
        doc.text('NIST Cybersecurity Framework Scores', 20, 180);
        
        let yPos = 190;
        Object.keys(nistScores).forEach(category => {
            const score = nistScores[category];
            const status = score >= 70 ? 'COMPLIANT' : 'NON-COMPLIANT';
            const statusColor = score >= 70 ? [46, 204, 113] : [231, 76, 60];
            
            doc.setFontSize(12);
            doc.text(`${category}:`, 25, yPos);
            doc.setTextColor(...statusColor);
            doc.text(status, 60, yPos);
            doc.setTextColor(44, 62, 80);
            doc.text(`${score}%`, 100, yPos);
            
            // Enhanced progress bar with better visibility
            doc.setFillColor(200, 200, 200);
            doc.roundedRect(110, yPos - 5, 80, 8, 2, 2, 'F');
            doc.setFillColor(...getScoreColor(score));
            doc.roundedRect(110, yPos - 5, score * 0.8, 8, 2, 2, 'F');
            
            yPos += 15;
        });
        
        // Top Recommendations with enhanced formatting and comprehensive content
        doc.setFontSize(16);
        doc.text('Priority Recommendations', 20, yPos + 10);
        
        yPos += 20;
        recommendations.slice(0, 5).forEach((rec, index) => {
            doc.setFontSize(11);
            doc.setTextColor(44, 62, 80);
            doc.text(`${index + 1}. ${rec.recommendation}`, 25, yPos);
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(`Priority: ${rec.priority} | Category: ${rec.category}`, 30, yPos + 8);
            doc.text(`Implementation: ${rec.action}`, 30, yPos + 14);
            
            // Add detailed implementation steps with comprehensive content
            const implementationSteps = getDetailedImplementationSteps(rec.category, rec.priority);
            doc.setFontSize(10);
            doc.setTextColor(60);
            doc.text('Implementation Steps:', 30, yPos + 22);
            implementationSteps.forEach((step, stepIndex) => {
                doc.text(`  • ${step}`, 35, yPos + 30 + (stepIndex * 8));
            });
            
            yPos += 50;
        });
        
        // Compliance Summary with comprehensive content
        doc.setFontSize(16);
        doc.text('Compliance Status', 20, yPos + 5);
        
        yPos += 15;
        doc.setFontSize(11);
        doc.text(`NIST Score: ${compliance.nistScore}%`, 25, yPos);
        doc.text(`ISO 27001 Score: ${compliance.isoScore}%`, 25, yPos + 10);
        
        if (compliance.gaps.length > 0) {
            doc.text('Compliance Gaps Identified:', 25, yPos + 20);
            compliance.gaps.slice(0, 3).forEach((gap, index) => {
                doc.setFontSize(9);
                doc.text(`• ${gap}`, 30, yPos + 30 + (index * 8));
            });
        } else {
            doc.text('No significant compliance gaps identified.', 25, yPos + 20);
        }
        
        // Footer with enhanced visibility
        doc.setDrawColor(220, 220, 220);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Confidential - For Executive Review Only', 20, pageHeight - 20);
        doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - 100, pageHeight - 20);
        doc.text(`Report ID: ${assessmentData.assessmentId || 'N/A'}`, pageWidth - 100, pageHeight - 15);
        
        // Save PDF
        const filename = `executive-report-${organizationName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../reports', filename);
        
        doc.save(filepath);
        
        return {
            success: true,
            filename,
            filepath,
            reportType: 'executive'
        };
    } catch (error) {
        throw new Error(`Executive report generation failed: ${error.message}`);
    }
}

/**
 * Get detailed implementation steps for executive report with comprehensive content
 */
function getDetailedImplementationSteps(category, priority) {
    const steps = {
        IDENTIFY: {
            high: [
                'Conduct comprehensive asset discovery across all environments using automated tools',
                'Implement automated asset classification and tagging system with business criticality',
                'Establish continuous risk assessment processes with real-time monitoring and reporting',
                'Deploy configuration management database (CMDB) with automated synchronization',
                'Create detailed asset inventory with ownership and classification with lifecycle tracking',
                'Implement asset discovery for cloud, mobile, and IoT environments with comprehensive coverage',
                'Establish asset management workflows with approval processes and automation capabilities'
            ],
            medium: [
                'Improve existing asset discovery processes with additional coverage and automation',
                'Implement basic asset classification framework with business impact assessment',
                'Establish regular risk assessment schedule with documented methodologies and procedures',
                'Create comprehensive asset inventory documentation with classification and ownership',
                'Review and update asset management policies with current best practices and standards',
                'Implement asset discovery for remote and branch offices with centralized management',
                'Establish asset lifecycle management processes with automated tracking and reporting'
            ],
            low: [
                'Implement comprehensive asset discovery tools with network scanning and agent-based collection',
                'Establish asset classification and tagging standards with business criticality levels',
                'Conduct initial comprehensive risk assessment with threat modeling and vulnerability analysis',
                'Create configuration management database (CMDB) with integration capabilities and automation',
                'Develop asset management policies and procedures with enforcement mechanisms and monitoring',
                'Implement asset discovery for all network segments and devices with comprehensive coverage',
                'Establish asset ownership and accountability processes with regular review and validation'
            ]
        },
        PROTECT: {
            high: [
                'Deploy next-generation firewalls with application awareness and deep packet inspection',
                'Implement network segmentation and micro-segmentation with zero-trust principles',
                'Configure advanced endpoint detection and response (EDR) with behavioral analysis and automation',
                'Deploy data loss prevention (DLP) systems with content inspection and policy enforcement',
                'Implement zero-trust architecture principles with identity-based access controls and continuous verification',
                'Deploy advanced threat protection with sandboxing and malware analysis capabilities',
                'Implement secure configuration management with automated compliance checking and remediation'
            ],
            medium: [
                'Update and optimize existing firewall rules and configurations with security best practices',
                'Implement basic network segmentation where gaps exist with VLAN isolation and access controls',
                'Deploy comprehensive endpoint protection solutions with real-time monitoring and response',
                'Configure data encryption for sensitive information with key management and compliance validation',
                'Review and enhance access control policies with least privilege principles and multi-factor authentication',
                'Implement vulnerability management with automated scanning and patching capabilities',
                'Deploy security information and event management (SIEM) with correlation and analysis capabilities'
            ],
            low: [
                'Deploy comprehensive firewall solutions with proper configuration and rule management',
                'Implement network access controls with authentication requirements and monitoring',
                'Deploy enterprise-grade endpoint protection platforms with comprehensive coverage and automation',
                'Implement comprehensive data encryption solutions for all sensitive data at rest and in transit',
                'Establish robust access control policies and procedures with enforcement and monitoring',
                'Implement security awareness training with regular updates and phishing simulation exercises',
                'Deploy intrusion detection and prevention systems (IDPS) with signature and behavior-based detection'
            ]
        },
        DETECT: {
            high: [
                'Implement Security Information and Event Management (SIEM) with advanced analytics and machine learning',
                'Deploy advanced threat detection systems with behavioral analysis and anomaly detection',
                'Configure real-time log aggregation and correlation with automated analysis and response',
                'Establish continuous monitoring dashboards with executive reporting and operational views',
                'Implement automated threat hunting capabilities with proactive analysis and investigation',
                'Deploy network traffic analysis with behavioral baselines and advanced threat detection',
                'Implement user and entity behavior analytics (UEBA) with insider threat detection and response'
            ],
            medium: [
                'Implement comprehensive log management system with centralized collection and analysis',
                'Deploy intrusion detection and prevention systems with signature-based detection and response',
                'Configure security monitoring alerts and notifications with escalation procedures and automation',
                'Establish log review and analysis processes with regular review and improvement actions',
                'Implement basic threat detection capabilities with rule-based systems and correlation',
                'Deploy security monitoring for critical systems and networks with comprehensive coverage',
                'Implement log retention policies with compliance requirements and automated management'
            ],
            low: [
                'Implement comprehensive log management and aggregation with all system coverage and real-time processing',
                'Deploy security monitoring and detection solutions with automated alerting and response capabilities',
                'Configure intrusion detection systems across all environments with signature and behavior-based detection',
                'Establish security event correlation and analysis with automated processing and response',
                'Implement comprehensive threat detection capabilities with advanced analytics and machine learning',
                'Deploy security monitoring for all critical assets and data flows with continuous monitoring',
                'Implement security monitoring policies with regular review and improvement processes'
            ]
        },
        RESPOND: {
            high: [
                'Develop and test comprehensive incident response playbooks with automation and orchestration',
                'Implement automated incident response workflows with integration and coordination capabilities',
                'Deploy advanced threat hunting capabilities with proactive analysis and investigation tools',
                'Establish 24/7 security operations center (SOC) with skilled analysts and advanced tooling',
                'Implement incident response automation tools with playbook execution and response actions',
                'Deploy forensic analysis capabilities with advanced tooling and evidence preservation',
                'Implement incident response coordination with external partners and law enforcement agencies'
            ],
            medium: [
                'Update and enhance existing incident response procedures with current threat landscape and best practices',
                'Implement comprehensive incident detection and reporting with automated alerting and escalation',
                'Establish communication and coordination processes with stakeholders and external parties',
                'Deploy forensic analysis capabilities with basic tooling and evidence collection procedures',
                'Conduct regular incident response training and testing with tabletop exercises and simulations',
                'Implement incident response documentation with lessons learned and improvement actions',
                'Establish incident response metrics with performance measurement and continuous improvement'
            ],
            low: [
                'Develop comprehensive incident response procedures with detailed steps and escalation procedures',
                'Implement incident detection and reporting systems with automation and real-time capabilities',
                'Establish communication and escalation procedures with contact lists and notification workflows',
                'Deploy comprehensive forensic analysis tools with evidence collection and preservation capabilities',
                'Conduct regular incident response testing and improvement with exercises and validation',
                'Implement incident response training with skill development and regular updates',
                'Establish incident response coordination with external resources and support services'
            ]
        },
        RECOVER: {
            high: [
                'Implement automated backup and recovery solutions with cloud integration and encryption',
                'Deploy disaster recovery orchestration tools with automated failover and recovery workflows',
                'Establish comprehensive business continuity monitoring with real-time alerts and reporting',
                'Create detailed recovery documentation and procedures with step-by-step instructions and contact information',
                'Implement automated recovery testing and validation with performance metrics and reporting',
                'Deploy business continuity management systems with integration and coordination capabilities',
                'Implement recovery orchestration with automated workflows and manual override capabilities'
            ],
            medium: [
                'Improve existing backup and recovery procedures with automation capabilities and testing',
                'Implement disaster recovery capabilities where gaps exist with defined recovery objectives and strategies',
                'Establish business continuity processes and documentation with regular review and updates',
                'Create comprehensive recovery documentation with detailed procedures and testing requirements',
                'Conduct regular recovery testing and validation with performance measurement and improvement',
                'Implement backup and recovery monitoring with alerting capabilities and performance metrics',
                'Establish recovery procedures with alternative site arrangements and coordination'
            ],
            low: [
                'Implement comprehensive backup solutions with proper retention policies and encryption',
                'Deploy disaster recovery systems and capabilities with defined strategies and testing procedures',
                'Establish comprehensive business continuity plans with detailed procedures and recovery objectives',
                'Create detailed recovery procedures and documentation with testing requirements and validation',
                'Implement regular recovery testing and validation processes with performance measurement and improvement',
                'Deploy backup and recovery monitoring with automated checking and alerting capabilities',
                'Establish disaster recovery coordination with external providers and support services'
            ]
        }
    };
    
    const categorySteps = steps[category] || steps.IDENTIFY;
    const priorityLevel = priority.toLowerCase();
    
    if (priorityLevel.includes('high')) return categorySteps.high;
    if (priorityLevel.includes('medium')) return categorySteps.medium;
    return categorySteps.low;
}

/**
 * Get score color for progress bars with enhanced visibility
 */
function getScoreColor(score) {
    if (score >= 80) return [46, 204, 113]; // Green
    if (score >= 60) return [241, 196, 15]; // Yellow
    if (score >= 40) return [231, 76, 60]; // Red
    return [149, 165, 166]; // Gray
}

/**
 * List available executive reports
 */
function listExecutiveReports() {
    try {
        const reportsDir = path.join(__dirname, '../reports');
        
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
            return [];
        }
        
        const files = fs.readdirSync(reportsDir);
        const reports = files
            .filter(file => file.includes('executive-report') && file.endsWith('.pdf'))
            .map(file => ({
                filename: file,
                filepath: path.join(reportsDir, file),
                size: fs.statSync(path.join(reportsDir, file)).size,
                created: fs.statSync(path.join(reportsDir, file)).birthtime
            }))
            .sort((a, b) => b.created - a.created);
        
        return reports;
    } catch (error) {
        throw new Error(`Failed to list executive reports: ${error.message}`);
    }
}

/**
 * Delete an executive report
 */
function deleteExecutiveReport(filename) {
    try {
        const filepath = path.join(__dirname, '../reports', filename);
        
        if (!fs.existsSync(filepath)) {
            throw new Error('Executive report file not found');
        }
        
        fs.unlinkSync(filepath);
        
        return { success: true, message: 'Executive report deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete executive report: ${error.message}`);
    }
}

module.exports = {
    generateExecutiveReport,
    listExecutiveReports,
    deleteExecutiveReport
};