from fastapi import APIRouter, HTTPException, status

from app.models.user import UserPost

from ..dependencies import SessionDep, CurrentUserDep
from ...crud.user import read_user_by_uname, store_user, read_users_from_db
from ...models import UserGet

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserGet)
def read_user_me(current_user: CurrentUserDep):
    return current_user

@router.get("/{user_name}", response_model=UserGet)
def read_user(session: SessionDep, user_name: str, current_user: CurrentUserDep):
    if not (current_user.is_admin or user_name == current_user.name):
        # Nur der admin oder der jeweilige Benutzer dürfen Details ueber sich selbst / andere Benutzer einsehen.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Der aktuell eingeloggte Benutzer verfügt nicht über die notwendige Berechtigung die Benutzerdetails anzuzeigen!"
            )
    user = read_user_by_uname(session=session, name=user_name)
    if user is None:
        raise HTTPException(status_code=404)
    return user

# TODO: authentifizierung nur für den Admin
@router.get("/", response_model=list[UserGet])
def read_users(session: SessionDep):
    users = read_users_from_db(session=session)
    return users

@router.post("/", response_model=UserGet)
def create_user(session: SessionDep, user: UserPost):
    user = store_user(session = session, user_post = user)
    return user
