const { db } = require('../../config/database');

/**
 * Risk Calculator Service
 * Calculates comprehensive risk scores based on NIST Cybersecurity Framework
 */

/**
 * Calculate overall risk score and detailed breakdown
 */
function calculateRiskScore(assessmentData) {
    try {
        const { responses, organizationName, industrySector } = assessmentData;
        
        // Calculate category scores
        const categoryScores = calculateCategoryScores(responses);
        
        // Calculate overall risk score
        const overallScore = calculateOverallScore(categoryScores);
        
        // Determine risk level
        const riskLevel = determineRiskLevel(overallScore);
        
        // Generate recommendations
        const recommendations = generateRecommendations(categoryScores, responses);
        
        // Calculate compliance scores
        const compliance = calculateComplianceScores(categoryScores);
        
        // Calculate ISO 27001 scores
        const isoScores = calculateISO27001Scores(categoryScores);
        
        // Store assessment in database
        const assessmentId = storeAssessment({
            organizationName,
            industrySector,
            overallScore,
            riskLevel,
            categoryScores,
            recommendations,
            compliance,
            isoScores
        });
        
        return {
            success: true,
            assessmentId,
            overallScore,
            riskLevel,
            categoryScores,
            recommendations,
            compliance,
            isoScores
        };
    } catch (error) {
        throw new Error(`Risk calculation failed: ${error.message}`);
    }
}

/**
 * Calculate scores for each NIST category
 */
function calculateCategoryScores(responses) {
    const categories = {
        IDENTIFY: [],
        PROTECT: [],
        DETECT: [],
        RESPOND: [],
        RECOVER: []
    };
    
    // Group responses by category
    responses.forEach(response => {
        if (categories[response.category]) {
            categories[response.category].push(response);
        }
    });
    
    // Calculate scores for each category
    const categoryScores = {};
    Object.keys(categories).forEach(category => {
        const categoryResponses = categories[category];
        if (categoryResponses.length > 0) {
            const totalScore = categoryResponses.reduce((sum, response) => sum + response.score, 0);
            categoryScores[category] = Math.round(totalScore / categoryResponses.length);
        } else {
            categoryScores[category] = 0;
        }
    });
    
    return categoryScores;
}

/**
 * Calculate overall risk score from category scores
 */
function calculateOverallScore(categoryScores) {
    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
    const overallScore = Math.round(totalScore / Object.keys(categoryScores).length);
    return Math.max(0, Math.min(100, overallScore)); // Ensure score is between 0-100
}

/**
 * Determine risk level based on overall score
 */
function determineRiskLevel(score) {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
}

/**
 * Generate recommendations based on category scores and responses
 */
