# MOBICURE - Advanced Cybersecurity Command Center

## Project Structure

### Frontend (Next.js)
- **UI Components**: All React components for the user interface
- **Pages**: Next.js pages for routing (dashboard, tools, vault, settings)
- **Styling**: Tailwind CSS with cyberpunk theme
- **State Management**: React hooks and context

### Backend (Python)
- **Scripts**: Core security analysis tools and engines
- **Logic**: Authentication, encryption, and business logic
- **API**: FastAPI server for handling security operations
- **Config**: Security configurations and settings

## Installation & Setup

### Frontend Setup
\`\`\`bash
npm install
npm run dev
\`\`\`

### Backend Setup
\`\`\`bash
cd backend
pip install -r requirements.txt
python -m uvicorn api.main_api:app --reload
\`\`\`

### Full Development
\`\`\`bash
npm run full:dev
\`\`\`

## Security Tools

1. **APK Analyzer** - Android application security analysis
2. **URL Threat Scanner** - Web security and malware detection
3. **Network Scanner** - Network vulnerability assessment
4. **Malware Scanner** - File-based threat detection
5. **PDF Security Scanner** - Document security analysis
6. **ZIP File Scanner** - Archive security analysis
7. **Data Breach Checker** - Email breach verification
8. **Privacy Vault** - AES-256 encrypted storage

## API Endpoints

- `POST /api/security/analyze-file` - File security analysis
- `POST /api/security/scan-url` - URL threat scanning
- `POST /api/security/scan-network` - Network vulnerability scanning
- `POST /api/security/check-breach` - Data breach checking
- `GET /api/security/health` - API health check

## Deployment

### Docker Deployment
\`\`\`bash
cd backend
docker build -t mobicure-backend .
docker run -p 8000:8000 mobicure-backend
\`\`\`

### Production Setup
1. Configure environment variables
2. Set up SSL certificates
3. Configure CORS for production domains
4. Set up monitoring and logging

## Developer

**Nick** - Lead Developer  
Email: abc@gmail.com

## License

Proprietary - MOBICURE Cybersecurity Platform
