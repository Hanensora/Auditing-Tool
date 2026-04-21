// Cyber Risk Assessment Tool - Optimized JavaScript
// Single-page application with Bootstrap integration and backend connectivity

// DOM Elements
const form = document.getElementById('risk-assessment-form');
const resultsSection = document.getElementById('results');
const finalScore = document.getElementById('final-score');
const riskLevel = document.getElementById('risk-level');
const riskChart = document.getElementById('risk-chart');
const categoryList = document.getElementById('category-list');
const recommendationsList = document.getElementById('recommendations-list');
const resetFormBtn = document.getElementById('reset-form');

// Report Buttons
const generateExecutiveBtn = document.getElementById('generate-executive');
const generateTechnicalBtn = document.getElementById('generate-technical');
const generateComplianceBtn = document.getElementById('generate-compliance');

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
    
    // Load dropdown options from backend
    loadDropdownOptions();
}

function setupEventListeners() {
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Reset form
    resetFormBtn.addEventListener('click', resetForm);
    
    // Report generation
    generateExecutiveBtn.addEventListener('click', generateExecutiveReport);
    generateTechnicalBtn.addEventListener('click', generateTechnicalReport);
    generateComplianceBtn.addEventListener('click', generateComplianceReport);
    
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

// Load dropdown options from backend
async function loadDropdownOptions() {
    try {
        // Load industries
        const industriesResponse = await fetch('http://localhost:3001/api/dropdowns/industries');
        const industriesResult = await industriesResponse.json();
        if (industriesResult.success) {
            populateDropdown('industry-sector', industriesResult.industries, 'value', 'label');
        }
        
        // Load MFA options
        const mfaResponse = await fetch('http://localhost:3001/api/dropdowns/mfa-options');
        const mfaResult = await mfaResponse.json();
        if (mfaResult.success) {
            populateDropdown('mfa', mfaResult.mfaOptions, 'value', 'label');
        }
        
        // Load password policy options
        const passwordResponse = await fetch('http://localhost:3001/api/dropdowns/password-policies');
        const passwordResult = await passwordResponse.json();
        if (passwordResult.success) {
            populateDropdown('password-policy', passwordResult.passwordPolicies, 'value', 'label');
        }
        
        // Load firewall options
        const firewallResponse = await fetch('http://localhost:3001/api/dropdowns/firewall-options');
        const firewallResult = await firewallResponse.json();
        if (firewallResult.success) {
            populateDropdown('firewall', firewallResult.firewallOptions, 'value', 'label');
        }
        
        // Load segmentation options
        const segmentationResponse = await fetch('http://localhost:3001/api/dropdowns/segmentation-options');
        const segmentationResult = await segmentationResponse.json();
        if (segmentationResult.success) {
            populateDropdown('segmentation', segmentationResult.segmentationOptions, 'value', 'label');
        }
        
        // Load endpoint protection options
        const endpointResponse = await fetch('http://localhost:3001/api/dropdowns/endpoint-options');
        const endpointResult = await endpointResponse.json();
        if (endpointResult.success) {
            populateDropdown('endpoint-protection', endpointResult.endpointOptions, 'value', 'label');
        }
        
        // Load encryption options
        const encryptionResponse = await fetch('http://localhost:3001/api/dropdowns/encryption-options');
        const encryptionResult = await encryptionResponse.json();
        if (encryptionResult.success) {
            populateDropdown('encryption', encryptionResult.encryptionOptions, 'value', 'label');
        }
        
        // Load backup options
        const backupResponse = await fetch('http://localhost:3001/api/dropdowns/backup-options');
        const backupResult = await backupResponse.json();
        if (backupResult.success) {
            populateDropdown('backup', backupResult.backupOptions, 'value', 'label');
        }
        
        // Load classification options
        const classificationResponse = await fetch('http://localhost:3001/api/dropdowns/classification-options');
        const classificationResult = await classificationResponse.json();
        if (classificationResult.success) {
            populateDropdown('classification', classificationResult.classificationOptions, 'value', 'label');
        }
        
        // Load monitoring options
        const monitoringResponse = await fetch('http://localhost:3001/api/dropdowns/monitoring-options');
        const monitoringResult = await monitoringResponse.json();
        if (monitoringResult.success) {
            populateDropdown('monitoring', monitoringResult.monitoringOptions, 'value', 'label');
        }
        
        // Load training options
        const trainingResponse = await fetch('http://localhost:3001/api/dropdowns/training-options');
        const trainingResult = await trainingResponse.json();
        if (trainingResult.success) {
            populateDropdown('training', trainingResult.trainingOptions, 'value', 'label');
        }
        
    } catch (error) {
        console.log('Backend not available, using static options');
        populateStaticDropdowns();
    }
}

function populateDropdown(elementId, options, valueKey, labelKey) {
    const select = document.getElementById(elementId);
    if (!select) return;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Option';
    select.appendChild(defaultOption);
    
    // Add options from backend
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option[valueKey];
        optionElement.textContent = option[labelKey];
        select.appendChild(optionElement);
    });
}

