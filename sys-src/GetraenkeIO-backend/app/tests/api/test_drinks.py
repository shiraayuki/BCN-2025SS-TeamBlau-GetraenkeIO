from fastapi import status
from sqlmodel import SQLModel, select
from app.models.user import UserGet, User
from app.models.drinks import Drink, DrinkPost
from uuid import uuid4
from app.core.security import get_password_hash
from app.crud.drinks import read_drink_by_id
import pytest

VALID_USER_NAME = "TestBenutzer"
VALID_USER_PASSWORD = "FakeHashedPassword"

VALID_DRINK_NAME = "TestGetraenk"
VALID_DRINK_UUID = uuid4()
VALID_DRINK = Drink(
    id=VALID_DRINK_UUID,
    name=VALID_DRINK_NAME,
    imageUrl="https://images.pexels.com/photos/28220413/pexels-photo-28220413/free-photo-of-flaschengrun.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    count=5,
    cost=3.5)

@pytest.fixture(scope="function")
def setup_normal(db, client):
    VALID_USER = User(
        name = VALID_USER_NAME,
        is_admin=False,
        guthaben=25.30,
        hashed_password=get_password_hash(VALID_USER_PASSWORD)
        )
    db.add(User.model_validate(VALID_USER))
    db.commit()

@pytest.fixture(scope="function")
def setup_admin(db, client):
    VALID_USER = User(
        name = VALID_USER_NAME,
        is_admin=True,
        guthaben=25.30,
        hashed_password=get_password_hash(VALID_USER_PASSWORD)
        )
    db.add(User.model_validate(VALID_USER))
    db.commit()

@pytest.fixture(scope="function")
def add_valid_drink(db,client):
    db.add(Drink.model_validate(VALID_DRINK))
    db.commit()

def test_drinks_get(db, client,setup_normal,add_valid_drink):
    response = client.get("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_200_OK
    assert type(response.json()) == list
    assert len(response.json()) == 1
    response_drink = Drink.model_validate(response.json()[0])
    db_drink = read_drink_by_id(session = db,drink_id=VALID_DRINK_UUID)

    assert response_drink.name == VALID_DRINK_NAME == db_drink.name
    assert response_drink.imageUrl == VALID_DRINK.imageUrl == db_drink.imageUrl
    assert response_drink.count == VALID_DRINK.count == db_drink.count
    assert response_drink.cost == VALID_DRINK.cost == db_drink.cost

def test_drinks_get_unauthorized(db, client, setup_normal):
    response = client.get("/drinks", auth=("WrongUser","WrongPW"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_drink_get(db, client,setup_normal,add_valid_drink):
    response = client.get("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_200_OK
    response_drink = Drink.model_validate(response.json())
    db_drink = read_drink_by_id(session = db,drink_id=VALID_DRINK_UUID)

    assert response_drink.name == VALID_DRINK_NAME == db_drink.name
    assert response_drink.imageUrl == VALID_DRINK.imageUrl == db_drink.imageUrl
    assert response_drink.count == VALID_DRINK.count == db_drink.count
    assert response_drink.cost == VALID_DRINK.cost == db_drink.cost

def test_drink_get_unauthorized(db, client, setup_normal):
    response = client.get("/drinks/" + str(VALID_DRINK_UUID), auth=("WrongUser","WrongPW"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
