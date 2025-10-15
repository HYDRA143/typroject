"""
MOBICURE Vault Encryption Logic
Handles AES-256 encryption for privacy vault
"""

import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import json
from typing import Dict, Any, List

class MOBICUREVault:
    """Secure vault with AES-256 encryption"""
    
    def __init__(self, master_password: str):
        self.master_password = master_password
        self.key = self._derive_key(master_password)
        self.cipher = Fernet(self.key)
    
    def _derive_key(self, password: str) -> bytes:
        """Derive encryption key from master password"""
        salt = b'mobicure_vault_salt_2024'  # In production, use random salt
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key
    
    def encrypt_data(self, data: Dict[str, Any]) -> str:
        """Encrypt vault data"""
        json_data = json.dumps(data).encode()
        encrypted_data = self.cipher.encrypt(json_data)
        return base64.urlsafe_b64encode(encrypted_data).decode()
    
    def decrypt_data(self, encrypted_data: str) -> Dict[str, Any]:
        """Decrypt vault data"""
        try:
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
            decrypted_data = self.cipher.decrypt(encrypted_bytes)
            return json.loads(decrypted_data.decode())
        except Exception as e:
            raise ValueError(f"Failed to decrypt data: {str(e)}")
    
    def store_vault_item(self, item_type: str, item_data: Dict[str, Any]) -> str:
        """Store encrypted vault item"""
        vault_item = {
            'type': item_type,
            'data': item_data,
            'created_at': str(datetime.now()),
            'id': secrets.token_hex(16)
        }
        return self.encrypt_data(vault_item)
    
    def retrieve_vault_item(self, encrypted_item: str) -> Dict[str, Any]:
        """Retrieve and decrypt vault item"""
        return self.decrypt_data(encrypted_item)
