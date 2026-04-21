const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { db } = require('../../config/database');

/**
 * Technical Report Generator Service
 * Generates professional technical analysis PDF reports with enhanced visibility and comprehensive content
 */

/**
 * Generate technical report with enhanced visibility and comprehensive content
 */
function generateTechnicalReport(assessmentData) {
    try {
        const { organizationName, industrySector, riskScore, riskLevel, nistScores, isoScores, recommendations, compliance } = assessmentData;
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Cover Page with enhanced visibility - Light blue background for better text contrast
        doc.setFillColor(230, 240, 255); // Light blue background for better text visibility
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setFillColor(52, 73, 94);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text('TECHNICAL CYBER RISK ASSESSMENT', 20, 30);
        
        // Organization Header with white background for contrast
        doc.setTextColor(44, 62, 80);
        doc.setFillColor(255, 255, 255); // White background for better text visibility
        doc.rect(20, 50, pageWidth - 40, 50, 'F');
        doc.setFontSize(18);
        doc.text('Technical Analysis Report', 25, 65);
        doc.setFontSize(11);
        doc.text(`Organization: ${organizationName}`, 25, 75);
        doc.text(`Industry Sector: ${industrySector}`, 25, 85);
        doc.text(`Risk Level: ${riskLevel} (${riskScore}%)`, 25, 95);
        doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 25, 105);
        
        // Add technical details section
        doc.setFontSize(12);
        doc.text('Report Classification: INTERNAL USE', 25, 115);
        doc.text('Distribution: IT Security Team, Technical Staff', 25, 125);
        doc.text('Report Version: 2.0', 25, 135);
        
        // Page 2: Executive Summary with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Technical Executive Summary', 20, 30);
        
        doc.setFontSize(12);
        doc.text('This technical report provides a comprehensive analysis of your organization\'s', 20, 45);
        doc.text('cybersecurity posture based on the NIST Cybersecurity Framework and ISO 27001', 20, 55);
        doc.text('standards. The following sections detail technical findings, vulnerabilities,', 20, 65);
        doc.text('and specific remediation strategies for your IT security team.', 20, 75);
        
        // Overall Technical Score with enhanced visibility
        doc.setFontSize(16);
        doc.text('Overall Technical Risk Assessment', 20, 95);
        
        // Risk Score Circle with enhanced visibility
        doc.setFillColor(255, 255, 255);
        doc.circle(160, 120, 30, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.circle(160, 120, 30, 'D');
        
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
        doc.circle(160, 120, 30 * (riskScore / 100), 'F');
        
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text(`${riskScore}%`, 145, 125);
        doc.setFontSize(12);
        doc.text(riskText, 140, 135);
        
        // Page 3: NIST Framework Analysis with comprehensive technical content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('NIST Cybersecurity Framework - Technical Analysis', 20, 30);
        
        let yPos = 45;
        
        // IDENTIFY Analysis with comprehensive technical details
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text('IDENTIFY Framework - Asset Management & Risk Assessment', 20, yPos);
        yPos += 15;
        
        const identifyScore = nistScores.IDENTIFY || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${identifyScore}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Current State Analysis:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        if (identifyScore >= 80) {
            doc.text('Your organization has excellent asset visibility and risk management practices.', 30, yPos);
            doc.text('All critical assets are properly identified, classified, and risk assessments are', 30, yPos + 8);
            doc.text('conducted regularly. Configuration management database (CMDB) is comprehensive', 30, yPos + 16);
            doc.text('and up-to-date with automated discovery mechanisms.', 30, yPos + 24);
        } else if (identifyScore >= 60) {
            doc.text('Your organization has good asset management practices with some areas for', 30, yPos);
            doc.text('improvement. Most critical assets are identified but some gaps exist in', 30, yPos + 8);
            doc.text('classification or risk assessment processes. Manual processes may be', 30, yPos + 16);
            doc.text('supplementing automated discovery tools.', 30, yPos + 24);
        } else {
            doc.text('Your organization has significant gaps in asset identification and risk', 30, yPos);
            doc.text('management. Critical assets may be unknown, and risk assessments are', 30, yPos + 8);
            doc.text('incomplete or outdated. Manual asset tracking is likely the primary', 30, yPos + 16);
            doc.text('method, leading to potential blind spots in the environment.', 30, yPos + 24);
        }
        
        yPos += 40;
        doc.text('Technical Actions Required:', 25, yPos);
        yPos += 10;
        
        const identifyActions = getDetailedNISTActions('IDENTIFY', identifyScore);
        identifyActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos + (index * 10));
        });
        
        yPos += 60;
        
        // PROTECT Analysis with comprehensive technical details
        doc.setFontSize(14);
        doc.text('PROTECT Framework - Protective Controls', 20, yPos);
        yPos += 15;
        
        const protectScore = nistScores.PROTECT || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${protectScore}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Current State Analysis:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        if (protectScore >= 80) {
            doc.text('Your organization has robust protective controls in place. Access controls,', 30, yPos);
            doc.text('encryption, and security technologies are properly implemented and maintained.', 30, yPos + 8);
            doc.text('Multi-factor authentication is enforced, network segmentation is properly', 30, yPos + 16);
            doc.text('implemented, and endpoint protection is comprehensive.', 30, yPos + 24);
        } else if (protectScore >= 60) {
            doc.text('Your organization has adequate protective controls with some vulnerabilities.', 30, yPos);
            doc.text('Some security controls may be outdated or not consistently applied.', 30, yPos + 8);
            doc.text('Partial implementation of MFA, inconsistent network segmentation,', 30, yPos + 16);
            doc.text('and gaps in endpoint protection coverage exist.', 30, yPos + 24);
        } else {
            doc.text('Your organization has significant security control gaps. Critical protective', 30, yPos);
            doc.text('measures are missing or ineffective. Basic security controls such as', 30, yPos + 8);
            doc.text('firewalls, antivirus, and access controls may be missing or improperly', 30, yPos + 16);
            doc.text('configured.', 30, yPos + 24);
        }
        
        yPos += 40;
        doc.text('Technical Actions Required:', 25, yPos);
        yPos += 10;
        
        const protectActions = getDetailedNISTActions('PROTECT', protectScore);
        protectActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos + (index * 10));
        });
        
        // Page 4: DETECT Analysis with comprehensive technical details
        doc.addPage();
        doc.setFontSize(14);
        doc.text('DETECT Framework - Detection Capabilities', 20, 30);
        
        let yPos2 = 45;
        const detectScore = nistScores.DETECT || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${detectScore}%`, 25, yPos2);
        yPos2 += 12;
        
        doc.setFontSize(11);
        doc.text('Current State Analysis:', 25, yPos2);
        yPos2 += 10;
        
        doc.setFontSize(10);
        if (detectScore >= 80) {
            doc.text('Your organization has excellent detection capabilities. Security monitoring,', 30, yPos2);
            doc.text('log management, and anomaly detection are comprehensive and effective.', 30, yPos2 + 8);
            doc.text('Security Information and Event Management (SIEM) is properly configured', 30, yPos2 + 16);
            doc.text('with comprehensive log sources and effective correlation rules.', 30, yPos2 + 24);
        } else if (detectScore >= 60) {
            doc.text('Your organization has adequate detection capabilities with some blind spots.', 30, yPos2);
            doc.text('Monitoring coverage may be incomplete or detection rules need refinement.', 30, yPos2 + 8);
            doc.text('Basic log collection exists but may lack comprehensive coverage or', 30, yPos2 + 16);
            doc.text('advanced correlation capabilities.', 30, yPos2 + 24);
        } else {
            doc.text('Your organization has significant detection gaps. Threats may go', 30, yPos2);
            doc.text('undetected for extended periods. Limited or no log collection, basic', 30, yPos2 + 8);
            doc.text('monitoring tools, and lack of security event correlation exist.', 30, yPos2 + 16);
        }
        
        yPos2 += 40;
        doc.text('Technical Actions Required:', 25, yPos2);
        yPos2 += 10;
        
        const detectActions = getDetailedNISTActions('DETECT', detectScore);
        detectActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos2 + (index * 10));
        });
        
        yPos2 += 60;
        
        // RESPOND Analysis with comprehensive technical details
        doc.setFontSize(14);
        doc.text('RESPOND Framework - Incident Response', 20, yPos2);
        yPos2 += 15;
        
        const respondScore = nistScores.RESPOND || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${respondScore}%`, 25, yPos2);
        yPos2 += 12;
        
        doc.setFontSize(11);
        doc.text('Current State Analysis:', 25, yPos2);
        yPos2 += 10;
        
        doc.setFontSize(10);
        if (respondScore >= 80) {
            doc.text('Your organization has excellent incident response capabilities. Response', 30, yPos2);
            doc.text('procedures are well-defined, tested, and effective. Security Operations', 30, yPos2 + 8);
            doc.text('Center (SOC) is operational with 24/7 monitoring and automated', 30, yPos2 + 16);
            doc.text('response capabilities.', 30, yPos2 + 24);
        } else if (respondScore >= 60) {
            doc.text('Your organization has adequate incident response capabilities with room for', 30, yPos2);
            doc.text('improvement. Some procedures may need refinement or testing.', 30, yPos2 + 8);
            doc.text('Incident response team exists but may lack comprehensive training', 30, yPos2 + 16);
            doc.text('or automation capabilities.', 30, yPos2 + 24);
        } else {
            doc.text('Your organization has significant incident response gaps. Response', 30, yPos2);
            doc.text('procedures are inadequate or untested. No formal incident response', 30, yPos2 + 8);
            doc.text('team, lack of documented procedures, and insufficient training exist.', 30, yPos2 + 16);
        }
        
        yPos2 += 40;
        doc.text('Technical Actions Required:', 25, yPos2);
        yPos2 += 10;
        
        const respondActions = getDetailedNISTActions('RESPOND', respondScore);
        respondActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos2 + (index * 10));
        });
        
        // Page 5: RECOVER Analysis with comprehensive technical details
        doc.addPage();
        doc.setFontSize(14);
        doc.text('RECOVER Framework - Recovery Capabilities', 20, 30);
        
        let yPos3 = 45;
        const recoverScore = nistScores.RECOVER || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${recoverScore}%`, 25, yPos3);
        yPos3 += 12;
        
        doc.setFontSize(11);
        doc.text('Current State Analysis:', 25, yPos3);
        yPos3 += 10;
        
        doc.setFontSize(10);
        if (recoverScore >= 80) {
            doc.text('Your organization has excellent recovery capabilities. Backup and recovery', 30, yPos3);
            doc.text('procedures are comprehensive and regularly tested. Disaster recovery', 30, yPos3 + 8);
            doc.text('plans are documented, tested, and can be executed within defined', 30, yPos3 + 16);
            doc.text('Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO).', 30, yPos3 + 24);
        } else if (recoverScore >= 60) {
            doc.text('Your organization has adequate recovery capabilities with some gaps.', 30, yPos3);
            doc.text('Backup procedures may need improvement or testing. Recovery plans', 30, yPos3 + 8);
            doc.text('exist but may not be regularly tested or may have gaps in coverage.', 30, yPos3 + 16);
        } else {
            doc.text('Your organization has significant recovery gaps. Data loss or extended', 30, yPos3);
            doc.text('downtime is likely in case of an incident. Backup procedures are', 30, yPos3 + 8);
            doc.text('inadequate, recovery plans are missing or untested, and business', 30, yPos3 + 16);
            doc.text('continuity planning is insufficient.', 30, yPos3 + 24);
        }
        
        yPos3 += 40;
        doc.text('Technical Actions Required:', 25, yPos3);
        yPos3 += 10;
        
        const recoverActions = getDetailedNISTActions('RECOVER', recoverScore);
        recoverActions.forEach((action, index) => {
            doc.text(`${index + 1}. ${action}`, 30, yPos3 + (index * 10));
        });
        
        // Page 6: ISO 27001 Control Analysis with comprehensive technical details
        doc.addPage();
        doc.setFontSize(18);
        doc.text('ISO 27001:2013 Control Analysis', 20, 30);
        
        yPos = 45;
        
        // A.9 Access Control with comprehensive technical details
        doc.setFontSize(14);
        doc.text('A.9 Access Control', 20, yPos);
        yPos += 15;
        
        const a9Score = isoScores['A.9 Access Control'] || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${a9Score}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Control Status:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.text('This control assesses user access management, authentication, and authorization', 30, yPos);
        doc.text('processes. It ensures that only authorized users have access to information', 30, yPos + 8);
        doc.text('systems and data based on business requirements.', 30, yPos + 16);
        
        yPos += 25;
        doc.text('Technical Specifications:', 25, yPos);
        yPos += 10;
        
        const a9Specs = [
            'Multi-factor authentication implementation for all privileged accounts',
            'Role-based access control (RBAC) configuration with least privilege principles',
            'User access review and approval processes with automated workflows',
            'Privileged access management (PAM) systems for administrative accounts',
            'Access logging and monitoring capabilities with real-time alerts',
            'Identity and Access Management (IAM) system integration',
            'Password policy enforcement with complexity requirements',
            'Session management and timeout controls'
        ];
        
        a9Specs.forEach((spec, index) => {
            doc.text(`• ${spec}`, 30, yPos + (index * 10));
        });
        
        yPos += 100;
        
        // A.10 Cryptography with comprehensive technical details
        doc.setFontSize(14);
        doc.text('A.10 Cryptography', 20, yPos);
        yPos += 15;
        
        const a10Score = isoScores['A.10 Cryptography'] || 0;
        doc.setFontSize(12);
        doc.text(`Score: ${a10Score}%`, 25, yPos);
        yPos += 12;
        
        doc.setFontSize(11);
        doc.text('Control Status:', 25, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.text('This control assesses encryption implementation for data protection. It ensures', 30, yPos);
        doc.text('that information is protected through appropriate cryptographic controls based', 30, yPos + 8);
        doc.text('on the classification and sensitivity of the data.', 30, yPos + 16);
        
        yPos += 25;
        doc.text('Technical Specifications:', 25, yPos);
        yPos += 10;
        
        const a10Specs = [
            'Data encryption at rest and in transit using industry-standard algorithms',
            'Cryptographic key management systems with proper key lifecycle management',
            'Certificate management and validation for SSL/TLS implementations',
            'Encryption algorithm standards compliance (AES-256, RSA-2048, etc.)',
            'Cryptographic protocol configuration with secure cipher suites',
            'Digital signature implementation for document integrity',
            'Hardware Security Modules (HSM) for key storage where required',
            'Encryption policy enforcement across all data repositories'
        ];
        
        a10Specs.forEach((spec, index) => {
            doc.text(`• ${spec}`, 30, yPos + (index * 10));
        });
        
        // Page 7: Detailed Technical Recommendations with comprehensive content
        doc.addPage();
        doc.setFontSize(18);
        doc.text('Detailed Technical Recommendations', 20, 30);
        
        yPos = 45;
        
        recommendations.forEach((rec, index) => {
            doc.setFontSize(14);
            doc.setTextColor(44, 62, 80);
            doc.text(`${index + 1}. ${rec.category} - ${rec.priority} Priority`, 20, yPos);
            yPos += 15;
            
            doc.setFontSize(12);
            doc.text('Recommendation:', 25, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.text(rec.recommendation, 30, yPos);
            yPos += 15;
            
            doc.setFontSize(12);
            doc.text('Implementation Plan:', 25, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.text(rec.action, 30, yPos);
            yPos += 20;
            
            // Technical requirements with comprehensive details
            const requirements = getTechnicalRequirements(rec.category);
            doc.setFontSize(12);
            doc.text('Technical Requirements:', 25, yPos);
            yPos += 12;
            
            doc.setFontSize(10);
            requirements.forEach((req, reqIndex) => {
                doc.text(`• ${req}`, 30, yPos + (reqIndex * 10));
            });
            
            yPos += 60;
        });
        
        // Footer with enhanced visibility
        doc.setDrawColor(220, 220, 220);
        doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Technical Report - For IT Security Teams and Technical Staff', 20, pageHeight - 20);
        doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - 100, pageHeight - 20);
        
        // Save PDF
        const filename = `technical-report-${organizationName.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        const filepath = path.join(__dirname, '../reports', filename);
        
        doc.save(filepath);
        
        return {
            success: true,
            filename,
            filepath,
            reportType: 'technical'
        };
    } catch (error) {
        throw new Error(`Technical report generation failed: ${error.message}`);
    }
}

