// Frontend Integration Module for Cyber Risk Assessment Tool
// This file provides integration between frontend components and backend services

/**
 * Frontend Integration Manager
 * Handles API communication, data synchronization, and component coordination
 */
class FrontendIntegrationManager {
    constructor() {
        this.apiBaseURL = '/api';
        this.authToken = null;
        this.isOnline = navigator.onLine;
        
        this.init();
    }
    
    /**
     * Initialize frontend integration
     */
    init() {
        this.setupEventListeners();
        this.checkConnectivity();
        this.setupServiceWorkers();
        this.setupDataSync();
    }
    
    /**
     * Setup event listeners for integration events
     */
    setupEventListeners() {
        // Network status changes
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleReconnection();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleDisconnection();
        });
        
        // Authentication events
        document.addEventListener('auth:login', (e) => {
            this.handleLogin(e.detail);
        });
        
        document.addEventListener('auth:logout', () => {
            this.handleLogout();
        });
        
        // Data sync events
        document.addEventListener('data:sync', () => {
            this.syncData();
        });
    }
    
    /**
     * Check network connectivity
     */
    checkConnectivity() {
        if (!this.isOnline) {
            this.showOfflineMessage();
        }
    }
    
    /**
     * Setup service workers for offline functionality
     */
    setupServiceWorkers() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }
    
    /**
     * Setup data synchronization
     */
    setupDataSync() {
        // Setup background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then((sw) => {
                sw.sync.register('sync-data');
            });
        }
    }
    
    /**
     * Handle user login
     */
    handleLogin(authData) {
        this.authToken = authData.token;
        localStorage.setItem('authToken', this.authToken);
        
        // Sync data after login
        this.syncData();
        
        // Update UI state
        this.updateUIState('authenticated');
    }
    
    /**
     * Handle user logout
     */
    handleLogout() {
        this.authToken = null;
        localStorage.removeItem('authToken');
        
        // Clear cached data
        this.clearCachedData();
        
        // Update UI state
        this.updateUIState('unauthenticated');
    }
    
    /**
     * Sync data with server
     */
    async syncData() {
        if (!this.isOnline) {
            console.log('Cannot sync data: Offline');
            return;
        }
        
        try {
            // Sync assessments
            await this.syncAssessments();
            
            // Sync reports
            await this.syncReports();
            
            // Sync user preferences
            await this.syncPreferences();
            
            this.showSyncSuccess();
        } catch (error) {
            console.error('Sync failed:', error);
            this.showSyncError(error);
        }
    }
    
    /**
     * Sync assessments with server
     */
    async syncAssessments() {
        const cachedAssessments = this.getCachedAssessments();
        
        for (const assessment of cachedAssessments) {
            if (assessment.isNew || assessment.isModified) {
                await this.saveAssessment(assessment);
                this.markAsSynced(assessment.id);
            }
        }
    }
    
    /**
     * Sync reports with server
     */
    async syncReports() {
        const cachedReports = this.getCachedReports();
        
        for (const report of cachedReports) {
            if (report.isNew || report.isModified) {
                await this.saveReport(report);
                this.markAsSynced(report.id);
            }
        }
    }
    
    /**
     * Sync user preferences
     */
    async syncPreferences() {
        const preferences = this.getCachedPreferences();
        if (preferences.isModified) {
            await this.savePreferences(preferences);
            this.markAsSynced('preferences');
        }
    }
    
    /**
     * Save assessment to server
     */
    async saveAssessment(assessment) {
        const response = await fetch(`${this.apiBaseURL}/assessments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            },
            body: JSON.stringify(assessment)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save assessment');
        }
        
        return response.json();
    }
    
    /**
     * Save report to server
     */
    async saveReport(report) {
        const response = await fetch(`${this.apiBaseURL}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            },
            body: JSON.stringify(report)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save report');
        }
        
        return response.json();
    }
    
    /**
     * Save preferences to server
     */
    async savePreferences(preferences) {
        const response = await fetch(`${this.apiBaseURL}/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            },
            body: JSON.stringify(preferences)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save preferences');
        }
        
        return response.json();
    }
    
    /**
     * Get cached assessments
     */
    getCachedAssessments() {
        const cached = localStorage.getItem('cachedAssessments');
        return cached ? JSON.parse(cached) : [];
    }
    
    /**
     * Get cached reports
     */
    getCachedReports() {
        const cached = localStorage.getItem('cachedReports');
        return cached ? JSON.parse(cached) : [];
    }
    
    /**
     * Get cached preferences
     */
    getCachedPreferences() {
        const cached = localStorage.getItem('cachedPreferences');
        return cached ? JSON.parse(cached) : {};
    }
    
    /**
     * Mark item as synced
     */
    markAsSynced(id) {
        // Implementation for marking items as synced
    }
    
    /**
     * Clear cached data
     */
    clearCachedData() {
        localStorage.removeItem('cachedAssessments');
        localStorage.removeItem('cachedReports');
        localStorage.removeItem('cachedPreferences');
    }
    
    /**
     * Handle reconnection
     */
    handleReconnection() {
        this.hideOfflineMessage();
        this.syncData();
    }
    
    /**
     * Handle disconnection
     */
    handleDisconnection() {
        this.showOfflineMessage();
    }
    
    /**
     * Show offline message
     */
    showOfflineMessage() {
        const message = document.createElement('div');
        message.className = 'offline-message';
        message.innerHTML = `
            <span>You are offline. Some features may be limited.</span>
            <button onclick="window.location.reload()">Retry Connection</button>
        `;
        
        document.body.appendChild(message);
    }
    
    /**
     * Hide offline message
     */
    hideOfflineMessage() {
        const message = document.querySelector('.offline-message');
        if (message) {
            message.remove();
        }
    }
    
    /**
     * Show sync success message
     */
    showSyncSuccess() {
        this.showToast('Data synced successfully', 'success');
    }
    
    /**
     * Show sync error message
     */
    showSyncError(error) {
        this.showToast('Sync failed: ' + error.message, 'error');
    }
    
    /**
     * Show toast message
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    /**
     * Update UI state based on authentication
     */
    updateUIState(state) {
        const body = document.body;
        body.classList.remove('authenticated', 'unauthenticated');
        body.classList.add(state);
        
        // Update navigation
        this.updateNavigation(state);
        
        // Update dashboard
        this.updateDashboard(state);
    }
    
    /**
     * Update navigation based on state
     */
    updateNavigation(state) {
        const nav = document.querySelector('nav');
        if (nav) {
            if (state === 'authenticated') {
                nav.innerHTML = `
                    <a href="/dashboard">Dashboard</a>
                    <a href="/assessments">Assessments</a>
                    <a href="/reports">Reports</a>
                    <a href="/settings">Settings</a>
                    <button onclick="logout()">Logout</button>
                `;
            } else {
                nav.innerHTML = `
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                    <a href="/about">About</a>
                `;
            }
        }
    }
    
    /**
     * Update dashboard based on state
     */
    updateDashboard(state) {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            if (state === 'authenticated') {
                dashboard.style.display = 'block';
                this.loadDashboardData();
            } else {
                dashboard.style.display = 'none';
            }
        }
    }
    
    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        try {
            const response = await fetch(`${this.apiBaseURL}/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.renderDashboard(data);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }
    
    /**
     * Render dashboard with data
     */
    renderDashboard(data) {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.innerHTML = `
                <h2>Welcome back!</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Assessments</h3>
                        <p>${data.assessmentsCount}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Reports Generated</h3>
                        <p>${data.reportsCount}</p>
                    </div>
                    <div class="stat-card">
                        <h3>Average Risk Score</h3>
                        <p>${data.averageRiskScore}%</p>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Setup API interceptors
     */
    setupAPIInterceptors() {
        // Request interceptor
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const [url, options = {}] = args;
            
            // Add auth token
            if (this.authToken) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${this.authToken}`
                };
            }
            
            // Handle offline requests
            if (!this.isOnline) {
                return this.handleOfflineRequest(url, options);
            }
            
            try {
                const response = await originalFetch(url, options);
                
                // Handle authentication errors
                if (response.status === 401) {
                    this.handleAuthError();
                }
                
                return response;
            } catch (error) {
                // Handle network errors
                if (!navigator.onLine) {
                    return this.handleOfflineRequest(url, options);
                }
                throw error;
            }
        };
    }
    
    /**
     * Handle offline requests
     */
    handleOfflineRequest(url, options) {
        // Store request for later sync
        const request = {
            url,
            options,
            timestamp: Date.now()
        };
        
        this.storeOfflineRequest(request);
        
        // Return cached response if available
        return this.getCachedResponse(url);
    }
    
    /**
     * Store offline request
     */
    storeOfflineRequest(request) {
        const requests = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
        requests.push(request);
        localStorage.setItem('offlineRequests', JSON.stringify(requests));
    }
    
    /**
     * Get cached response
     */
    getCachedResponse(url) {
        const cache = JSON.parse(localStorage.getItem('apiCache') || '{}');
        return cache[url] || null;
    }
    
    /**
     * Handle authentication error
     */
    handleAuthError() {
        this.handleLogout();
        window.location.href = '/login';
    }
    
    /**
     * Setup real-time updates
     */
    setupRealTimeUpdates() {
        if ('WebSocket' in window) {
            this.websocket = new WebSocket(`${this.apiBaseURL.replace('http', 'ws')}/updates`);
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleRealTimeUpdate(data);
            };
            
            this.websocket.onclose = () => {
                // Try to reconnect
                setTimeout(() => {
                    this.setupRealTimeUpdates();
                }, 5000);
            };
        }
    }
    
    /**
     * Handle real-time update
     */
    handleRealTimeUpdate(data) {
        switch (data.type) {
            case 'assessment_updated':
                this.updateAssessmentInUI(data.assessment);
                break;
            case 'report_generated':
                this.addReportToUI(data.report);
                break;
            case 'preferences_changed':
                this.updatePreferencesInUI(data.preferences);
                break;
        }
    }
    
    /**
     * Update assessment in UI
     */
    updateAssessmentInUI(assessment) {
        // Implementation for updating assessment in UI
    }
    
    /**
     * Add report to UI
     */
    addReportToUI(report) {
        // Implementation for adding report to UI
    }
    
    /**
     * Update preferences in UI
     */
    updatePreferencesInUI(preferences) {
        // Implementation for updating preferences in UI
    }
}

// Initialize frontend integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.frontendIntegration = new FrontendIntegrationManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrontendIntegrationManager;
}