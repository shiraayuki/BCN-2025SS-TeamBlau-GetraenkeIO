from sqlmodel import Session, select

from ..models import RechargeBase, Recharge
from ..models import User

def store_recharge_for_user_to_db(*, session: Session, recharge: RechargeBase, user: User) -> Recharge:
    db_obj = Recharge(user_id=user.id, amount=recharge.amount)
    user.guthaben = user.guthaben + db_obj.amount
    session.add(user)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def read_recharges_for_user_from_db(session: Session, user: User) -> list[Recharge]:
    statement = select(Recharge).where(Recharge.user_id == user.id)
    recharges = session.exec(statement).all()
    return recharges