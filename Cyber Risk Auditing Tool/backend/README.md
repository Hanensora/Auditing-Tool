# Backend Services Documentation

## Overview

This directory contains the backend services for the Cyber Risk Assessment Tool. The backend is built using Node.js with Express.js framework and provides RESTful APIs for risk assessment, report generation, and data management.

## Architecture

### Service Structure

```
backend/
├── services/           # Business logic and data processing
│   ├── riskCalculator.js      # Risk calculation algorithms
│   ├── reportGenerator.js     # Report generation logic
│   ├── executiveReportGenerator.js
│   ├── technicalReportGenerator.js
│   └── complianceReportGenerator.js
├── routes/            # API endpoint definitions
│   ├── risk.js        # Risk assessment endpoints
│   ├── reports.js     # Report generation endpoints
│   └── dropdowns.js   # Dropdown data endpoints
├── middleware/        # Custom middleware functions
├── models/           # Data models and schemas
└── controllers/      # Request handlers
```

### Key Services

#### 1. Risk Calculator Service
- **File**: `services/riskCalculator.js`
- **Purpose**: Calculates comprehensive risk scores based on NIST Cybersecurity Framework
- **Features**:
  - Category-based risk scoring
  - Overall risk level determination
  - Recommendation generation
  - Compliance scoring (NIST, ISO 27001)

#### 2. Report Generation Services
- **Files**: 
  - `services/executiveReportGenerator.js`
  - `services/technicalReportGenerator.js`
  - `services/complianceReportGenerator.js`
- **Purpose**: Generates professional PDF reports for different audiences
- **Features**:
  - Executive summary reports
  - Technical analysis reports
  - Compliance assessment reports
  - PDF generation with jsPDF

#### 3. Data Management
- **Database**: SQLite with Sequelize ORM
- **Tables**:
  - `assessments` - Stores assessment results
  - `category_scores` - Stores category-specific scores
  - `reports` - Stores generated reports

## API Endpoints

### Risk Assessment Endpoints

#### POST /api/risk/calculate
Calculate risk score based on assessment responses

**Request Body**:
```json
{
  "organizationName": "Example Corp",
  "industrySector": "technology",
  "responses": [
    {
      "category": "IDENTIFY",
      "subcategory": "Asset Management",
      "score": 80
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "assessmentId": 123,
  "overallScore": 75,
  "riskLevel": "Medium Risk",
  "categoryScores": {
    "IDENTIFY": 80,
    "PROTECT": 70,
    "DETECT": 60,
    "RESPOND": 50,
    "RECOVER": 40
  },
  "recommendations": [...],
  "compliance": {
    "nistScore": 75,
    "isoScore": 72,
    "gaps": [...]
  }
}
```

### Report Generation Endpoints

#### POST /api/reports/generate
Generate reports based on assessment ID

**Request Body**:
```json
{
  "assessmentId": 123,
  "reportType": "executive|technical|compliance"
}
```

**Response**:
```json
{
  "success": true,
  "filename": "executive-report-Example-Corp-1234567890.pdf",
  "filepath": "/path/to/report.pdf",
  "reportType": "executive"
}
```

#### GET /api/reports/list
List all generated reports

**Response**:
```json
{
  "reports": [
    {
      "filename": "executive-report-Example-Corp-1234567890.pdf",
      "size": 1024000,
      "created": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Dropdown Data Endpoints

#### GET /api/dropdowns/industries
Get list of supported industries

**Response**:
```json
{
  "industries": [
    {"value": "healthcare", "label": "Healthcare"},
    {"value": "finance", "label": "Financial Services"},
    {"value": "education", "label": "Education"}
  ]
}
```

#### GET /api/dropdowns/organization-sizes
Get list of organization sizes

**Response**:
```json
{
  "sizes": [
    {"value": "small", "label": "Small (1-50 employees)"},
    {"value": "medium", "label": "Medium (51-500 employees)"},
    {"value": "large", "label": "Large (501+ employees)"}
  ]
}
```

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_PATH=./database/assessments.db

# Security Configuration
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

The application uses SQLite for data persistence. The database file is automatically created at `database/assessments.db`.

**Tables Structure**:

```sql
CREATE TABLE assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_name TEXT NOT NULL,
  industry_sector TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);
```

## Security Features

### Input Validation
- Comprehensive input validation for all API endpoints
- SQL injection prevention through parameterized queries
- XSS protection through input sanitization

### Authentication
- JWT-based authentication for protected endpoints
- Role-based access control
- Secure password hashing

### Error Handling
- Structured error responses
- Secure error logging without information disclosure
- Graceful degradation for failed operations

## Performance Optimization

### Caching
- Redis integration for caching frequently accessed data
- Database query optimization
- Response compression

### Monitoring
- Performance metrics collection
- Error tracking and reporting
- Request/response logging

## Development

### Running the Backend

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm test
   ```

### Development Tools

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Jest**: Unit testing framework
- **Supertest**: API testing

### API Documentation

The API is documented using Swagger/OpenAPI specification. Documentation is available at `/api-docs` when running in development mode.

## Deployment

### Production Build

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Configuration

For production deployment, ensure proper environment variables are set:

```bash
NODE_ENV=production
JWT_SECRET=production-secret-key
DB_PATH=/data/assessments.db
CORS_ORIGIN=https://your-frontend-domain.com
```

## Monitoring and Logging

### Application Logs
- Structured logging with Winston
- Log rotation and archival
- Error tracking and alerting

### Performance Monitoring
- Response time tracking
- Database query performance
- Memory usage monitoring

### Health Checks
- Database connectivity checks
- Service availability monitoring
- Resource usage tracking

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database file permissions
   - Verify database path configuration
   - Ensure SQLite is properly installed

2. **API Endpoint Errors**
   - Check request format and required fields
   - Verify authentication tokens
   - Review server logs for detailed error messages

3. **Report Generation Failures**
   - Check PDF generation library installation
   - Verify file system permissions
   - Monitor memory usage during generation

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=cyber-risk-tool:* npm start
```

## Contributing

### Code Style
- Follow ESLint configuration
- Use TypeScript for type safety
- Write comprehensive tests for new features

### Testing
- Unit tests for all business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows

### Documentation
- Update API documentation for new endpoints
- Document configuration changes
- Add troubleshooting guides for new features

## Support

For support and questions:
- Check the troubleshooting section
- Review application logs
- Consult the API documentation
- Contact the development team

## License

This backend service is part of the Cyber Risk Assessment Tool and follows the same licensing terms as the main application.