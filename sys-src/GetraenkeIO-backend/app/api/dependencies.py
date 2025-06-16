from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasicCredentials
from sqlmodel import Session

from app.crud.user import read_user_by_uname

from ..core.security import security_scheme, verify_password

from ..models.user import User

from ..core.database import engine

import logging

logger = logging.getLogger()

ERROR_FORBIDDEN = "Der aktuell eingeloggte Benutzer besitzt nicht die benötigten administrativen Rechte!"

# Datenbank
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# Aktueller Benutzer (Autorisierung)

def authenticate_user(session: Session, username: str, passwd: str):
    user = read_user_by_uname(session=session, name=username)
    if not user:
        return None
    if not verify_password(passwd, user.hashed_password):
        return None
    return user

def get_current_user(session: SessionDep, credentials: Annotated[HTTPBasicCredentials, Depends(security_scheme)]) -> User:
    user = authenticate_user(session, credentials.username, credentials.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Benutzername oder Passwort sind fehlerhaft!",
            headers={"WWW-Authenticate": "Basic"}
        )
    else:
        return user
    

def get_current_admin_user(session: SessionDep, credentials: Annotated[HTTPBasicCredentials, Depends(security_scheme)]) -> User:
    user = get_current_user(session=session, credentials=credentials)
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ERROR_FORBIDDEN
            )
    else:
        return user
    
CurrentUserDep = Annotated[User, Depends(get_current_user)]

CurrentAdminUserDep = Annotated[CurrentUserDep, Depends(get_current_admin_user)]