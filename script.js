// Cyber Risk Assessment Tool - Simplified JavaScript
// Single-page application with Bootstrap integration

// DOM Elements
const form = document.getElementById('risk-assessment-form');
const resultsSection = document.getElementById('results');
const finalScore = document.getElementById('final-score');
const riskLevel = document.getElementById('risk-level');
const riskChart = document.getElementById('risk-chart');
const categoryList = document.getElementById('category-list');
const recommendationsList = document.getElementById('recommendations-list');
const resetFormBtn = document.getElementById('reset-form');


// Chart Instance
let riskChartInstance;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Initialize Chart.js
    initializeChart();
}

function setupEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Reset form
    resetFormBtn.addEventListener('click', resetForm);
    
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Risk Calculation
function calculateRiskScore(formData) {
    let totalScore = 0;
    let categoryScores = {};
    let maxPossibleScore = 0;
    
    // Define categories and their questions
    const categories = {
        'Authentication': ['mfa', 'password-policy'],
        'Network Security': ['firewall', 'segmentation'],
        'Endpoint Security': ['endpoint-protection', 'encryption'],
        'Data Protection': ['backup', 'classification'],
        'Incident Response': ['monitoring', 'training']
    };
    
    // Calculate scores for each category
    Object.keys(categories).forEach(category => {
        let categoryScore = 0;
        let categoryMax = 0;
        
        categories[category].forEach(question => {
            const value = parseInt(formData.get(question)) || 0;
            categoryScore += value;
            categoryMax += 4; // Max score per question is 4
        });
        
        // Convert to percentage (0-100)
        const percentage = Math.round((categoryScore / categoryMax) * 100);
        categoryScores[category] = percentage;
        totalScore += percentage;
        maxPossibleScore += 100;
    });
    
    // Calculate overall score
    const overallScore = Math.round(totalScore / Object.keys(categories).length);
    
    // Determine risk level
    let riskInfo = {};
    if (overallScore <= 25) {
        riskInfo = { level: 'Low Risk', class: 'bg-success', color: '#198754' };
    } else if (overallScore <= 50) {
        riskInfo = { level: 'Medium Risk', class: 'bg-warning', color: '#ffc107' };
    } else if (overallScore <= 75) {
        riskInfo = { level: 'High Risk', class: 'bg-danger', color: '#dc3545' };
    } else {
        riskInfo = { level: 'Critical Risk', class: 'bg-dark', color: '#212529' };
    }
    
    return {
        overallScore,
        categoryScores,
        riskInfo,
        organization: {
            name: formData.get('org-name') || 'Organization',
            sector: formData.get('industry-sector') || 'Unknown'
        }
    };
}

// Generate Recommendations
function generateRecommendations(data) {
    const recommendations = [];
    
    // Industry-specific recommendations
    if (data.organization.sector === 'healthcare') {
        recommendations.push({
            priority: 'High',
            title: 'HIPAA Compliance Review',
            description: 'Ensure all patient data is encrypted and access is properly controlled according to HIPAA regulations.'
        });
    }
    
    if (data.organization.sector === 'finance') {
        recommendations.push({
            priority: 'High',
            title: 'Financial Data Protection',
            description: 'Implement advanced encryption and monitoring for all financial transactions and sensitive data.'
        });
    }
    
    // Category-specific recommendations
    Object.keys(data.categoryScores).forEach(category => {
        const score = data.categoryScores[category];
        
        if (score <= 40) {
            recommendations.push({
                priority: 'High',
                title: `Improve ${category}`,
                description: `Your ${category.toLowerCase()} score is ${score}%. Consider implementing stronger controls in this area.`
            });
        } else if (score <= 70) {
            recommendations.push({
                priority: 'Medium',
                title: `Enhance ${category}`,
                description: `Your ${category.toLowerCase()} score is ${score}%. Good foundation, but room for improvement.`
            });
        }
    });
    
    // General recommendations
    if (data.overallScore > 50) {
        recommendations.push({
            priority: 'High',
            title: 'Comprehensive Security Assessment',
            description: 'Schedule a professional security audit to identify and address critical vulnerabilities.'
        });
    }
    
    recommendations.push({
        priority: 'Medium',
        title: 'Regular Security Training',
        description: 'Implement ongoing security awareness training for all employees.'
    });
    
    recommendations.push({
        priority: 'Low',
        title: 'Security Policy Review',
        description: 'Review and update security policies to reflect current threats and best practices.'
    });
    
    return recommendations.slice(0, 6); // Limit to 6 recommendations
}

