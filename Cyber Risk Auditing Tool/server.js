const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Import services
const { calculateRiskScore } = require('./backend/services/riskCalculator');
const { generateExecutiveReport } = require('./backend/services/executiveReportGenerator');
const { generateTechnicalReport } = require('./backend/services/technicalReportGenerator');
const { generateComplianceReport } = require('./backend/services/complianceReportGenerator');

// Import database (initialization happens automatically)
require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/risk', require('./backend/routes/risk'));
app.use('/api/reports', require('./backend/routes/reports'));
app.use('/api/dropdowns', require('./backend/routes/dropdowns'));

// Serve static files from current directory (where index.html is)
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'Cyber Risk Assessment Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
    console.log(`Static files served from: ${__dirname}`);
});

module.exports = app;