function populateStaticDropdowns() {
    // If backend is not available, show error message instead of static data
    alert('Backend service is not available. Please ensure the server is running on http://localhost:3001');
    
    // Disable form submission if backend is not available
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Server Required - Please Start Backend';
    }
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
                    'rgba(255, 99, 132, 0.8)',  // IDENTIFY
                    'rgba(54, 162, 235, 0.8)',  // PROTECT
                    'rgba(255, 205, 86, 0.8)',  // DETECT
                    'rgba(75, 192, 192, 0.8)',  // RESPOND
                    'rgba(153, 102, 255, 0.8)'  // RECOVER
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
    // Map NIST framework categories to display names
    const categoryDisplayNames = {
        'IDENTIFY': 'Identify (Asset Management)',
        'PROTECT': 'Protect (Access Control)',
        'DETECT': 'Detect (Monitoring)',
        'RESPOND': 'Respond (Incident Response)',
        'RECOVER': 'Recover (Backup & Recovery)'
    };
    
    const labels = Object.keys(categoryScores).map(key => categoryDisplayNames[key] || key);
    const data = Object.values(categoryScores);
    
    riskChartInstance.data.labels = labels;
    riskChartInstance.data.datasets[0].data = data;
    riskChartInstance.update();
}

// Update Lists
function updateCategoryList(categoryScores) {
    categoryList.innerHTML = '';
    
    // Map NIST framework categories to display names
    const categoryDisplayNames = {
        'IDENTIFY': 'Identify (Asset Management)',
        'PROTECT': 'Protect (Access Control)',
        'DETECT': 'Detect (Monitoring)',
        'RESPOND': 'Respond (Incident Response)',
        'RECOVER': 'Recover (Backup & Recovery)'
    };
    
    Object.keys(categoryScores).forEach(category => {
        const score = categoryScores[category];
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Determine badge class based on score
        let badgeClass = 'bg-success';
        if (score > 70) badgeClass = 'bg-danger';
        else if (score > 50) badgeClass = 'bg-warning';
        else if (score > 30) badgeClass = 'bg-info';
        
        const displayName = categoryDisplayNames[category] || category;
        
        listItem.innerHTML = `
            <span><strong>${displayName}</strong></span>
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
        
        // Handle different recommendation formats (backend vs frontend)
        const categoryText = rec.category || rec.control || rec.title || '';
        const recommendationText = rec.recommendation || rec.title || rec.description || '';
        const actionText = rec.action || '';
        
        listItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${categoryText ? categoryText + ': ' : ''}${recommendationText}</h6>
                <span class="badge ${priorityClass}">${rec.priority}</span>
            </div>
            ${actionText ? `<p class="mb-1 mt-2"><strong>Action:</strong> ${actionText}</p>` : ''}
        `;
        recommendationsList.appendChild(listItem);
    });
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    
    const requiredFields = ['org-name', 'industry-sector', 'mfa', 'password-policy', 'firewall', 'segmentation', 'endpoint-protection', 'encryption', 'backup', 'classification', 'monitoring', 'training'];
    
    let isValid = true;
    
    // Clear previous validation errors
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.classList.remove('is-invalid');
        }
    });
    
    // Check each field
    requiredFields.forEach(field => {
        const value = formData.get(field);
        if (!value || value.trim() === '' || value === '0') {
            isValid = false;
            const element = document.getElementById(field);
            if (element) {
                element.classList.add('is-invalid');
            }
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
async function generateExecutiveReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    try {
        // Show loading state
        const btn = document.getElementById('generate-executive');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
        }
        
        const data = window.currentAssessmentData;
        
        // Try to generate report via backend first
        const response = await fetch('http://localhost:3001/api/reports/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assessmentId: data.assessmentId || Date.now(),
                reportType: 'executive',
                assessmentData: data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Download the generated report
            const downloadResponse = await fetch(`http://localhost:3001/api/reports/download/${result.data.filename}`);
            const blob = await downloadResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.data.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            alert(`Executive report downloaded successfully: ${result.data.filename}`);
        } else {
            throw new Error(result.error || 'Backend report generation failed');
        }
        
    } catch (error) {
        console.error('Error generating executive report:', error);
        // alert('Error generating report via backend. Falling back to local generation.');
        
        // Fallback to local PDF generation
        generateExecutiveReportLocal();
        
    } finally {
        // Restore button state
        const btn = document.getElementById('generate-executive');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF';
        }
    }
}

