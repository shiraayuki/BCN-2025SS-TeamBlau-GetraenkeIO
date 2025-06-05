import uuid
from fastapi import APIRouter, HTTPException, status

from ...crud import user, recharge as rc
from ...models import Recharge, RechargeBase

from ..dependencies import CurrentUserDep, SessionDep, CurrentAdminUserDep, ERROR_FORBIDDEN

def error_missing_user_by_id(id):
    return "Der Benutzer mit der ID " + str(id) + "existiert nicht!"

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/{user_id}/recharges", response_model=Recharge)
def post_recharges(session: SessionDep, user_id: uuid.UUID, recharge: RechargeBase, _: CurrentAdminUserDep):
    db_user = user.read_user_by_id(session=session, id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_missing_user_by_id(user_id)
        )
    return rc.store_recharge_for_user_to_db(session=session, recharge=recharge, user=db_user)

@router.get("/{user_id}/recharges", response_model=list[Recharge])
def get_recharges(session: SessionDep, user_id: uuid.UUID, current_user: CurrentUserDep):
    db_user = user.read_user_by_id(session=session, id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_missing_user_by_id(user_id)
        )
    if not (current_user.is_admin or user_id == current_user.id):
        # Nur der admin oder der jeweilige Benutzer dürfen Details ueber sich selbst / andere Benutzer einsehen.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=ERROR_FORBIDDEN
            )
    recharges = rc.read_recharges_for_user_from_db(session, db_user)
    return recharges
    