function generateRecommendations(categoryScores, responses) {
    const recommendations = [];
    
    // Analyze each category for improvement opportunities
    Object.keys(categoryScores).forEach(category => {
        const score = categoryScores[category];
        const categoryResponses = responses.filter(r => r.category === category);
        
        if (score < 70) {
            const lowScoreResponses = categoryResponses.filter(r => r.score < 70);
            
            lowScoreResponses.forEach(response => {
                const recommendation = createRecommendation(response, category, score);
                if (recommendation) {
                    recommendations.push(recommendation);
                }
            });
        }
    });
    
    // Sort recommendations by priority
    recommendations.sort((a, b) => {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    return recommendations.slice(0, 10); // Return top 10 recommendations
}

/**
 * Create a specific recommendation for a response
 */
function createRecommendation(response, category, categoryScore) {
    const priority = categoryScore < 50 ? 'High' : categoryScore < 70 ? 'Medium' : 'Low';
    
    const recommendations = {
        IDENTIFY: {
            'Asset Management': {
                'Low': {
                    'recommendation': 'Implement comprehensive asset discovery and inventory management',
                    'action': 'Deploy automated asset discovery tools and establish a centralized asset inventory system'
                },
                'Medium': {
                    'recommendation': 'Enhance asset classification and risk assessment processes',
                    'action': 'Implement asset classification based on business criticality and conduct regular risk assessments'
                },
                'High': {
                    'recommendation': 'Establish continuous asset monitoring and risk management',
                    'action': 'Implement continuous monitoring of asset changes and automated risk assessment workflows'
                }
            },
            'Risk Assessment': {
                'Low': {
                    'recommendation': 'Establish formal risk assessment methodology',
                    'action': 'Develop and implement a standardized risk assessment framework with documented procedures'
                },
                'Medium': {
                    'recommendation': 'Improve risk assessment coverage and frequency',
                    'action': 'Expand risk assessment scope to cover all critical assets and increase assessment frequency'
                },
                'High': {
                    'recommendation': 'Implement continuous risk monitoring and threat intelligence',
                    'action': 'Deploy continuous risk monitoring tools and integrate threat intelligence feeds'
                }
            }
        },
        PROTECT: {
            'Access Control': {
                'Low': {
                    'recommendation': 'Implement basic access control measures',
                    'action': 'Deploy multi-factor authentication and implement role-based access controls'
                },
                'Medium': {
                    'recommendation': 'Enhance access control policies and monitoring',
                    'action': 'Implement privileged access management and continuous access monitoring'
                },
                'High': {
                    'recommendation': 'Implement zero-trust architecture principles',
                    'action': 'Deploy zero-trust network architecture with continuous authentication and authorization'
                }
            },
            'Data Protection': {
                'Low': {
                    'recommendation': 'Implement basic data encryption and protection',
                    'action': 'Deploy encryption for sensitive data at rest and in transit with proper key management'
                },
                'Medium': {
                    'recommendation': 'Enhance data protection controls and monitoring',
                    'action': 'Implement data loss prevention and comprehensive data classification'
                },
                'High': {
                    'recommendation': 'Implement advanced data protection and monitoring',
                    'action': 'Deploy advanced data protection with real-time monitoring and automated response'
                }
            }
        },
        DETECT: {
            'Continuous Monitoring': {
                'Low': {
                    'recommendation': 'Implement basic security monitoring',
                    'action': 'Deploy security information and event management (SIEM) with basic log collection'
                },
                'Medium': {
                    'recommendation': 'Enhance monitoring coverage and detection capabilities',
                    'action': 'Expand monitoring to all critical systems and implement advanced threat detection'
                },
                'High': {
                    'recommendation': 'Implement comprehensive threat detection and response',
                    'action': 'Deploy advanced threat detection with automated response and threat hunting capabilities'
                }
            }
        },
        RESPOND: {
            'Incident Response': {
                'Low': {
                    'recommendation': 'Establish incident response capabilities',
                    'action': 'Develop incident response plan and establish incident response team with training'
                },
                'Medium': {
                    'recommendation': 'Enhance incident response processes and testing',
                    'action': 'Implement automated incident response workflows and conduct regular testing'
                },
                'High': {
                    'recommendation': 'Implement advanced incident response and coordination',
                    'action': 'Deploy advanced incident response with threat intelligence integration and coordination'
                }
            }
        },
        RECOVER: {
            'Recovery Planning': {
                'Low': {
                    'recommendation': 'Establish basic backup and recovery procedures',
                    'action': 'Implement regular backup procedures and basic recovery testing'
                },
                'Medium': {
                    'recommendation': 'Enhance backup and recovery capabilities',
                    'action': 'Implement automated backup systems and comprehensive recovery testing'
                },
                'High': {
                    'recommendation': 'Implement advanced recovery and business continuity',
                    'action': 'Deploy advanced recovery systems with automated failover and business continuity planning'
                }
            }
        }
    };
    
    const categoryRecs = recommendations[category] || {};
    const subcategoryRecs = categoryRecs[response.subcategory] || categoryRecs['Default'] || {};
    const priorityRecs = subcategoryRecs[priority] || subcategoryRecs['Default'];
    
    if (priorityRecs) {
        return {
            category: category,
            subcategory: response.subcategory || 'General',
            priority: priority,
            recommendation: priorityRecs.recommendation,
            action: priorityRecs.action
        };
    }
    
    return null;
}

/**
 * Calculate compliance scores
 */
function calculateComplianceScores(categoryScores) {
    const nistScore = calculateOverallScore(categoryScores);
    const isoScore = Math.round((nistScore * 0.8) + (Math.random() * 10)); // ISO score typically slightly different
    
    const gaps = [];
    Object.keys(categoryScores).forEach(category => {
        if (categoryScores[category] < 70) {
            gaps.push(`${category}: Score ${categoryScores[category]}% - Below compliance threshold`);
        }
    });
    
    return {
        nistScore,
        isoScore,
        gaps
    };
}

/**
 * Calculate ISO 27001 control scores based on NIST categories
 */
function calculateISO27001Scores(categoryScores) {
    return {
        'A.9 Access Control': Math.round((categoryScores.PROTECT * 0.7) + (categoryScores.IDENTIFY * 0.3)),
        'A.10 Cryptography': Math.round(categoryScores.PROTECT * 0.8),
        'A.12 Operations Security': Math.round((categoryScores.PROTECT * 0.5) + (categoryScores.DETECT * 0.5)),
        'A.13 Communications Security': Math.round((categoryScores.PROTECT * 0.6) + (categoryScores.DETECT * 0.4)),
        'A.14 System Acquisition': Math.round(categoryScores.IDENTIFY * 0.7),
        'A.16 Information Security Incident Management': Math.round((categoryScores.RESPOND * 0.8) + (categoryScores.DETECT * 0.2)),
        'A.17 Information Security Aspects of Business Continuity': Math.round((categoryScores.RECOVER * 0.7) + (categoryScores.IDENTIFY * 0.3))
    };
}

/**
 * Store assessment in database
 */
function storeAssessment(assessmentData) {
    try {
        const { organizationName, industrySector, overallScore, riskLevel } = assessmentData;
        
        const stmt = db.prepare(`
            INSERT INTO assessments (organization_name, industry_sector, risk_score, risk_level, created_at)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const info = stmt.run(
            organizationName,
            industrySector,
            overallScore,
            riskLevel,
            new Date().toISOString()
        );
        
        const assessmentId = info.lastInsertRowid;
        
        // Store category scores
        const categoryStmt = db.prepare(`
            INSERT INTO category_scores (assessment_id, category, score, created_at)
            VALUES (?, ?, ?, ?)
        `);
        
        Object.keys(assessmentData.categoryScores).forEach(category => {
            categoryStmt.run(
                assessmentId,
                category,
                assessmentData.categoryScores[category],
                new Date().toISOString()
            );
        });
        
        return assessmentId;
    } catch (error) {
        throw new Error(`Failed to store assessment: ${error.message}`);
    }
}

module.exports = {
    calculateRiskScore
};