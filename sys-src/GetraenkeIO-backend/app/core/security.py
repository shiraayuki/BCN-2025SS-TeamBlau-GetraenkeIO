# Datei beinhaltet Funktionen zur authtentifizierung und Passwort-sicherheit
# Angelehnt an FastAPI-Doku https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#update-the-token-path-operation

from fastapi.security import HTTPBasic
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

security_scheme = HTTPBasic()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

