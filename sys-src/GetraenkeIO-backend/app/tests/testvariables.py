from decimal import Decimal
from ..core.security import get_password_hash

VALID_USER_NAME="TestBenutzer"
VALID_USER_PASSWORD="password"
VALID_USER_JSON = {
    "name": VALID_USER_NAME,
    "is_admin": False,
    "guthaben": Decimal("25.30"),
    "hashed_password": get_password_hash(VALID_USER_PASSWORD) 
    }