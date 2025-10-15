"""
MOBICURE Authentication Logic
Handles user authentication, session management, and security
"""

import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import bcrypt

class MOBICUREAuth:
    """Authentication and session management"""
    
    def __init__(self, secret_key: str = None):
        self.secret_key = secret_key or secrets.token_hex(32)
        self.sessions = {}
        
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def create_session(self, user_id: str) -> str:
        """Create new user session"""
        session_token = secrets.token_hex(32)
        self.sessions[session_token] = {
            'user_id': user_id,
            'created_at': datetime.now(),
            'expires_at': datetime.now() + timedelta(hours=24)
        }
        return session_token
    
    def validate_session(self, session_token: str) -> Optional[Dict[str, Any]]:
        """Validate session token"""
        session = self.sessions.get(session_token)
        if session and session['expires_at'] > datetime.now():
            return session
        return None
    
    def create_jwt_token(self, user_data: Dict[str, Any]) -> str:
        """Create JWT token for API authentication"""
        payload = {
            'user_data': user_data,
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def verify_jwt_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload['user_data']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