/**
 * Get detailed NIST actions based on score and category with comprehensive content
 */
function getDetailedNISTActions(category, score) {
    const actions = {
        IDENTIFY: {
            high: [
                'Conduct comprehensive asset discovery across all environments using automated tools',
                'Implement automated asset classification and tagging with business criticality',
                'Establish continuous risk assessment processes with real-time monitoring',
                'Deploy configuration management database (CMDB) with automated synchronization',
                'Create detailed asset inventory documentation with ownership and lifecycle tracking',
                'Implement asset discovery for cloud and mobile environments',
                'Establish asset classification standards with enforcement mechanisms'
            ],
            medium: [
                'Improve asset discovery processes with additional coverage and automation',
                'Implement basic asset classification with business impact assessment',
                'Establish regular risk assessment schedule with documented methodologies',
                'Create comprehensive asset inventory documentation with classification',
                'Review and update asset management policies with current best practices',
                'Implement asset discovery for remote and branch offices',
                'Establish asset lifecycle management processes'
            ],
            low: [
                'Implement comprehensive asset discovery tools with network scanning capabilities',
                'Establish asset classification framework with business criticality levels',
                'Conduct initial comprehensive risk assessment with threat modeling',
                'Create configuration management database (CMDB) with integration capabilities',
                'Develop asset management policies and procedures with enforcement',
                'Implement asset discovery for all network segments and devices',
                'Establish asset ownership and accountability processes'
            ]
        },
        PROTECT: {
            high: [
                'Deploy next-generation firewalls with application awareness and deep packet inspection',
                'Implement network segmentation and micro-segmentation with zero-trust principles',
                'Configure advanced endpoint detection and response (EDR) with behavioral analysis',
                'Deploy data loss prevention (DLP) systems with content inspection capabilities',
                'Implement zero-trust architecture principles with identity-based access controls',
                'Deploy advanced threat protection with sandboxing and malware analysis',
                'Implement secure configuration management with automated compliance checking'
            ],
            medium: [
                'Update firewall rules and configurations with security best practices',
                'Implement basic network segmentation with VLAN isolation',
                'Deploy endpoint protection solutions with real-time monitoring',
                'Configure data encryption for sensitive information with key management',
                'Review and update access controls with least privilege principles',
                'Implement vulnerability management with automated patching',
                'Deploy security information and event management (SIEM) capabilities'
            ],
            low: [
                'Deploy comprehensive firewall solutions with proper rule configuration',
                'Implement network access controls with authentication requirements',
                'Deploy endpoint protection platforms with comprehensive coverage',
                'Implement data encryption solutions for all sensitive data',
                'Establish access control policies with role-based permissions',
                'Implement security awareness training with regular updates',
                'Deploy intrusion detection and prevention systems (IDPS)'
            ]
        },
        DETECT: {
            high: [
                'Implement Security Information and Event Management (SIEM) with advanced analytics',
                'Deploy advanced threat detection systems with machine learning capabilities',
                'Configure real-time log aggregation and correlation with automated analysis',
                'Establish continuous monitoring dashboards with executive reporting',
                'Implement automated threat hunting capabilities with proactive detection',
                'Deploy network traffic analysis with behavioral baselines',
                'Implement user and entity behavior analytics (UEBA) for anomaly detection'
            ],
            medium: [
                'Implement basic log management with centralized collection',
                'Deploy intrusion detection systems with signature-based detection',
                'Configure security monitoring alerts with escalation procedures',
                'Establish log review processes with regular analysis',
                'Implement basic threat detection with rule-based systems',
                'Deploy security monitoring for critical systems and networks',
                'Implement log retention policies with compliance requirements'
            ],
            low: [
                'Implement comprehensive log management with all system coverage',
                'Deploy security monitoring solutions with real-time capabilities',
                'Configure intrusion detection systems across all network segments',
                'Establish security event correlation with automated response',
                'Implement threat detection capabilities with signature and behavior analysis',
                'Deploy security monitoring for all critical assets and data flows',
                'Implement security monitoring policies with regular review processes'
            ]
        },
        RESPOND: {
            high: [
                'Develop and test comprehensive incident response playbooks with automation',
                'Implement automated incident response workflows with orchestration',
                'Deploy advanced threat hunting capabilities with proactive analysis',
                'Establish 24/7 security operations center (SOC) with skilled analysts',
                'Implement incident response automation tools with integration capabilities',
                'Deploy forensic analysis capabilities with advanced tooling',
                'Implement incident response coordination with external partners'
            ],
            medium: [
                'Update incident response procedures with current threat landscape',
                'Implement basic incident detection and reporting with escalation',
                'Establish communication and coordination processes with stakeholders',
                'Deploy forensic analysis capabilities with basic tooling',
                'Conduct incident response training with regular exercises',
                'Implement incident response documentation with lessons learned',
                'Establish incident response metrics with performance measurement'
            ],
            low: [
                'Develop comprehensive incident response procedures with detailed steps',
                'Implement incident detection and reporting systems with automation',
                'Establish communication and escalation procedures with contact lists',
                'Deploy forensic analysis tools with evidence collection capabilities',
                'Conduct regular incident response testing with tabletop exercises',
                'Implement incident response training with skill development',
                'Establish incident response coordination with external resources'
            ]
        },
        RECOVER: {
            high: [
                'Implement automated backup and recovery solutions with cloud integration',
                'Deploy disaster recovery orchestration tools with automated failover',
                'Establish comprehensive business continuity monitoring with real-time alerts',
                'Create detailed recovery documentation with step-by-step procedures',
                'Implement automated recovery testing with validation reports',
                'Deploy business continuity management systems with integration',
                'Implement recovery orchestration with automated workflows'
            ],
            medium: [
                'Improve backup and recovery procedures with automation capabilities',
                'Implement disaster recovery capabilities with defined recovery objectives',
                'Establish business continuity processes with regular testing',
                'Create recovery documentation with detailed recovery steps',
                'Conduct regular recovery testing with performance validation',
                'Implement backup monitoring with alerting capabilities',
                'Establish recovery procedures with alternative site arrangements'
            ],
            low: [
                'Implement comprehensive backup solutions with proper retention policies',
                'Deploy disaster recovery systems with defined recovery strategies',
                'Establish business continuity plans with detailed procedures',
                'Create detailed recovery procedures with testing requirements',
                'Implement regular recovery testing with validation and improvement',
                'Deploy backup and recovery monitoring with performance metrics',
                'Establish disaster recovery coordination with external providers'
            ]
        }
    };
    
    const categoryActions = actions[category] || actions.IDENTIFY;
    
    if (score >= 80) return categoryActions.high;
    if (score >= 60) return categoryActions.medium;
    return categoryActions.low;
}

