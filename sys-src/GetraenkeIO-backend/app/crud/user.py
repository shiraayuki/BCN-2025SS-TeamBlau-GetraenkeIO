from sqlmodel import Session, select

from ..core.security import get_password_hash

from ..models.user import User, UserPost


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

def read_users_from_db(session: Session) -> list[User]:
    sel_statement = select(User)
    users = session.exec(sel_statement).all()
    return users
