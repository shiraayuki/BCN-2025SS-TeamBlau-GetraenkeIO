from uuid import uuid4
import pytest
from datetime import datetime, timezone
from app.core.security import get_password_hash
from app.models.drinks import Drink
from app.models.transaction import Transaction
from app.models.user import User


VALID_USER_NAME = "TestBenutzer"
VALID_USER_PASSWORD = "FakeHashedPassword"
VALID_USER_UUID = uuid4()
VALID_USER_GUTHABEN = 25.30

VALID_DRINK_NAME = "TestGetraenk"
VALID_DRINK_UUID = uuid4()
VALID_DRINK = Drink(
    id=VALID_DRINK_UUID,
    name=VALID_DRINK_NAME,
    imageUrl="https://images.pexels.com/photos/28220413/pexels-photo-28220413/free-photo-of-flaschengrun.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    count=5,
    cost=3.5)

VALID_TRANSACTION_UUID = uuid4()
VALID_TRANSACTION = Transaction(transaction_id=VALID_TRANSACTION_UUID,drink_id=VALID_DRINK_UUID, user_id=VALID_USER_UUID,purchase_price=VALID_DRINK.cost, date=datetime.now(timezone.utc), amount=1)

@pytest.fixture(scope="function")
def setup_user(db, client, request):
    is_admin = request.param
    VALID_USER = User(
        id = VALID_USER_UUID,
        name = VALID_USER_NAME,
        is_admin=is_admin,
        guthaben=25.30,
        hashed_password=get_password_hash(VALID_USER_PASSWORD)
        )
    db.add(User.model_validate(VALID_USER))
    db.commit()

@pytest.fixture(scope="function")
def add_valid_drink(db,client):
    db.add(Drink.model_validate(VALID_DRINK))
    db.commit()

@pytest.fixture(scope="function")
def add_valid_transaction(db,request):
    amount = request.param
    VALID_TRANSACTION = Transaction(transaction_id=VALID_TRANSACTION_UUID,drink_id=VALID_DRINK_UUID, user_id=VALID_USER_UUID,purchase_price=VALID_DRINK.cost, date=datetime.now(timezone.utc), amount=amount)
    db.add(Transaction.model_validate(VALID_TRANSACTION))
    db.commit()