/**
 * Get technical requirements with comprehensive content
 */
function getTechnicalRequirements(category) {
    const requirements = {
        IDENTIFY: [
            'Asset management system with automated discovery and classification capabilities',
            'Configuration management database (CMDB) with integration and synchronization',
            'Asset discovery tools with network scanning and agent-based collection',
            'Classification and tagging standards with business criticality levels',
            'Asset inventory documentation with ownership and lifecycle tracking',
            'Asset management workflows with approval processes and automation',
            'Asset tracking systems with real-time monitoring and reporting capabilities'
        ],
        PROTECT: [
            'Firewall and segmentation solutions with advanced threat protection capabilities',
            'Endpoint protection platforms with behavioral analysis and response capabilities',
            'Data encryption systems with key management and compliance validation',
            'Access control mechanisms with multi-factor authentication and role-based permissions',
            'Identity and access management (IAM) systems with centralized management',
            'Security information and event management (SIEM) with correlation and analysis',
            'Vulnerability management systems with automated scanning and remediation'
        ],
        DETECT: [
            'SIEM and log management with real-time processing and correlation capabilities',
            'Network monitoring tools with behavioral analysis and anomaly detection',
            'Threat detection systems with signature and behavior-based detection',
            'Security analytics platforms with machine learning and advanced analytics',
            'User and entity behavior analytics (UEBA) with insider threat detection',
            'Threat intelligence feeds with automated IOC processing and correlation',
            'Security monitoring dashboards with executive and operational views'
        ],
        RESPOND: [
            'Incident response platforms with automation and orchestration capabilities',
            'Threat intelligence feeds with automated IOC processing and correlation',
            'Forensic analysis tools with evidence collection and preservation capabilities',
            'Communication systems with escalation and notification capabilities',
            'Incident response coordination with external partners and stakeholders',
            'Incident response automation with playbook execution and response actions',
            'Incident response testing with regular exercises and improvement actions'
        ],
        RECOVER: [
            'Backup and recovery systems with automated processes and cloud integration',
            'Disaster recovery solutions with defined strategies and testing capabilities',
            'Business continuity monitoring with real-time alerts and reporting',
            'Recovery orchestration tools with automated workflows and manual override',
            'Business continuity management systems with integration and coordination',
            'Recovery testing and validation with regular testing and performance metrics',
            'Recovery documentation with detailed procedures and contact information'
        ]
    };
    
    return requirements[category] || [
        'Appropriate security tools with proper configuration and integration capabilities',
        'Monitoring and detection systems with real-time capabilities and alerting',
        'Response and recovery capabilities with automation and orchestration',
        'Documentation and procedures with comprehensive coverage and regular updates',
        'Security automation with orchestration and response capabilities',
        'Security monitoring with centralized collection and analysis capabilities',
        'Security training with regular updates and skill development programs'
    ];
}