// Display Results
function displayResults(data) {
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Update overall score
    finalScore.textContent = `${data.overallScore}%`;
    
    // Update risk level
    riskLevel.textContent = data.riskInfo.level;
    riskLevel.className = `badge ${data.riskInfo.class} fs-6`;
    
    // Update chart
    updateChart(data.categoryScores);
    
    // Update category list
    updateCategoryList(data.categoryScores);
    
    // Update recommendations
    updateRecommendations(generateRecommendations(data));
}

// Chart Management
function initializeChart() {
    const ctx = riskChart.getContext('2d');
    riskChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Risk Score',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateChart(categoryScores) {
    riskChartInstance.data.labels = Object.keys(categoryScores);
    riskChartInstance.data.datasets[0].data = Object.values(categoryScores);
    riskChartInstance.update();
}

// Update Lists
function updateCategoryList(categoryScores) {
    categoryList.innerHTML = '';
    
    Object.keys(categoryScores).forEach(category => {
        const score = categoryScores[category];
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Determine badge class based on score
        let badgeClass = 'bg-success';
        if (score > 70) badgeClass = 'bg-danger';
        else if (score > 50) badgeClass = 'bg-warning';
        else if (score > 30) badgeClass = 'bg-info';
        
        listItem.innerHTML = `
            <span>${category}</span>
            <span class="badge ${badgeClass} rounded-pill">${score}%</span>
        `;
        categoryList.appendChild(listItem);
    });
}

function updateRecommendations(recommendations) {
    recommendationsList.innerHTML = '';
    
    recommendations.forEach(rec => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        
        let priorityClass = 'bg-secondary';
        if (rec.priority === 'High') priorityClass = 'bg-danger';
        else if (rec.priority === 'Medium') priorityClass = 'bg-warning';
        else if (rec.priority === 'Low') priorityClass = 'bg-success';
        
        listItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${rec.title}</h6>
                <span class="badge ${priorityClass}">${rec.priority}</span>
            </div>
            <p class="mb-1">${rec.description}</p>
        `;
        recommendationsList.appendChild(listItem);
    });
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Debug: Log form data
    const formData = new FormData(form);
    console.log('Form Data:', Object.fromEntries(formData));
    
    const requiredFields = ['org-name', 'industry-sector', 'mfa', 'password-policy', 'firewall', 'segmentation', 'endpoint-protection', 'encryption', 'backup', 'classification', 'monitoring', 'training'];
    
    let isValid = true;
    
    // Clear previous validation errors
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        element.classList.remove('is-invalid');
    });
    
    // Check each field
    requiredFields.forEach(field => {
        const value = formData.get(field);
        console.log(`Field ${field}:`, value, 'Type:', typeof value);
        
        if (!value || value.trim() === '' || value === '0') {
            console.log(`Field ${field} is invalid:`, value);
            isValid = false;
            const element = document.getElementById(field);
            element.classList.add('is-invalid');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Calculate and display results
    const data = calculateRiskScore(formData);
    displayResults(data);
    
    // Store data for report generation
    window.currentAssessmentData = data;
}

function resetForm() {
    form.reset();
    resultsSection.style.display = 'none';
    
    // Clear chart
    if (riskChartInstance) {
        riskChartInstance.data.labels = [];
        riskChartInstance.data.datasets[0].data = [];
        riskChartInstance.update();
    }
    
    // Clear lists
    categoryList.innerHTML = '';
    recommendationsList.innerHTML = '';
    
    // Reset form validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });
}

// PDF Report Generation
function generateExecutiveReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    const data = window.currentAssessmentData;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Page 1: Cover
    doc.setFillColor(13, 110, 253);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Cyber Risk Assessment Report', 20, 30);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Organization: ${data.organization.name}`, 20, 60);
    doc.text(`Industry: ${data.organization.sector}`, 20, 70);
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, 80);
    doc.text(`Overall Risk Score: ${data.overallScore}%`, 20, 90);
    doc.text(`Risk Level: ${data.riskInfo.level}`, 20, 100);
    
    // Page 2: Executive Summary
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Executive Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('This report provides a high-level overview of your organization\'s cybersecurity', 20, 35);
    doc.text('posture based on our comprehensive assessment.', 20, 45);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Key Findings:', 20, 60);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 70;
    Object.keys(data.categoryScores).forEach(category => {
        const score = data.categoryScores[category];
        doc.text(`• ${category}: ${score}% risk`, 30, yPos);
        yPos += 10;
    });
    
    // Page 3: Recommendations
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Priority Recommendations', 20, 20);
    
    const recommendations = generateRecommendations(data);
    yPos = 35;
    recommendations.forEach(rec => {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`${rec.priority}: ${rec.title}`, 20, yPos);
        yPos += 10;
        
        doc.setFont(undefined, 'normal');
        doc.text(rec.description, 30, yPos);
        yPos += 15;
    });
    
    // Save PDF
    doc.save(`executive-summary-${data.organization.name.replace(/\s+/g, '-')}.pdf`);
}

function generateTechnicalReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    const data = window.currentAssessmentData;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cover Page
    doc.setFillColor(25, 135, 84);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Security Analysis', 20, 30);
    
    // Technical Details
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Assessment Results', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 35;
    
    Object.keys(data.categoryScores).forEach(category => {
        const score = data.categoryScores[category];
        doc.text(`${category}:`, 20, yPos);
        yPos += 10;
        doc.text(`  Risk Score: ${score}%`, 30, yPos);
        yPos += 10;
        
        // Add technical details based on score
        if (score <= 25) {
            doc.text(`  Status: Excellent - Strong security controls in place`, 30, yPos);
        } else if (score <= 50) {
            doc.text(`  Status: Good - Minor improvements needed`, 30, yPos);
        } else if (score <= 75) {
            doc.text(`  Status: Moderate - Significant security gaps identified`, 30, yPos);
        } else {
            doc.text(`  Status: Poor - Critical security vulnerabilities present`, 30, yPos);
        }
        yPos += 15;
    });
    
    doc.save(`technical-analysis-${data.organization.name.replace(/\s+/g, '-')}.pdf`);
}

function generateComplianceReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    const data = window.currentAssessmentData;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cover Page
    doc.setFillColor(220, 53, 69);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Compliance Assessment Report', 20, 30);
    
    // Compliance Analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Regulatory Compliance Status', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 35;
    
    // Industry-specific compliance
    if (data.organization.sector === 'healthcare') {
        doc.text('HIPAA Compliance:', 20, yPos);
        yPos += 10;
        doc.text('  - Data Encryption: ' + (data.categoryScores['Data Protection'] > 60 ? 'Compliant' : 'Non-Compliant'), 30, yPos);
        yPos += 10;
        doc.text('  - Access Controls: ' + (data.categoryScores['Authentication'] > 60 ? 'Compliant' : 'Non-Compliant'), 30, yPos);
        yPos += 15;
    }
    
    if (data.organization.sector === 'finance') {
        doc.text('Financial Regulations:', 20, yPos);
        yPos += 10;
        doc.text('  - Data Protection: ' + (data.categoryScores['Data Protection'] > 70 ? 'Compliant' : 'Non-Compliant'), 30, yPos);
        yPos += 10;
        doc.text('  - Network Security: ' + (data.categoryScores['Network Security'] > 70 ? 'Compliant' : 'Non-Compliant'), 30, yPos);
        yPos += 15;
    }
    
    // General compliance
    doc.text('General Security Standards:', 20, yPos);
    yPos += 10;
    doc.text('  - Risk Management: ' + (data.overallScore < 50 ? 'Adequate' : 'Needs Improvement'), 30, yPos);
    yPos += 10;
    doc.text('  - Incident Response: ' + (data.categoryScores['Incident Response'] > 50 ? 'Good' : 'Poor'), 30, yPos);
    
    doc.save(`compliance-report-${data.organization.name.replace(/\s+/g, '-')}.pdf`);
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.type === 'submit') {
        e.preventDefault();
        if (e.target.closest('form') === form) {
            handleFormSubmit(e);
        }
    }
});

// Export functions for global access
window.generateExecutiveReport = generateExecutiveReport;
window.generateTechnicalReport = generateTechnicalReport;
window.generateComplianceReport = generateComplianceReport;