// Dynamic Frontend Integration for Cyber Risk Assessment Tool
// This file provides dynamic frontend functionality and integration

/**
 * Dynamic Frontend Manager
 * Handles dynamic content loading, form validation, and user interactions
 */
class DynamicFrontendManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.formData = {};
        this.validationRules = {};
        
        this.init();
    }
    
    /**
     * Initialize the dynamic frontend
     */
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupProgressTracking();
        this.setupAccessibility();
    }
    
    /**
     * Setup event listeners for dynamic interactions
     */
    setupEventListeners() {
        // Form step navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-step')) {
                this.nextStep();
            } else if (e.target.classList.contains('prev-step')) {
                this.prevStep();
            }
        });
        
        // Dynamic form validation
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('dynamic-input')) {
                this.validateField(e.target);
            }
        });
        
        // Real-time score calculation
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('risk-score-input')) {
                this.calculateRealTimeScore();
            }
        });
    }
    
    /**
     * Load initial data and setup dynamic content
     */
    loadInitialData() {
        // Load dropdown options dynamically
        this.loadDropdownOptions();
        
        // Setup dynamic charts
        this.setupDynamicCharts();
        
        // Load saved assessments
        this.loadSavedAssessments();
    }
    
    /**
     * Setup progress tracking and navigation
     */
    setupProgressTracking() {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            this.updateProgress();
            
            // Add progress animation
            progressBar.style.transition = 'width 0.3s ease';
        }
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels
        this.addARIALabels();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add screen reader support
        this.addScreenReaderSupport();
    }
    
    /**
     * Load dropdown options dynamically
     */
    loadDropdownOptions() {
        const dropdowns = document.querySelectorAll('.dynamic-dropdown');
        
        dropdowns.forEach(dropdown => {
            const options = this.getDropdownOptions(dropdown.dataset.type);
            this.populateDropdown(dropdown, options);
        });
    }
    
    /**
     * Get dropdown options based on type
     */
    getDropdownOptions(type) {
        const options = {
            industry: [
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'finance', label: 'Financial Services' },
                { value: 'education', label: 'Education' },
                { value: 'government', label: 'Government' },
                { value: 'retail', label: 'Retail' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'technology', label: 'Technology' }
            ],
            size: [
                { value: 'small', label: 'Small (1-50 employees)' },
                { value: 'medium', label: 'Medium (51-500 employees)' },
                { value: 'large', label: 'Large (501+ employees)' }
            ],
            riskLevel: [
                { value: 'low', label: 'Low Risk' },
                { value: 'medium', label: 'Medium Risk' },
                { value: 'high', label: 'High Risk' },
                { value: 'critical', label: 'Critical Risk' }
            ]
        };
        
        return options[type] || [];
    }
    
    /**
     * Populate dropdown with options
     */
    populateDropdown(dropdown, options) {
        dropdown.innerHTML = '';
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            dropdown.appendChild(optionElement);
        });
    }
    
    /**
     * Setup dynamic charts
     */
    setupDynamicCharts() {
        // Risk score progress chart
        this.setupRiskScoreChart();
        
        // Category breakdown chart
        this.setupCategoryChart();
        
        // Trend analysis chart
        this.setupTrendChart();
    }
    
    /**
     * Setup risk score progress chart
     */
    setupRiskScoreChart() {
        const ctx = document.getElementById('risk-score-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Risk Score', 'Remaining'],
                    datasets: [{
                        data: [0, 100],
                        backgroundColor: ['#e74c3c', '#ecf0f1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }
    
    /**
     * Setup category breakdown chart
     */
    setupCategoryChart() {
        const ctx = document.getElementById('category-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'],
                    datasets: [{
                        label: 'Risk Score',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: '#3498db'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        }
    }
    
    /**
     * Setup trend analysis chart
     */
    setupTrendChart() {
        const ctx = document.getElementById('trend-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Risk Score Trend',
                        data: [],
                        borderColor: '#2ecc71',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
    
    /**
     * Load saved assessments
     */
    loadSavedAssessments() {
        const savedAssessments = localStorage.getItem('savedAssessments');
        if (savedAssessments) {
            const assessments = JSON.parse(savedAssessments);
            this.displaySavedAssessments(assessments);
        }
    }
    
    /**
     * Display saved assessments
     */
    displaySavedAssessments(assessments) {
        const container = document.getElementById('saved-assessments');
        if (container && assessments.length > 0) {
            assessments.forEach(assessment => {
                const assessmentCard = this.createAssessmentCard(assessment);
                container.appendChild(assessmentCard);
            });
        }
    }
    
    /**
     * Create assessment card element
     */
    createAssessmentCard(assessment) {
        const card = document.createElement('div');
        card.className = 'assessment-card';
        card.innerHTML = `
            <h3>${assessment.organizationName}</h3>
            <p>Industry: ${assessment.industrySector}</p>
            <p>Risk Score: ${assessment.overallScore}%</p>
            <p>Date: ${assessment.date}</p>
            <button class="btn btn-primary load-assessment" data-id="${assessment.id}">
                Load Assessment
            </button>
        `;
        
        card.querySelector('.load-assessment').addEventListener('click', () => {
            this.loadAssessment(assessment);
        });
        
        return card;
    }
    
    /**
     * Load specific assessment
     */
    loadAssessment(assessment) {
        // Populate form with assessment data
        this.populateFormWithAssessment(assessment);
        
        // Update UI to show loaded assessment
        this.showLoadedAssessment(assessment);
    }
    
    /**
     * Populate form with assessment data
     */
    populateFormWithAssessment(assessment) {
        // Implementation for populating form fields
        // This would depend on the specific form structure
    }
    
    /**
     * Show loaded assessment in UI
     */
    showLoadedAssessment(assessment) {
        // Update progress indicators
        this.updateProgress();
        
        // Update charts
        this.updateCharts(assessment);
        
        // Show assessment summary
        this.showAssessmentSummary(assessment);
    }
    
    /**
     * Update charts with new data
     */
    updateCharts(assessment) {
        // Update risk score chart
        this.updateRiskScoreChart(assessment.overallScore);
        
        // Update category chart
        this.updateCategoryChart(assessment.categoryScores);
        
        // Update trend chart
        this.updateTrendChart(assessment.trendData);
    }
    
    /**
     * Update risk score chart
     */
    updateRiskScoreChart(score) {
        const chart = Chart.getChart('risk-score-chart');
        if (chart) {
            chart.data.datasets[0].data = [score, 100 - score];
            chart.update();
        }
    }
    
    /**
     * Update category chart
     */
    updateCategoryChart(categoryScores) {
        const chart = Chart.getChart('category-chart');
        if (chart) {
            chart.data.datasets[0].data = [
                categoryScores.IDENTIFY || 0,
                categoryScores.PROTECT || 0,
                categoryScores.DETECT || 0,
                categoryScores.RESPOND || 0,
                categoryScores.RECOVER || 0
            ];
            chart.update();
        }
    }
    
    /**
     * Update trend chart
     */
    updateTrendChart(trendData) {
        const chart = Chart.getChart('trend-chart');
        if (chart && trendData) {
            chart.data.labels = trendData.labels;
            chart.data.datasets[0].data = trendData.values;
            chart.update();
        }
    }
    
    /**
     * Show assessment summary
     */
    showAssessmentSummary(assessment) {
        const summary = document.getElementById('assessment-summary');
        if (summary) {
            summary.innerHTML = `
                <h3>Assessment Summary</h3>
                <p>Organization: ${assessment.organizationName}</p>
                <p>Industry: ${assessment.industrySector}</p>
                <p>Risk Score: ${assessment.overallScore}%</p>
                <p>Risk Level: ${assessment.riskLevel}</p>
            `;
        }
    }
    
    /**
     * Navigate to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.saveProgress();
        }
    }
    
    /**
     * Navigate to previous step
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }
    
    /**
     * Update step display
     */
    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }
        
        // Update progress
        this.updateProgress();
    }
    
    /**
     * Update progress indicators
     */
    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }
    
    /**
     * Validate form field
     */
    validateField(field) {
        const value = field.value;
        const rules = this.validationRules[field.name];
        
        if (rules) {
            let isValid = true;
            let errorMessage = '';
            
            if (rules.required && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (rules.min && value.length < rules.min) {
                isValid = false;
                errorMessage = `Minimum ${rules.min} characters required`;
            } else if (rules.max && value.length > rules.max) {
                isValid = false;
                errorMessage = `Maximum ${rules.max} characters allowed`;
            }
            
            this.showFieldValidation(field, isValid, errorMessage);
        }
    }
    
    /**
     * Show field validation result
     */
    showFieldValidation(field, isValid, errorMessage) {
        const parent = field.parentElement;
        const errorElement = parent.querySelector('.field-error');
        
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        }
    }
    
    /**
     * Calculate real-time score
     */
    calculateRealTimeScore() {
        // Get all risk score inputs
        const inputs = document.querySelectorAll('.risk-score-input');
        let totalScore = 0;
        let count = 0;
        
        inputs.forEach(input => {
            if (input.value) {
                totalScore += parseInt(input.value);
                count++;
            }
        });
        
        if (count > 0) {
            const averageScore = totalScore / count;
            this.updateRiskScoreDisplay(averageScore);
        }
    }
    
    /**
     * Update risk score display
     */
    updateRiskScoreDisplay(score) {
        const scoreDisplay = document.getElementById('current-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = Math.round(score);
        }
        
        // Update chart
        this.updateRiskScoreChart(Math.round(score));
    }
    
    /**
     * Save progress to localStorage
     */
    saveProgress() {
        const progress = {
            currentStep: this.currentStep,
            formData: this.formData,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('assessmentProgress', JSON.stringify(progress));
    }
    
    /**
     * Load progress from localStorage
     */
    loadProgress() {
        const progress = localStorage.getItem('assessmentProgress');
        if (progress) {
            const data = JSON.parse(progress);
            this.currentStep = data.currentStep;
            this.formData = data.formData;
            this.updateStepDisplay();
        }
    }
    
    /**
     * Add ARIA labels for accessibility
     */
    addARIALabels() {
        // Add ARIA labels to form elements
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (!element.getAttribute('aria-label')) {
                const label = element.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    element.setAttribute('aria-label', label.textContent);
                }
            }
        });
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const activeElement = document.activeElement;
                if (activeElement.classList.contains('next-step')) {
                    this.nextStep();
                } else if (activeElement.classList.contains('prev-step')) {
                    this.prevStep();
                }
            }
        });
    }
    
    /**
     * Add screen reader support
     */
    addScreenReaderSupport() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }
    
    /**
     * Announce changes to screen readers
     */
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
}

// Initialize dynamic frontend when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicFrontend = new DynamicFrontendManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicFrontendManager;
}