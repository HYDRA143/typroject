#!/usr/bin/env python3
"""
MOBICURE Security Engine - Main Backend Service
Coordinates all security analysis tools and provides unified API
"""

import asyncio
import json
import logging
from typing import Dict, Any, List
from datetime import datetime
import hashlib
import requests
from pathlib import Path

# Import all security modules
from .apk_analyzer_service import APKAnalyzer
from .url_threat_scanner_service import URLThreatScanner
from .network_scanner_service import NetworkScanner
from .malware_scanner_service import MalwareScanner
from .pdf_security_scanner import PDFSecurityScanner
from .zip_security_scanner import ZIPSecurityScanner
from .breach_checker_service import BreachChecker

class MOBICURESecurityEngine:
    """Main security engine that coordinates all security tools"""
    
    def __init__(self):
        self.logger = self._setup_logging()
        self.tools = {
            'apk_analyzer': APKAnalyzer(),
            'url_scanner': URLThreatScanner(),
            'network_scanner': NetworkScanner(),
            'malware_scanner': MalwareScanner(),
            'pdf_scanner': PDFSecurityScanner(),
            'zip_scanner': ZIPSecurityScanner(),
            'breach_checker': BreachChecker()
        }
        
    def _setup_logging(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('backend/logs/security_engine.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger('MOBICURESecurityEngine')
    
    async def analyze_file(self, file_path: str, file_type: str) -> Dict[str, Any]:
        """Analyze any file type using appropriate security tools"""
        try:
            self.logger.info(f"Starting analysis for {file_path} (type: {file_type})")
            
            if file_type.lower() == 'apk':
                return await self.tools['apk_analyzer'].analyze(file_path)
            elif file_type.lower() == 'pdf':
                return await self.tools['pdf_scanner'].scan_pdf(file_path)
            elif file_type.lower() in ['zip', 'rar', '7z']:
                return await self.tools['zip_scanner'].scan_archive(file_path)
            else:
                return await self.tools['malware_scanner'].scan_file(file_path)
                
        except Exception as e:
            self.logger.error(f"Error analyzing file {file_path}: {str(e)}")
            return {"error": str(e), "status": "failed"}
    
    async def scan_url(self, url: str) -> Dict[str, Any]:
        """Comprehensive URL security analysis"""
        return await self.tools['url_scanner'].analyze_url(url)
    
    async def scan_network(self, target: str) -> Dict[str, Any]:
        """Network security scanning and analysis"""
        return await self.tools['network_scanner'].scan_network(target)
    
    async def check_breach(self, email: str) -> Dict[str, Any]:
        """Check if email appears in data breaches"""
        return await self.tools['breach_checker'].check_email(email)
    
    def generate_security_report(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate comprehensive security report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_scans": len(analysis_results),
            "high_risk_items": 0,
            "medium_risk_items": 0,
            "low_risk_items": 0,
            "clean_items": 0,
            "detailed_results": analysis_results,
            "recommendations": []
        }
        
        # Analyze risk levels
        for result in analysis_results:
            risk_level = result.get('risk_level', 'unknown').lower()
            if risk_level == 'high':
                report["high_risk_items"] += 1
            elif risk_level == 'medium':
                report["medium_risk_items"] += 1
            elif risk_level == 'low':
                report["low_risk_items"] += 1
            else:
                report["clean_items"] += 1
        
        # Generate recommendations
        if report["high_risk_items"] > 0:
            report["recommendations"].append("Immediate action required for high-risk items")
        if report["medium_risk_items"] > 0:
            report["recommendations"].append("Review and address medium-risk items")
        
        return report

if __name__ == "__main__":
    engine = MOBICURESecurityEngine()
    print("MOBICURE Security Engine initialized successfully")