/**
 * List available technical reports
 */
function listTechnicalReports() {
    try {
        const reportsDir = path.join(__dirname, '../reports');
        
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
            return [];
        }
        
        const files = fs.readdirSync(reportsDir);
        const reports = files
            .filter(file => file.includes('technical-report') && file.endsWith('.pdf'))
            .map(file => ({
                filename: file,
                filepath: path.join(reportsDir, file),
                size: fs.statSync(path.join(reportsDir, file)).size,
                created: fs.statSync(path.join(reportsDir, file)).birthtime
            }))
            .sort((a, b) => b.created - a.created);
        
        return reports;
    } catch (error) {
        throw new Error(`Failed to list technical reports: ${error.message}`);
    }
}

/**
 * Delete a technical report
 */
function deleteTechnicalReport(filename) {
    try {
        const filepath = path.join(__dirname, '../reports', filename);
        
        if (!fs.existsSync(filepath)) {
            throw new Error('Technical report file not found');
        }
        
        fs.unlinkSync(filepath);
        
        return { success: true, message: 'Technical report deleted successfully' };
    } catch (error) {
        throw new Error(`Failed to delete technical report: ${error.message}`);
    }
}

module.exports = {
    generateTechnicalReport,
    listTechnicalReports,
    deleteTechnicalReport
};