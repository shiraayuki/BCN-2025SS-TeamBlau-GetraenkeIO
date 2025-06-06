import uuid
from fastapi import APIRouter, HTTPException
from app.api.dependencies import CurrentAdminUserDep, SessionDep, CurrentUserDep
from app.crud.drinks import update_drink_by_id
from app.crud.transaction import store_transaction_to_db
from app.models.drinks import Drink
from app.models.transaction import TransactionPost, Transaction
from app.models.user import User


router = APIRouter(prefix="/transactions", tags=["drinks"])

@router.post("/", response_model=Transaction)
def read_drinks(session: SessionDep, transaction_post: TransactionPost, user: CurrentUserDep):
    drink_data = session.get(Drink, transaction_post.drink_id)
    if (drink_data == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Getränke-ID ist ungültig!')
    if (drink_data.count == 0):
        raise HTTPException(status_code=404, detail="Das Getränk ist momentan nicht verfügbar!")
    if (user == None):
        raise HTTPException(status_code=422,detail='Die Angegebene Nutzer-ID ist ungültig!')
    total_price = drink_data.cost * transaction_post.amount
    if (user.guthaben < total_price):
        raise HTTPException(status_code=422,detail='Sie haben nicht genügend Guthaben, um diese Bestellung abzuschließen!')
    transaction = store_transaction_to_db(session=session, transaction_post=transaction_post, drink_data=drink_data, user_data=user)
    return transaction