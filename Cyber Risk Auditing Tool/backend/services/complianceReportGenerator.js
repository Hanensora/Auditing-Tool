const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { db } = require('../../config/database');

/**
 * Compliance Report Generator Service
 * Generates professional compliance assessment PDF reports with enhanced visibility and comprehensive content
 */

/**
 * Generate compliance report with enhanced visibility and comprehensive content
 */
function generateComplianceReport(assessmentData) {
    try {
        const { organizationName, industrySector, compliance, nistScores, isoScores, recommendations } = assessmentData;
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Cover Page with enhanced visibility - Light pink background for better text contrast
        doc.setFillColor(255, 240, 240); // Light pink background for better text visibility
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setFillColor(46, 204, 113);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.text('COMPLIANCE ASSESSMENT', 20, 30);
        
        // Organization Header with white background for contrast
        doc.setTextColor(44, 62, 80);
        doc.setFillColor(255, 255, 255); // White background for better text visibility
        doc.rect(20, 50, pageWidth - 40, 60, 'F');
        doc.setFontSize(18);
        doc.text('Regulatory Compliance Report', 25, 65);
        doc.setFontSize(11);
        doc.text(`Organization: ${organizationName}`, 25, 75);
        doc.text(`Industry Sector: ${industrySector}`, 25, 85);
        doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 25, 95);
        
        // Page 2: Executive Summary with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Compliance Executive Summary', 20, 30);
        
        doc.setFontSize(12);
        doc.text('This compliance report provides a comprehensive analysis of your organization\'s', 20, 45);
        doc.text('adherence to industry regulations and security standards. The following sections', 20, 55);
        doc.text('detail compliance status, regulatory requirements, and specific actions needed', 20, 65);
        doc.text('to achieve full compliance.', 20, 75);
        
        // Overall Compliance Score with enhanced visibility
        doc.setFontSize(16);
        doc.text('Overall Compliance Assessment', 20, 95);
        
        // Compliance Score Circle with enhanced visibility
        doc.setFillColor(255, 255, 255);
        doc.circle(160, 120, 30, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.circle(160, 120, 30, 'D');
        
        let complianceColor = [46, 204, 113]; // Green
        let complianceText = 'COMPLIANT';
        const overallScore = Math.round((compliance.nistScore + compliance.isoScore) / 2);
        
        if (overallScore < 50) {
            complianceColor = [231, 76, 60]; // Red
            complianceText = 'NON-COMPLIANT';
        } else if (overallScore < 70) {
            complianceColor = [241, 196, 15]; // Yellow
            complianceText = 'PARTIALLY COMPLIANT';
        }
        
        doc.setFillColor(...complianceColor);
        doc.circle(160, 120, 30 * (overallScore / 100), 'F');
        
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text(`${overallScore}%`, 145, 125);
        doc.setFontSize(12);
        doc.text(complianceText, 135, 135);
        
        // Page 3: NIST Framework Compliance with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('NIST Cybersecurity Framework Compliance', 20, 30);
        
        let yPos = 45;
        
        // IDENTIFY Compliance with comprehensive analysis
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text('IDENTIFY Framework Compliance', 20, yPos);
        yPos += 15;
        
        const identifyScore = nistScores.IDENTIFY || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${identifyScore}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        if (identifyScore >= 80) {
            doc.text('Your organization demonstrates excellent compliance with the IDENTIFY', 30, yPos);
            doc.text('framework. Asset management, risk assessment, and governance processes', 30, yPos + 8);
            doc.text('are comprehensive and well-documented. All critical assets are properly', 30, yPos + 16);
            doc.text('identified, classified, and tracked throughout their lifecycle.', 30, yPos + 24);
        } else if (identifyScore >= 60) {
            doc.text('Your organization shows good compliance with the IDENTIFY framework', 30, yPos);
            doc.text('with some areas requiring improvement. Asset identification and risk', 30, yPos + 8);
            doc.text('management processes are adequate but could be enhanced. Some gaps', 30, yPos + 16);
            doc.text('exist in asset classification or risk assessment documentation.', 30, yPos + 24);
        } else {
            doc.text('Your organization has significant compliance gaps in the IDENTIFY', 30, yPos);
            doc.text('framework. Critical asset identification and risk assessment processes', 30, yPos + 8);
            doc.text('are insufficient or incomplete. Asset inventory is likely outdated or', 30, yPos + 16);
            doc.text('incomplete, posing significant compliance risks.', 30, yPos + 24);
        }
        
        yPos += 40;
        doc.text('Evidence Requirements:', 25, yPos);
        yPos += 10;
        
        const identifyEvidence = [
            'Comprehensive asset inventory documentation with classification',
            'Risk assessment reports and methodologies with documented processes',
            'Business environment analysis documentation with threat modeling',
            'Governance policies and procedures with approval workflows',
            'Asset classification and tagging standards with enforcement mechanisms',
            'Configuration management database (CMDB) with automated discovery',
            'Asset ownership documentation with responsibility assignments'
        ];
        
        identifyEvidence.forEach((evidence, index) => {
            doc.text(`• ${evidence}`, 30, yPos + (index * 10));
        });
        
        yPos += 90;
        
        // PROTECT Compliance with comprehensive analysis
        doc.setFontSize(14);
        doc.text('PROTECT Framework Compliance', 20, yPos);
        yPos += 15;
        
        const protectScore = nistScores.PROTECT || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${protectScore}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        if (protectScore >= 80) {
            doc.text('Your organization demonstrates excellent compliance with the PROTECT', 30, yPos);
            doc.text('framework. Access controls, data protection, and security technologies', 30, yPos + 8);
            doc.text('are robust and effectively implemented. All required security controls', 30, yPos + 16);
            doc.text('are in place and properly configured.', 30, yPos + 24);
        } else if (protectScore >= 60) {
            doc.text('Your organization shows good compliance with the PROTECT framework', 30, yPos);
            doc.text('with some security control gaps. Protective measures are adequate but', 30, yPos + 8);
            doc.text('require enhancement in specific areas. Some controls may be outdated', 30, yPos + 16);
            doc.text('or inconsistently applied across the environment.', 30, yPos + 24);
        } else {
            doc.text('Your organization has significant compliance gaps in the PROTECT', 30, yPos);
            doc.text('framework. Critical security controls are missing or ineffective,', 30, yPos + 8);
            doc.text('posing significant security risks. Basic security controls such as', 30, yPos + 16);
            doc.text('firewalls, access controls, and encryption may be missing.', 30, yPos + 24);
        }
        
        yPos += 40;
        doc.text('Evidence Requirements:', 25, yPos);
        yPos += 10;
        
        const protectEvidence = [
            'Access control policies and procedures with enforcement mechanisms',
            'Data encryption implementation documentation with algorithm specifications',
            'Security technology configuration standards with compliance validation',
            'Identity and access management records with audit trails',
            'Security awareness training documentation with completion records',
            'Vulnerability management processes with remediation tracking',
            'Security configuration baselines with compliance monitoring'
        ];
        
        protectEvidence.forEach((evidence, index) => {
            doc.text(`• ${evidence}`, 30, yPos + (index * 10));
        });
        
        // Page 4: DETECT and RESPOND Compliance with comprehensive content
        doc.addPage();
        doc.setFontSize(14);
        doc.text('DETECT Framework Compliance', 20, 30);
        
        let yPos2 = 45;
        const detectScore = nistScores.DETECT || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${detectScore}%`, 25, yPos2);
        yPos2 += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos2);
        yPos2 += 10;
        
        doc.setFontSize(10);
        if (detectScore >= 80) {
            doc.text('Your organization demonstrates excellent compliance with the DETECT', 30, yPos2);
            doc.text('framework. Security monitoring, detection capabilities, and continuous', 30, yPos2 + 8);
            doc.text('monitoring are comprehensive and effective. All required monitoring', 30, yPos2 + 16);
            doc.text('controls are in place and functioning properly.', 30, yPos2 + 24);
        } else if (detectScore >= 60) {
            doc.text('Your organization shows good compliance with the DETECT framework', 30, yPos2);
            doc.text('with some monitoring gaps. Detection capabilities are adequate but', 30, yPos2 + 8);
            doc.text('require improvement in coverage and effectiveness. Some monitoring', 30, yPos2 + 16);
            doc.text('tools may be missing or not properly configured.', 30, yPos2 + 24);
        } else {
            doc.text('Your organization has significant compliance gaps in the DETECT', 30, yPos2);
            doc.text('framework. Security monitoring and detection capabilities are', 30, yPos2 + 8);
            doc.text('insufficient, creating blind spots. Critical systems may not be', 30, yPos2 + 16);
            doc.text('monitored, and threat detection is inadequate.', 30, yPos2 + 24);
        }
        
        yPos2 += 40;
        doc.text('Evidence Requirements:', 25, yPos2);
        yPos2 += 10;
        
        const detectEvidence = [
            'Security monitoring and logging policies with implementation details',
            'Intrusion detection system configurations with rule sets and signatures',
            'Security event correlation documentation with correlation rules',
            'Continuous monitoring procedures with monitoring schedules',
            'Anomaly detection implementation records with detection algorithms',
            'Log management processes with retention policies',
            'Security information and event management (SIEM) configurations'
        ];
        
        detectEvidence.forEach((evidence, index) => {
            doc.text(`• ${evidence}`, 30, yPos2 + (index * 10));
        });
        
        yPos2 += 90;
        
        // RESPOND Compliance with comprehensive analysis
        doc.setFontSize(14);
        doc.text('RESPOND Framework Compliance', 20, yPos2);
        yPos2 += 15;
        
        const respondScore = nistScores.RESPOND || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${respondScore}%`, 25, yPos2);
        yPos2 += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos2);
        yPos2 += 10;
        
        doc.setFontSize(10);
        if (respondScore >= 80) {
            doc.text('Your organization demonstrates excellent compliance with the RESPOND', 30, yPos2);
            doc.text('framework. Incident response capabilities, communication procedures,', 30, yPos2 + 8);
            doc.text('and response planning are comprehensive and tested. All incident', 30, yPos2 + 16);
            doc.text('response processes are documented and regularly exercised.', 30, yPos2 + 24);
        } else if (respondScore >= 60) {
            doc.text('Your organization shows good compliance with the RESPOND framework', 30, yPos2);
            doc.text('with some response capability gaps. Incident response procedures', 30, yPos2 + 8);
            doc.text('are adequate but require refinement and testing. Some response', 30, yPos2 + 16);
            doc.text('processes may not be regularly tested or updated.', 30, yPos2 + 24);
        } else {
            doc.text('Your organization has significant compliance gaps in the RESPOND', 30, yPos2);
            doc.text('framework. Incident response capabilities are inadequate, posing', 30, yPos2 + 8);
            doc.text('significant operational risks. Incident response plans may be', 30, yPos2 + 16);
            doc.text('missing, outdated, or not tested.', 30, yPos2 + 24);
        }
        
        yPos2 += 40;
        doc.text('Evidence Requirements:', 25, yPos2);
        yPos2 += 10;
        
        const respondEvidence = [
            'Incident response plans and procedures with escalation matrices',
            'Communication and coordination protocols with contact information',
            'Incident response team documentation with roles and responsibilities',
            'Response testing and exercise records with test results and improvements',
            'Forensic analysis capabilities documentation with tool specifications',
            'Incident classification and severity definitions with response timelines',
            'Post-incident review processes with lessons learned documentation'
        ];
        
        respondEvidence.forEach((evidence, index) => {
            doc.text(`• ${evidence}`, 30, yPos2 + (index * 10));
        });
        
        // Page 5: RECOVER and ISO 27001 Compliance with comprehensive content
        doc.addPage();
        doc.setFontSize(14);
        doc.text('RECOVER Framework Compliance', 20, 30);
        
        let yPos3 = 45;
        const recoverScore = nistScores.RECOVER || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${recoverScore}%`, 25, yPos3);
        yPos3 += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos3);
        yPos3 += 10;
        
        doc.setFontSize(10);
        if (recoverScore >= 80) {
            doc.text('Your organization demonstrates excellent compliance with the RECOVER', 30, yPos3);
            doc.text('framework. Backup and recovery procedures, business continuity', 30, yPos3 + 8);
            doc.text('planning, and recovery testing are comprehensive and effective.', 30, yPos3 + 16);
            doc.text('All recovery processes are documented, tested, and can be executed', 30, yPos3 + 24);
            doc.text('within defined recovery objectives.', 30, yPos3 + 32);
        } else if (recoverScore >= 60) {
            doc.text('Your organization shows good compliance with the RECOVER framework', 30, yPos3);
            doc.text('with some recovery capability gaps. Backup and recovery processes', 30, yPos3 + 8);
            doc.text('are adequate but require improvement and testing. Some recovery', 30, yPos3 + 16);
            doc.text('procedures may not be regularly tested or may have gaps.', 30, yPos3 + 24);
        } else {
            doc.text('Your organization has significant compliance gaps in the RECOVER', 30, yPos3);
            doc.text('framework. Recovery capabilities are insufficient, creating high', 30, yPos3 + 8);
            doc.text('risk of extended downtime. Backup procedures are inadequate,', 30, yPos3 + 16);
            doc.text('recovery plans are missing or untested, and business continuity', 30, yPos3 + 24);
            doc.text('planning is insufficient.', 30, yPos3 + 32);
        }
        
        yPos3 += 50;
        doc.text('Evidence Requirements:', 25, yPos3);
        yPos3 += 10;
        
        const recoverEvidence = [
            'Backup and recovery procedures documentation with recovery steps',
            'Business continuity plans with business impact analysis',
            'Disaster recovery strategies with recovery site configurations',
            'Recovery testing and validation records with test results',
            'Business impact analysis documentation with criticality assessments',
            'Recovery time and recovery point objectives with validation results',
            'Backup retention policies with compliance verification'
        ];
        
        recoverEvidence.forEach((evidence, index) => {
            doc.text(`• ${evidence}`, 30, yPos3 + (index * 10));
        });
        
        yPos3 += 90;
        
        // ISO 27001 Compliance Overview with comprehensive analysis
        doc.setFontSize(14);
        doc.text('ISO 27001:2013 Compliance Overview', 20, yPos3);
        yPos3 += 15;
        
        doc.setFontSize(12);
        doc.text(`Overall ISO 27001 Score: ${compliance.isoScore}%`, 25, yPos3);
        yPos3 += 12;
        
        doc.setFontSize(11);
        doc.text('Compliance Status:', 25, yPos3);
        yPos3 += 10;
        
        doc.setFontSize(10);
        if (compliance.isoScore >= 80) {
            doc.text('Your organization demonstrates excellent ISO 27001 compliance.', 30, yPos3);
            doc.text('Information security management system (ISMS) is comprehensive,', 30, yPos3 + 8);
            doc.text('well-implemented, and effectively maintained. All required controls', 30, yPos3 + 16);
            doc.text('are in place and functioning as intended.', 30, yPos3 + 24);
        } else if (compliance.isoScore >= 60) {
            doc.text('Your organization shows good ISO 27001 compliance with some', 30, yPos3);
            doc.text('control gaps. ISMS is adequately implemented but requires', 30, yPos3 + 8);
            doc.text('enhancement in specific areas. Some controls may need improvement', 30, yPos3 + 16);
            doc.text('or additional documentation.', 30, yPos3 + 24);
        } else {
            doc.text('Your organization has significant ISO 27001 compliance gaps.', 30, yPos3);
            doc.text('ISMS implementation is insufficient and requires substantial', 30, yPos3 + 8);
            doc.text('improvement to meet standard requirements. Critical controls are', 30, yPos3 + 16);
            doc.text('missing or not properly implemented.', 30, yPos3 + 24);
        }
        
        // Page 6: Industry-Specific Requirements with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Industry-Specific Regulatory Requirements', 20, 30);
        
        let yPos4 = 45;
        
        // Healthcare Industry Requirements with comprehensive details
        if (industrySector === 'healthcare') {
            doc.setFontSize(14);
            doc.text('HIPAA Security Rule Compliance', 20, yPos4);
            yPos4 += 15;
            
            doc.setFontSize(12);
            doc.text('Required Compliance Areas:', 25, yPos4);
            yPos4 += 12;
            
            const hipaaRequirements = [
                'Administrative Safeguards: Security management processes, workforce training,',
                '  and information access management',
                'Physical Safeguards: Facility access controls, workstation security,',
                '  and device/media controls',
                'Technical Safeguards: Access controls, audit controls, integrity controls,',
                '  and transmission security',
                'Risk Analysis: Comprehensive risk analysis and risk management processes',
                'Business Associate Agreements: Properly documented BAAs with all vendors',
                'Incident Response: Documented procedures for security incident handling',
                'Audit Controls: Automated mechanisms for recording and examining access'
            ];
            
            hipaaRequirements.forEach((req, index) => {
                doc.text(`${index + 1}. ${req}`, 30, yPos4 + (index * 12));
            });
            
            yPos4 += 120;
            
            doc.setFontSize(12);
            doc.text('Evidence Required for HIPAA Compliance:', 25, yPos4);
            yPos4 += 12;
            
            const hipaaEvidence = [
                'Risk analysis documentation with identified vulnerabilities and threats',
                'Security policies and procedures with implementation details',
                'Workforce training records with training completion verification',
                'Access control configurations with user access reviews',
                'Audit log management procedures with log retention policies',
                'Business associate agreements with security requirements',
                'Incident response procedures for PHI breaches with response timelines',
                'Security awareness training materials with employee acknowledgments'
            ];
            
            hipaaEvidence.forEach((evidence, index) => {
                doc.text(`• ${evidence}`, 30, yPos4 + (index * 10));
            });
            
        } else if (industrySector === 'finance') {
            // Finance Industry Requirements with comprehensive details
            doc.setFontSize(14);
            doc.text('Financial Industry Compliance Requirements', 20, yPos4);
            yPos4 += 15;
            
            doc.setFontSize(12);
            doc.text('Required Compliance Areas:', 25, yPos4);
            yPos4 += 12;
            
            const financeRequirements = [
                'PCI DSS Compliance: Payment card data protection and security controls',
                'SOX Section 404: Internal controls over financial reporting',
                'FFIEC Cybersecurity Assessment: Financial services cybersecurity framework',
                'Customer Data Protection: Safeguarding sensitive financial information',
                'Regulatory Reporting: Compliance with financial regulatory requirements',
                'Third-Party Risk Management: Vendor security assessments and monitoring',
                'Data Encryption: Encryption of sensitive financial data at rest and in transit',
                'Access Controls: Role-based access controls for financial systems'
            ];
            
            financeRequirements.forEach((req, index) => {
                doc.text(`${index + 1}. ${req}`, 30, yPos4 + (index * 12));
            });
            
            yPos4 += 120;
            
            doc.setFontSize(12);
            doc.text('Evidence Required for Financial Compliance:', 25, yPos4);
            yPos4 += 12;
            
            const financeEvidence = [
                'PCI DSS compliance documentation and validation reports',
                'SOX compliance testing and controls documentation with test results',
                'FFIEC assessment results and improvement plans with remediation tracking',
                'Customer data protection policies and procedures with implementation details',
                'Financial regulatory compliance reports with audit trails',
                'Third-party risk assessment documentation with vendor security reviews',
                'Data encryption implementation records with algorithm specifications',
                'Access control documentation with user access reviews and approvals'
            ];
            
            financeEvidence.forEach((evidence, index) => {
                doc.text(`• ${evidence}`, 30, yPos4 + (index * 10));
            });
        } else {
            // General Industry Requirements with comprehensive details
            doc.setFontSize(14);
            doc.text('General Industry Compliance Requirements', 20, yPos4);
            yPos4 += 15;
            
            doc.setFontSize(12);
            doc.text('Required Compliance Areas:', 25, yPos4);
            yPos4 += 12;
            
            const generalRequirements = [
                'Data Protection: Safeguarding sensitive organizational and customer data',
                'Access Control: Proper access management and authentication controls',
                'Incident Response: Documented procedures for security incident handling',
                'Risk Management: Ongoing risk assessment and mitigation processes',
                'Security Awareness: Regular training and awareness programs',
                'Regulatory Compliance: Adherence to applicable industry regulations',
                'Audit and Monitoring: Continuous monitoring and audit capabilities',
                'Business Continuity: Business continuity and disaster recovery planning'
            ];
            
            generalRequirements.forEach((req, index) => {
                doc.text(`${index + 1}. ${req}`, 30, yPos4 + (index * 12));
            });
            
            yPos4 += 120;
            
            doc.setFontSize(12);
            doc.text('Evidence Required for General Compliance:', 25, yPos4);
            yPos4 += 12;
            
            const generalEvidence = [
                'Data protection policies and procedures with implementation details',
                'Access control documentation and logs with access review records',
                'Incident response plans and testing records with improvement actions',
                'Risk assessment documentation with risk treatment plans',
                'Security awareness training records with completion verification',
                'Regulatory compliance documentation with compliance validation',
                'Audit and monitoring procedures with monitoring reports',
                'Business continuity plans with testing and validation results'
            ];
            
            generalEvidence.forEach((evidence, index) => {
                doc.text(`• ${evidence}`, 30, yPos4 + (index * 10));
            });
        }
        
        // Page 7: Compliance Improvement Plan with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Compliance Improvement Plan', 20, 30);
        
        let yPos5 = 45;
        
        // Priority Actions with comprehensive details
        doc.setFontSize(14);
        doc.text('Priority Compliance Actions', 20, yPos5);
        yPos5 += 15;
        
        doc.setFontSize(12);
        doc.text('Based on the assessment results, the following actions are recommended:', 25, yPos5);
        yPos5 += 12;
        
        // Generate specific recommendations based on scores with comprehensive details
        const improvementActions = [];
        
        if (compliance.nistScore < 70) {
            improvementActions.push('Enhance NIST Cybersecurity Framework implementation with comprehensive controls');
        }
        if (compliance.isoScore < 70) {
            improvementActions.push('Improve ISO 27001 control implementation with proper documentation');
        }
        if (identifyScore < 70) {
            improvementActions.push('Strengthen asset identification and risk assessment processes with automation');
        }
        if (protectScore < 70) {
            improvementActions.push('Implement additional protective security controls with proper configuration');
        }
        if (detectScore < 70) {
            improvementActions.push('Enhance security monitoring and detection capabilities with advanced tools');
        }
        if (respondScore < 70) {
            improvementActions.push('Improve incident response procedures with regular testing and training');
        }
        if (recoverScore < 70) {
            improvementActions.push('Strengthen backup and recovery capabilities with comprehensive testing');
        }
        
        improvementActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos5 + (index * 12));
        });
        
        yPos5 += 60 + (improvementActions.length * 12);
        
        // Timeline with comprehensive details
        doc.setFontSize(14);
        doc.text('Implementation Timeline', 20, yPos5);
        yPos5 += 15;
        
        doc.setFontSize(12);
        doc.text('Recommended Implementation Schedule:', 25, yPos5);
        yPos5 += 12;
        
        const timeline = [
            'Phase 1 (0-3 months): Address critical compliance gaps and high-risk areas',
            'Phase 2 (3-6 months): Implement medium-priority improvements and controls',
            'Phase 3 (6-12 months): Enhance existing controls and achieve full compliance',
            'Ongoing: Continuous monitoring, testing, and improvement of compliance posture'
        ];
        
        timeline.forEach((phase, index) => {
            doc.text(`${index + 1}. ${phase}`, 30, yPos5 + (index * 12));
        });
        
        // Footer with enhanced visibility
        doc.setDrawColor(220, 220, 220);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Compliance Report - For Audit and Regulatory Purposes', 20, pageHeight - 20);
        doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - 100, pageHeight - 20);
        doc.text('Confidential - Audit Documentation', pageWidth - 100, pageHeight - 15);
        
        // Save PDF
        const filename = `compliance-report-${organizationName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../reports', filename);
        
        doc.save(filepath);
        
        return {
            success: true,
            filename,
            filepath,
            reportType: 'compliance'
        };
    } catch (error) {
        throw new Error(`Compliance report generation failed: ${error.message}`);
    }
}

/**
 * List available compliance reports
 */
function listComplianceReports() {
    try {
        const reportsDir = path.join(__dirname, '../reports');
        
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
            return [];
        }
        
        const files = fs.readdirSync(reportsDir);
        const reports = files
            .filter(file => file.includes('compliance-report') && file.endsWith('.pdf'))
            .map(file => ({
                filename: file,
                filepath: path.join(reportsDir, file),
                size: fs.statSync(path.join(reportsDir, file)).size,
                created: fs.statSync(path.join(reportsDir, file)).birthtime
            }))
            .sort((a, b) => b.created - a.created);
        
        return reports;
    } catch (error) {
        throw new Error(`Failed to list compliance reports: ${error.message}`);
    }
}

/**
 * Delete a compliance report
 */
function deleteComplianceReport(filename) {
    try {
        const filepath = path.join(__dirname, '../reports', filename);
        
        if (!fs.existsSync(filepath)) {
            throw new Error('Compliance report file not found');
        }
        
        fs.unlinkSync(filepath);
        
        return { success: true, message: 'Compliance report deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete compliance report: ${error.message}`);
    }
}

module.exports = {
    generateComplianceReport,
    listComplianceReports,
    deleteComplianceReport
};