// Local executive report generation (fallback)
function generateExecutiveReportLocal() {
    const data = window.currentAssessmentData;
    
    // Initialize jsPDF properly
    let doc;
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        doc = new window.jspdf.jsPDF();
    } else if (typeof jsPDF !== 'undefined') {
        doc = new jsPDF();
    } else {
        alert('PDF generation library not available. Please ensure jsPDF is loaded correctly.');
        return;
    }
    
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
    doc.text('posture based on our comprehensive assessment conducted across five critical security', 20, 45);
    doc.text('domains. The assessment evaluates your current security controls, identifies potential', 20, 55);
    doc.text('vulnerabilities, and provides actionable recommendations for improvement.', 20, 65);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Risk Assessment Overview:', 20, 80);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 90;
    Object.keys(data.categoryScores).forEach(category => {
        const score = data.categoryScores[category];
        let riskLevel = '';
        if (score <= 25) riskLevel = 'Low';
        else if (score <= 50) riskLevel = 'Medium';
        else if (score <= 75) riskLevel = 'High';
        else riskLevel = 'Critical';
        
        doc.text(`• ${category}: ${score}% risk (${riskLevel} Risk Level)`, 30, yPos);
        yPos += 10;
    });
    
    // Page 3: Business Impact Analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Business Impact Analysis', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Based on your overall risk score of ' + data.overallScore + '%, your organization faces the', 20, 35);
    doc.text('following potential business impacts:', 20, 45);
    
    yPos = 55;
    if (data.overallScore > 50) {
        doc.text('• High probability of security incidents in the next 12-24 months', 30, yPos);
        yPos += 10;
        doc.text('• Potential financial losses ranging from $50,000 to $500,000', 30, yPos);
        yPos += 10;
        doc.text('• Regulatory compliance violations and associated fines', 30, yPos);
        yPos += 10;
        doc.text('• Reputational damage affecting customer trust and business relationships', 30, yPos);
        yPos += 10;
        doc.text('• Operational disruption from potential ransomware or data breach events', 30, yPos);
    } else {
        doc.text('• Moderate security posture with room for improvement', 30, yPos);
        yPos += 10;
        doc.text('• Some vulnerabilities that could be exploited by determined attackers', 30, yPos);
        yPos += 10;
        doc.text('• Opportunity to strengthen security before potential incidents occur', 30, yPos);
        yPos += 10;
        doc.text('• Compliance requirements may not be fully met in all areas', 30, yPos);
    }
    
    // Page 4: Strategic Recommendations
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Strategic Recommendations', 20, 20);
    
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
        
        // Add implementation timeline
        if (rec.priority === 'High') {
            doc.text('Implementation Timeline: 30-60 days', 40, yPos);
            yPos += 10;
        } else if (rec.priority === 'Medium') {
            doc.text('Implementation Timeline: 60-120 days', 40, yPos);
            yPos += 10;
        } else {
            doc.text('Implementation Timeline: 120-180 days', 40, yPos);
            yPos += 10;
        }
        yPos += 5;
    });
    
    // Page 5: Investment Requirements
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Investment Requirements', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('To address the identified security gaps, the following investments are recommended:', 20, 35);
    
    yPos = 45;
    doc.text('• Security Infrastructure: $15,000 - $50,000', 30, yPos);
    yPos += 10;
    doc.text('• Security Training and Awareness: $5,000 - $15,000', 30, yPos);
    yPos += 10;
    doc.text('• Compliance and Audit Services: $10,000 - $25,000', 30, yPos);
    yPos += 10;
    doc.text('• Technology Upgrades: $20,000 - $100,000', 30, yPos);
    yPos += 15;
    
    doc.text('Return on Investment:', 20, yPos);
    yPos += 10;
    doc.text('• Reduced risk of data breaches and associated costs', 30, yPos);
    yPos += 10;
    doc.text('• Improved regulatory compliance and reduced fines', 30, yPos);
    yPos += 10;
    doc.text('• Enhanced customer trust and business reputation', 30, yPos);
    yPos += 10;
    doc.text('• Operational efficiency through better security controls', 30, yPos);
    
    // Save PDF
    doc.save(`executive-summary-${data.organization.name.replace(/\s+/g, '-')}.pdf`);
}

