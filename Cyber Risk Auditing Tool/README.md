# Cyber Risk Auditing Tool

A comprehensive web-based tool for assessing cybersecurity risks in hybrid work environments. This tool helps organizations evaluate their security posture across multiple domains and receive actionable recommendations.

## Features

### 🛡️ **Comprehensive Risk Assessment**
- **Authentication Security**: Evaluate password policies and multi-factor authentication
- **Device Security**: Assess endpoint protection and device management
- **Network Security**: Analyze VPN usage, firewalls, and network monitoring
- **Employee Awareness**: Review training frequency and phishing preparedness
- **Data Protection**: Check encryption, backups, and access controls

### 📊 **Interactive Visualizations**
- Real-time risk score calculation with animated circular progress indicator
- Doughnut chart showing security areas breakdown
- Bar chart displaying risk distribution across categories
- Dynamic recommendations based on assessment results

### 📋 **Professional Reporting**
- Downloadable PDF reports with complete assessment results
- Professional formatting with charts and recommendations
- Timestamped reports for record keeping

### 📱 **Responsive Design**
- Mobile-friendly interface that works on all devices
- Clean, intuitive user experience
- Accessible design with proper form validation

## Technologies Used

- **HTML5** - Semantic markup and form structure
- **CSS3** - Responsive styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality and calculations
- **Chart.js** - Professional data visualizations
- **jsPDF** - PDF report generation
- **html2canvas** - Screenshot capture for reports

## Quick Start

### Local Development

1. **Clone or download** the project files to your computer
2. **Open** `index.html` in any modern web browser
3. **No server required** - the application runs directly in the browser

### Using a Local Server (Recommended for Development)

#### Python (Python 3.x)
```bash
cd Cyber-Risk-Auditing-Tool
python -m http.server 8000
```
Visit: http://localhost:8000

#### Node.js with Live Server
```bash
npm install -g live-server
cd Cyber-Risk-Auditing-Tool
live-server
```

#### GitHub Pages
1. Create a GitHub repository
2. Upload all project files
3. Go to repository Settings > Pages
4. Select source: `main` branch, `/root` folder
5. Your site will be available at: `https://username.github.io/repository-name`



## Project Structure

```
Cyber-Risk-Auditing-Tool/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This documentation file
```

## How It Works

### Risk Calculation Algorithm

The tool uses a sophisticated scoring system:

1. **Base Scores**: Each security category starts with a base risk score
2. **Multipliers**: Positive security measures reduce risk (multipliers < 1)
3. **Negative Factors**: Poor security practices increase risk (multipliers > 1)
4. **Capping**: Final score is capped at 100% maximum risk

### Risk Levels

- **Low Risk (0-25%)**: Strong security posture, minimal vulnerabilities
- **Medium Risk (26-50%)**: Moderate risks that should be addressed
- **High Risk (51-100%)**: Significant vulnerabilities requiring immediate attention

### Categories Assessed

1. **Authentication (20% weight)**
   - Multi-factor authentication
   - Password complexity policies

2. **Device Security (20% weight)**
   - Endpoint protection solutions
   - Device encryption and management

3. **Network Security (20% weight)**
   - VPN usage and network segmentation
   - Firewall and monitoring implementation

4. **Employee Awareness (20% weight)**
   - Security training frequency
   - Phishing simulation exercises

5. **Data Protection (20% weight)**
   - Data encryption and backup procedures
   - Access control policies

## Customization

### Adding New Questions

1. Add form fields to `index.html` in the appropriate section
2. Update the `calculateRiskScore()` function in `script.js`
3. Add corresponding scoring logic
4. Update the breakdown chart labels if needed

### Modifying Risk Weights

Edit the `SCORING` object in `script.js`:

```javascript
const SCORING = {
    authentication: {
        mfa: 10,      // Lower is better
        strong: 20,
        basic: 40,
        none: 80       // Higher is worse
    }
    // ... other categories
};
```

### Changing Visual Design

- **Colors**: Modify CSS variables in `styles.css`
- **Charts**: Update Chart.js configuration in `script.js`
- **Layout**: Adjust CSS Grid and Flexbox properties

## Security Considerations

⚠️ **Important Notes:**

1. **Client-Side Only**: All calculations happen in the browser
2. **No Data Storage**: Responses are not saved or transmitted
3. **Assessment Tool**: This is for educational/assessment purposes only
4. **Professional Advice**: Always consult security professionals for actual implementations

## Troubleshooting

### Common Issues

**Charts not displaying:**
- Check internet connection (Chart.js loads from CDN)
- Verify browser supports Canvas API

**PDF generation failing:**
- Ensure all external libraries are loaded
- Check browser console for JavaScript errors
- Try in a different browser

**Form validation not working:**
- Verify JavaScript is enabled
- Check for console errors
- Ensure all required fields are filled

### Performance Optimization

For large-scale deployments:

1. **Host libraries locally** instead of using CDNs
2. **Minify CSS and JavaScript** files
3. **Compress images** if added
4. **Enable browser caching** on your server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions, issues, or feature requests:

1. Check the troubleshooting section above
2. Review browser developer console for errors
3. Ensure all files are properly uploaded if hosting online

## Future Enhancements

Potential improvements for future versions:

- User account system for saving assessments
- Historical tracking of risk scores over time
- Integration with security scanning tools
- Multi-language support
- Advanced reporting and analytics
- API integration with security tools

