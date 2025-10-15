"""
MOBICURE Main API Server
FastAPI backend for all security operations
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from typing import Dict, Any, List, Optional
import json
import os
from pathlib import Path

# Import backend modules
from backend.scripts.main_security_engine import MOBICURESecurityEngine
from backend.logic.authentication import MOBICUREAuth
from backend.logic.vault_encryption import MOBICUREVault

app = FastAPI(
    title="MOBICURE Security API",
    description="Advanced Cybersecurity Analysis Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize security engine
security_engine = MOBICURESecurityEngine()
auth_manager = MOBICUREAuth()
security = HTTPBearer()

@app.post("/api/security/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    """Analyze uploaded file for security threats"""
    try:
        # Save uploaded file temporarily
        temp_path = f"backend/temp/{file.filename}"
        os.makedirs("backend/temp", exist_ok=True)
        
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Determine file type
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        
        # Analyze file
        result = await security_engine.analyze_file(temp_path, file_extension)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return {"status": "success", "analysis": result}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/security/scan-url")
async def scan_url(data: Dict[str, str]):
    """Scan URL for security threats"""
    try:
        url = data.get("url")
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        result = await security_engine.scan_url(url)
        return {"status": "success", "analysis": result}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/security/scan-network")
async def scan_network(data: Dict[str, str]):
    """Scan network target for vulnerabilities"""
    try:
        target = data.get("target")
        if not target:
            raise HTTPException(status_code=400, detail="Target is required")
        
        result = await security_engine.scan_network(target)
        return {"status": "success", "analysis": result}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/security/check-breach")
async def check_breach(data: Dict[str, str]):
    """Check if email appears in data breaches"""
    try:
        email = data.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        result = await security_engine.check_breach(email)
        return {"status": "success", "analysis": result}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/security/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "service": "MOBICURE Security API",
        "version": "1.0.0",
        "timestamp": str(datetime.now())
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