async function generateTechnicalReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    try {
        // Show loading state
        const btn = document.getElementById('generate-technical');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
        }
        
        const data = window.currentAssessmentData;
        
        // Try to generate report via backend first
        const response = await fetch('http://localhost:3001/api/reports/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assessmentId: data.assessmentId || Date.now(),
                reportType: 'technical',
                assessmentData: data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Download the generated report
            const downloadResponse = await fetch(`http://localhost:3001/api/reports/download/${result.data.filename}`);
            const blob = await downloadResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.data.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            alert(`Technical report downloaded successfully: ${result.data.filename}`);
        } else {
            throw new Error(result.error || 'Backend report generation failed');
        }
        
    } catch (error) {
        console.error('Error generating technical report:', error);
        // alert('Error generating report via backend. Falling back to local generation.');
        
        // Fallback to local PDF generation
        generateTechnicalReportLocal();
        
    } finally {
        // Restore button state
        const btn = document.getElementById('generate-technical');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF';
        }
    }
}

// Local technical report generation (fallback)
function generateTechnicalReportLocal() {
    const data = window.currentAssessmentData;
    
    // Initialize jsPDF properly
    let doc;
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        doc = new window.jspdf.jsPDF();
    } else if (typeof jsPDF !== 'undefined') {
        doc = new jsPDF();
    } else {
        alert('PDF generation library not available. Please ensure jsPDF is loaded correctly.');
        return;
    }
    
    // Cover Page
    doc.setFillColor(25, 135, 84);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Security Analysis', 20, 30);
    
    // Page 2: Executive Summary
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Assessment Executive Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Organization: ${data.organization.name}`, 20, 35);
    doc.text(`Industry Sector: ${data.organization.sector}`, 20, 45);
    doc.text(`Overall Risk Score: ${data.overallScore}% (${data.riskInfo.level})`, 20, 55);
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, 65);
    
    // Page 3: Detailed Category Analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Detailed Security Category Analysis', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 35;
    
    Object.keys(data.categoryScores).forEach(category => {
        const score = data.categoryScores[category];
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`${category} Security`, 20, yPos);
        yPos += 12;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Risk Score: ${score}%`, 20, yPos);
        yPos += 10;
        
        // Detailed analysis for each category
        if (category === 'Authentication') {
            doc.text('Authentication Controls Assessment:', 30, yPos);
            yPos += 10;
            if (score <= 25) {
                doc.text('• Multi-factor authentication implemented across all systems', 40, yPos);
                yPos += 10;
                doc.text('• Strong password policies with complexity requirements', 40, yPos);
                yPos += 10;
                doc.text('• Regular password rotation and account monitoring', 40, yPos);
                yPos += 10;
                doc.text('• Privileged access management controls in place', 40, yPos);
            } else if (score <= 50) {
                doc.text('• Basic MFA implementation on critical systems only', 40, yPos);
                yPos += 10;
                doc.text('• Password policies need strengthening', 40, yPos);
                yPos += 10;
                doc.text('• Some accounts lack proper access controls', 40, yPos);
                yPos += 10;
                doc.text('• Limited monitoring of authentication events', 40, yPos);
            } else {
                doc.text('• No multi-factor authentication implemented', 40, yPos);
                yPos += 10;
                doc.text('• Weak password policies or enforcement', 40, yPos);
                yPos += 10;
                doc.text('• Excessive privileges on user accounts', 40, yPos);
                yPos += 10;
                doc.text('• No centralized authentication monitoring', 40, yPos);
            }
        } else if (category === 'Network Security') {
            doc.text('Network Security Assessment:', 30, yPos);
            yPos += 10;
            if (score <= 25) {
                doc.text('• Next-generation firewall with advanced threat detection', 40, yPos);
                yPos += 10;
                doc.text('• Comprehensive network segmentation implemented', 40, yPos);
                yPos += 10;
                doc.text('• Intrusion detection and prevention systems active', 40, yPos);
                yPos += 10;
                doc.text('• Regular network security monitoring and logging', 40, yPos);
            } else if (score <= 50) {
                doc.text('• Traditional firewall with basic rules', 40, yPos);
                yPos += 10;
                doc.text('• Limited network segmentation', 40, yPos);
                yPos += 10;
                doc.text('• Basic intrusion detection capabilities', 40, yPos);
                yPos += 10;
                doc.text('• Periodic network monitoring', 40, yPos);
            } else {
                doc.text('• No firewall or outdated firewall rules', 40, yPos);
                yPos += 10;
                doc.text('• No network segmentation', 40, yPos);
                yPos += 10;
                doc.text('• No intrusion detection systems', 40, yPos);
                yPos += 10;
                doc.text('• Limited network monitoring capabilities', 40, yPos);
            }
        } else if (category === 'Endpoint Security') {
            doc.text('Endpoint Protection Assessment:', 30, yPos);
            yPos += 10;
            if (score <= 25) {
                doc.text('• Advanced endpoint detection and response (EDR) deployed', 40, yPos);
                yPos += 10;
                doc.text('• Full disk encryption on all devices', 40, yPos);
                yPos += 10;
                doc.text('• Application whitelisting and control mechanisms', 40, yPos);
                yPos += 10;
                doc.text('• Regular endpoint security patching and updates', 40, yPos);
            } else if (score <= 50) {
                doc.text('• Standard antivirus/anti-malware solutions', 40, yPos);
                yPos += 10;
                doc.text('• Partial device encryption implementation', 40, yPos);
                yPos += 10;
                doc.text('• Basic application control policies', 40, yPos);
                yPos += 10;
                doc.text('• Inconsistent patch management', 40, yPos);
            } else {
                doc.text('• No endpoint protection solutions', 40, yPos);
                yPos += 10;
                doc.text('• No device encryption', 40, yPos);
                yPos += 10;
                doc.text('• Unrestricted application execution', 40, yPos);
                yPos += 10;
                doc.text('• No systematic patch management', 40, yPos);
            }
        } else if (category === 'Data Protection') {
            doc.text('Data Security Assessment:', 30, yPos);
            yPos += 10;
            if (score <= 25) {
                doc.text('• 3-2-1 backup strategy implemented and tested', 40, yPos);
                yPos += 10;
                doc.text('• Automated data classification system', 40, yPos);
                yPos += 10;
                doc.text('• Data loss prevention (DLP) controls active', 40, yPos);
                yPos += 10;
                doc.text('• Encryption of data at rest and in transit', 40, yPos);
            } else if (score <= 50) {
                doc.text('• Basic backup procedures in place', 40, yPos);
                yPos += 10;
                doc.text('• Manual data classification processes', 40, yPos);
                yPos += 10;
                doc.text('• Limited DLP implementation', 40, yPos);
                yPos += 10;
                doc.text('• Partial data encryption coverage', 40, yPos);
            } else {
                doc.text('• No formal backup strategy', 40, yPos);
                yPos += 10;
                doc.text('• No data classification system', 40, yPos);
                yPos += 10;
                doc.text('• No data loss prevention controls', 40, yPos);
                yPos += 10;
                doc.text('• No data encryption implementation', 40, yPos);
            }
        } else if (category === 'Incident Response') {
            doc.text('Security Operations Assessment:', 30, yPos);
            yPos += 10;
            if (score <= 25) {
                doc.text('• 24/7 Security Operations Center (SOC)', 40, yPos);
                yPos += 10;
                doc.text('• Comprehensive security awareness training program', 40, yPos);
                yPos += 10;
                doc.text('• Automated incident response playbooks', 40, yPos);
                yPos += 10;
                doc.text('• Regular security drills and tabletop exercises', 40, yPos);
            } else if (score <= 50) {
                doc.text('• Business hours security monitoring', 40, yPos);
                yPos += 10;
                doc.text('• Annual security training for employees', 40, yPos);
                yPos += 10;
                doc.text('• Basic incident response procedures', 40, yPos);
                yPos += 10;
                doc.text('• Limited security exercise participation', 40, yPos);
            } else {
                doc.text('• No security monitoring capabilities', 40, yPos);
                yPos += 10;
                doc.text('• No security awareness training', 40, yPos);
                yPos += 10;
                doc.text('• No formal incident response plan', 40, yPos);
                yPos += 10;
                doc.text('• No security incident testing or drills', 40, yPos);
            }
        }
        
        yPos += 15;
    });
    
    // Page 4: Vulnerability Analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Vulnerability Analysis and Findings', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    yPos = 35;
    
    doc.text('Critical Vulnerabilities Identified:', 20, yPos);
    yPos += 12;
    
    // Generate specific vulnerabilities based on scores
    if (data.overallScore > 75) {
        doc.text('• Multiple critical security gaps across all categories', 30, yPos);
        yPos += 10;
        doc.text('• High probability of successful cyber attacks', 30, yPos);
        yPos += 10;
        doc.text('• Immediate security improvements required', 30, yPos);
        yPos += 10;
        doc.text('• Comprehensive security assessment recommended', 30, yPos);
        yPos += 15;
    }
    
    if (data.categoryScores['Authentication'] > 60) {
        doc.text('• Authentication vulnerabilities detected', 30, yPos);
        yPos += 10;
        doc.text('• Weak access control mechanisms', 40, yPos);
        yPos += 10;
        doc.text('• Potential for unauthorized system access', 40, yPos);
        yPos += 10;
    }
    
    if (data.categoryScores['Network Security'] > 60) {
        doc.text('• Network security gaps identified', 30, yPos);
        yPos += 10;
        doc.text('• Insufficient network monitoring', 40, yPos);
        yPos += 10;
        doc.text('• Potential for network-based attacks', 40, yPos);
        yPos += 10;
    }
    
    if (data.categoryScores['Endpoint Security'] > 60) {
        doc.text('• Endpoint protection deficiencies', 30, yPos);
        yPos += 10;
        doc.text('• Unprotected devices on network', 40, yPos);
        yPos += 10;
        doc.text('• Malware infection risks', 40, yPos);
        yPos += 10;
    }
    
    // Page 5: Technical Recommendations
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Technical Security Recommendations', 20, 20);
    
    yPos = 35;
    doc.text('Priority 1 - Critical Security Improvements:', 20, yPos);
    yPos += 12;
    
    if (data.overallScore > 50) {
        doc.text('1. Implement Multi-Factor Authentication (MFA)', 30, yPos);
        yPos += 10;
        doc.text('   - Deploy MFA across all critical systems and applications', 40, yPos);
        yPos += 10;
        doc.text('   - Use hardware tokens or authenticator apps', 40, yPos);
        yPos += 10;
        doc.text('   - Enforce MFA for all administrative accounts', 40, yPos);
        yPos += 15;
        
        doc.text('2. Deploy Advanced Endpoint Protection', 30, yPos);
        yPos += 10;
        doc.text('   - Install EDR solutions on all endpoints', 40, yPos);
        yPos += 10;
        doc.text('   - Enable real-time threat detection', 40, yPos);
        yPos += 10;
        doc.text('   - Implement application whitelisting', 40, yPos);
        yPos += 15;
    }
    
    doc.text('Priority 2 - Network Security Enhancements:', 20, yPos);
    yPos += 12;
    
    doc.text('3. Upgrade Network Security Infrastructure', 30, yPos);
    yPos += 10;
    doc.text('   - Deploy next-generation firewalls', 40, yPos);
    yPos += 10;
    doc.text('   - Implement network segmentation', 40, yPos);
    yPos += 10;
    doc.text('   - Enable intrusion detection systems', 40, yPos);
    yPos += 15;
    
    doc.text('4. Data Protection and Backup Strategy', 30, yPos);
    yPos += 10;
    doc.text('   - Implement 3-2-1 backup strategy', 40, yPos);
    yPos += 10;
    doc.text('   - Deploy data encryption solutions', 40, yPos);
    yPos += 10;
    doc.text('   - Establish data classification policies', 40, yPos);
    
    // Save PDF
    doc.save(`technical-analysis-${data.organization.name.replace(/\s+/g, '-')}.pdf`);
}

