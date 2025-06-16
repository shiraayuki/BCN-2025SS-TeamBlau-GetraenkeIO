# Datenbank-Operationen für den /users endpunkt
import uuid
from sqlmodel import Session, select

from ..core.security import get_password_hash

from ..models.user import User, UserPost

from ..core.config import ADMIN_USER_NAME

def store_user(*, session: Session, user_post: UserPost) -> User:
    db_obj = User.model_validate(
        user_post, update={"hashed_password": get_password_hash(user_post.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def read_user_by_uname(*, session: Session, name: str) -> User | None:
    sel_statement = select(User).where(User.name == name)
    user = session.exec(sel_statement).first()
    return user

def read_user_by_id(*, session: Session, id: uuid.UUID) -> User | None:
    sel_statement = select(User).where(User.id == id)
    user = session.exec(sel_statement).first()
    return user

def read_users_from_db(session: Session) -> list[User]:
    sel_statement = select(User)
    users = session.exec(sel_statement).all()
    return users

def create_or_update_admin_user_password(session: Session, password: str) -> User:
    sel_statement = select(User).where(User.name == ADMIN_USER_NAME)
    admin_user = session.exec(sel_statement).first()
    if admin_user is None:
        admin_user = User(name=ADMIN_USER_NAME, hashed_password = get_password_hash(password), is_admin=True)
    else:
        admin_user.hashed_password = get_password_hash(password)
    session.add(admin_user)
    session.commit()
    session.refresh(admin_user)
    return admin_user