async function generateComplianceReport() {
    if (!window.currentAssessmentData) {
        alert('Please complete the assessment first.');
        return;
    }
    
    try {
        // Show loading state
        const btn = document.getElementById('generate-compliance');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
        }
        
        const data = window.currentAssessmentData;
        
        // Try to generate report via backend first
        const response = await fetch('http://localhost:3001/api/reports/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assessmentId: data.assessmentId || Date.now(),
                reportType: 'compliance',
                assessmentData: data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Download the generated report
            const downloadResponse = await fetch(`http://localhost:3001/api/reports/download/${result.data.filename}`);
            const blob = await downloadResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.data.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            alert(`Compliance report downloaded successfully: ${result.data.filename}`);
        } else {
            throw new Error(result.error || 'Backend report generation failed');
        }
        
    } catch (error) {
        console.error('Error generating compliance report:', error);
        // alert('Error generating report via backend. Falling back to local generation.');
        
        // Fallback to local PDF generation
        generateComplianceReportLocal();
        
    } finally {
        // Restore button state
        const btn = document.getElementById('generate-compliance');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download me-2"></i>Download PDF';
        }
    }
}

// Local compliance report generation (fallback)
function generateComplianceReportLocal() {
    const data = window.currentAssessmentData;
    
    // Initialize jsPDF properly
    let doc;
    if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        doc = new window.jspdf.jsPDF();
    } else if (typeof jsPDF !== 'undefined') {
        doc = new jsPDF();
    } else {
        alert('PDF generation library not available. Please ensure jsPDF is loaded correctly.');
        return;
    }
    
    // Cover Page
    doc.setFillColor(220, 53, 69);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Compliance Assessment Report', 20, 30);
    
    // Page 2: Compliance Overview
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Compliance Assessment Overview', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Organization: ${data.organization.name}`, 20, 35);
    doc.text(`Industry Sector: ${data.organization.sector}`, 20, 45);
    doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Overall Compliance Score: ${100 - data.overallScore}%`, 20, 65);
    
    // Page 3: Industry-Specific Compliance
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Industry-Specific Regulatory Compliance', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    let yPos = 35;
    
    if (data.organization.sector === 'healthcare') {
        doc.text('HIPAA (Health Insurance Portability and Accountability Act):', 20, yPos);
        yPos += 12;
        
        doc.text('Privacy Rule Compliance:', 30, yPos);
        yPos += 10;
        doc.text('  - Patient data access controls: ' + (data.categoryScores['Authentication'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Minimum necessary standard: ' + (data.categoryScores['Data Protection'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Business associate agreements: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('Security Rule Compliance:', 30, yPos);
        yPos += 10;
        doc.text('  - Administrative safeguards: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Physical safeguards: ' + (data.categoryScores['Endpoint Security'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Technical safeguards: ' + (data.categoryScores['Authentication'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('Breach Notification Rule:', 30, yPos);
        yPos += 10;
        doc.text('  - Incident response procedures: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Breach reporting timelines: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('HITECH Act Compliance:', 30, yPos);
        yPos += 10;
        doc.text('  - Enhanced penalties enforcement: ' + (data.overallScore < 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Business associate liability: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        
    } else if (data.organization.sector === 'finance') {
        doc.text('Financial Industry Regulatory Compliance:', 20, yPos);
        yPos += 12;
        
        doc.text('Gramm-Leach-Bliley Act (GLBA):', 30, yPos);
        yPos += 10;
        doc.text('  - Financial Privacy Rule: ' + (data.categoryScores['Data Protection'] > 70 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Safeguards Rule: ' + (data.categoryScores['Network Security'] > 70 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Pretexting protections: ' + (data.categoryScores['Authentication'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('Payment Card Industry (PCI DSS):', 30, yPos);
        yPos += 10;
        doc.text('  - Cardholder data protection: ' + (data.categoryScores['Data Protection'] > 70 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Network security controls: ' + (data.categoryScores['Network Security'] > 70 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Access control measures: ' + (data.categoryScores['Authentication'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('SOX Compliance (Sarbanes-Oxley):', 30, yPos);
        yPos += 10;
        doc.text('  - Internal controls over financial reporting: ' + (data.overallScore < 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Data integrity and security: ' + (data.categoryScores['Data Protection'] > 70 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Audit trail requirements: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        
    } else {
        doc.text('General Data Protection Regulation (GDPR) - Applicable if handling EU data:', 20, yPos);
        yPos += 12;
        
        doc.text('Data Protection Principles:', 30, yPos);
        yPos += 10;
        doc.text('  - Lawfulness, fairness, and transparency: ' + (data.overallScore < 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Purpose limitation: ' + (data.categoryScores['Data Protection'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Data minimization: ' + (data.categoryScores['Data Protection'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 15;
        
        doc.text('Security Requirements:', 30, yPos);
        yPos += 10;
        doc.text('  - Integrity and confidentiality: ' + (data.categoryScores['Authentication'] > 60 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Accountability principle: ' + (data.overallScore < 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
        yPos += 10;
        doc.text('  - Breach notification: ' + (data.categoryScores['Incident Response'] > 50 ? 'COMPLIANT' : 'NON-COMPLIANT'), 40, yPos);
    }
    
    // Page 4: Compliance Gap Analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Compliance Gap Analysis', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    yPos = 35;
    
    doc.text('Identified Compliance Gaps:', 20, yPos);
    yPos += 12;
    
    // Analyze specific gaps based on scores
    if (data.categoryScores['Authentication'] <= 40) {
        doc.text('• Authentication and Access Control Gaps:', 30, yPos);
        yPos += 10;
        doc.text('  - Multi-factor authentication not implemented', 40, yPos);
        yPos += 10;
        doc.text('  - Weak password policies in place', 40, yPos);
        yPos += 10;
        doc.text('  - Insufficient access control monitoring', 40, yPos);
        yPos += 15;
    }
    
    if (data.categoryScores['Network Security'] <= 40) {
        doc.text('• Network Security Compliance Issues:', 30, yPos);
        yPos += 10;
        doc.text('  - Inadequate firewall protection', 40, yPos);
        yPos += 10;
        doc.text('  - No network segmentation', 40, yPos);
        yPos += 10;
        doc.text('  - Insufficient network monitoring', 40, yPos);
        yPos += 15;
    }
    
    if (data.categoryScores['Data Protection'] <= 40) {
        doc.text('• Data Protection Compliance Deficiencies:', 30, yPos);
        yPos += 10;
        doc.text('  - No formal data backup strategy', 40, yPos);
        yPos += 10;
        doc.text('  - Data encryption not implemented', 40, yPos);
        yPos += 10;
        doc.text('  - No data classification system', 40, yPos);
        yPos += 15;
    }
    
    if (data.categoryScores['Incident Response'] <= 40) {
        doc.text('• Incident Response Compliance Gaps:', 30, yPos);
        yPos += 10;
        doc.text('  - No formal incident response plan', 40, yPos);
        yPos += 10;
        doc.text('  - Insufficient security training', 40, yPos);
        yPos += 10;
        doc.text('  - No security monitoring capabilities', 40, yPos);
        yPos += 15;
    }
    
    // Page 5: Compliance Improvement Plan
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Compliance Improvement Plan', 20, 20);
    
    yPos = 35;
    doc.text('Regulatory Compliance Requirements:', 20, yPos);
    yPos += 12;
    
    doc.text('Phase 1: Immediate Compliance Actions (30 days):', 20, yPos);
    yPos += 12;
    
    if (data.categoryScores['Authentication'] <= 40) {
        doc.text('• Implement Multi-Factor Authentication', 30, yPos);
        yPos += 10;
        doc.text('  - Deploy MFA for all administrative accounts', 40, yPos);
        yPos += 10;
        doc.text('  - Configure MFA for remote access systems', 40, yPos);
        yPos += 10;
        doc.text('  - Document MFA implementation for audit purposes', 40, yPos);
        yPos += 15;
    }
    
    if (data.categoryScores['Data Protection'] <= 40) {
        doc.text('• Establish Data Protection Controls', 30, yPos);
        yPos += 10;
        doc.text('  - Implement data encryption for sensitive information', 40, yPos);
        yPos += 10;
        doc.text('  - Develop data backup and recovery procedures', 40, yPos);
        yPos += 10;
        doc.text('  - Create data classification policy', 40, yPos);
        yPos += 15;
    }
    
    doc.text('Phase 2: Intermediate Compliance Measures (60-90 days):', 20, yPos);
    yPos += 12;
    
    doc.text('• Security Policy Development', 30, yPos);
    yPos += 10;
    doc.text('  - Create comprehensive security policies', 40, yPos);
    yPos += 10;
    doc.text('  - Develop incident response procedures', 40, yPos);
    yPos += 10;
    doc.text('  - Establish access control policies', 40, yPos);
    yPos += 15;
    
    doc.text('• Training and Awareness Program', 30, yPos);
    yPos += 10;
    doc.text('  - Implement security awareness training', 40, yPos);
    yPos += 10;
    doc.text('  - Train staff on regulatory requirements', 40, yPos);
    yPos += 10;
    doc.text('  - Document training completion for audits', 40, yPos);
    
    // Page 6: Audit and Monitoring
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Audit and Compliance Monitoring', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    yPos = 35;
    
    doc.text('Continuous Compliance Monitoring:', 20, yPos);
    yPos += 12;
    
    doc.text('• Regular Compliance Assessments', 30, yPos);
    yPos += 10;
    doc.text('  - Quarterly compliance reviews', 40, yPos);
    yPos += 10;
    doc.text('  - Annual third-party compliance audits', 40, yPos);
    yPos += 10;
    doc.text('  - Continuous monitoring of security controls', 40, yPos);
    yPos += 15;
    
    doc.text('• Documentation Requirements', 30, yPos);
    yPos += 10;
    doc.text('  - Maintain compliance documentation', 40, yPos);
    yPos += 10;
    doc.text('  - Keep audit trails and logs', 40, yPos);
    yPos += 10;
    doc.text('  - Document security incidents and responses', 40, yPos);
    yPos += 15;
    
    doc.text('• Regulatory Reporting', 30, yPos);
    yPos += 10;
    doc.text('  - Prepare required regulatory reports', 40, yPos);
    yPos += 10;
    doc.text('  - Maintain breach notification procedures', 40, yPos);
    yPos += 10;
    doc.text('  - Coordinate with legal and compliance teams', 40, yPos);
    
    // Save PDF
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