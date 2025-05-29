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

def test_drink_get_wrong_id(db, client, setup_normal):
    response = client.get("/drinks/" + str(uuid4()), auth=(VALID_USER_NAME,VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_drink_post_valid(db, client, setup_admin):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":VALID_DRINK.imageUrl,"count":VALID_DRINK.count,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == VALID_POST_DRINK["name"]
    assert response_data.imageUrl == VALID_POST_DRINK["imageUrl"]
    assert response_data.count == VALID_POST_DRINK["count"]
    assert response_data.cost == VALID_POST_DRINK["cost"]

def test_drink_post_unauthorized(db, client, setup_admin):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":VALID_DRINK.imageUrl,"count":VALID_DRINK.count,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=("WrongUser","WrongPW"),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_drink_post_forbidden(db, client, setup_normal):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":VALID_DRINK.imageUrl,"count":VALID_DRINK.count,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_drink_post_wrong_name(db, client, setup_admin):
    VALID_POST_DRINK = {"name":"      sdfasd     ", "imageUrl":VALID_DRINK.imageUrl,"count":VALID_DRINK.count,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "string_pattern_mismatch"

def test_drink_post_wrong_url(db, client, setup_admin):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":"fakeUrl","count":VALID_DRINK.count,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "string_pattern_mismatch"

def test_drink_post_wrong_count(db, client, setup_admin):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":VALID_DRINK.imageUrl,"count":-1,"cost":VALID_DRINK.cost}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"
    assert response.json()["detail"][0]["msg"] == "Value error, Der Wert des Attributs cout darf nicht kleiner als 0 sein!"

def test_drink_post_wrong_cost(db, client, setup_admin):
    VALID_POST_DRINK = {"name":VALID_DRINK.name, "imageUrl":VALID_DRINK.imageUrl,"count":VALID_DRINK.count,"cost":-1}
    response = client.post("/drinks", auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"
    assert response.json()["detail"][0]["msg"] == "Value error, Der Wert des Attributs cost darf nicht kleiner als 0 sein!"

#

def test_drink_put_name(db, client, setup_admin, add_valid_drink):
    VALID_POST_DRINK = {"name":"New Drink Name"}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == "New Drink Name"
    assert response_data.imageUrl == VALID_DRINK.imageUrl
    assert response_data.count == VALID_DRINK.count
    assert response_data.cost == VALID_DRINK.cost

def test_drink_put_imageUrl(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"imageUrl":"https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == VALID_DRINK.name
    assert response_data.imageUrl == "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    assert response_data.count == VALID_DRINK.count
    assert response_data.cost == VALID_DRINK.cost

def test_drink_put_count(db, client, setup_admin, add_valid_drink):
    VALID_POST_DRINK = {"count":10}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == VALID_DRINK.name
    assert response_data.imageUrl == VALID_DRINK.imageUrl
    assert response_data.count == 10
    assert response_data.cost == VALID_DRINK.cost

def test_drink_put_cost(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"cost":1}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == VALID_DRINK.name
    assert response_data.imageUrl == VALID_DRINK.imageUrl
    assert response_data.count == VALID_DRINK.count
    assert response_data.cost == 1

def test_drink_put_all(db, client, setup_admin, add_valid_drink):
    VALID_POST_DRINK = {"name":"New Drink Name", "imageUrl":"https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1","count":10,"cost":1}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == "New Drink Name"
    assert response_data.imageUrl == "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    assert response_data.count == 10
    assert response_data.cost == 1

def test_drink_put_none(db, client, setup_admin, add_valid_drink):
    VALID_POST_DRINK = {}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_200_OK
    response_data = Drink.model_validate(response.json())
    assert response_data.name == VALID_DRINK.name
    assert response_data.imageUrl == VALID_DRINK.imageUrl
    assert response_data.count == VALID_DRINK.count
    assert response_data.cost == VALID_DRINK.cost

def test_drink_put_unauthorized(db, client, setup_admin, add_valid_drink):
    VALID_POST_DRINK = {}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=("WrongUser","WrongPW"),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_drink_put_forbidden(db, client, setup_normal, add_valid_drink):
    VALID_POST_DRINK = {}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_drink_put_wrong_name(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"name":"      sdfasd     "}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "string_pattern_mismatch"

def test_drink_put_wrong_url(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"imageUrl":"fakeUrl"}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "string_pattern_mismatch"

def test_drink_put_wrong_count(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"count":-1}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"
    assert response.json()["detail"][0]["msg"] == "Value error, Der Wert des Attributs cout darf nicht kleiner als 0 sein!"

def test_drink_put_wrong_cost(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {"cost":-1}
    response = client.put("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert response.json()["detail"][0]["type"] == "value_error"
    assert response.json()["detail"][0]["msg"] == "Value error, Der Wert des Attributs cost darf nicht kleiner als 0 sein!"

def test_drink_put_wrong_id(db, client, setup_admin,add_valid_drink):
    VALID_POST_DRINK = {}
    response = client.put("/drinks/" + str(uuid4()), auth=(VALID_USER_NAME, VALID_USER_PASSWORD),json=VALID_POST_DRINK)
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_drink_delete_valid(db, client, setup_admin,add_valid_drink):
    response = client.delete("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_200_OK
    assert db.get(Drink,VALID_DRINK_UUID) == None

def test_drink_delete_unauthorized(db, client, setup_admin,add_valid_drink):
    response = client.delete("/drinks/" + str(VALID_DRINK_UUID), auth=("WrongUser","WrongPW"))
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert db.get(Drink,VALID_DRINK_UUID) != None

def test_drink_delete_forbidden(db, client, setup_normal,add_valid_drink):
    response = client.delete("/drinks/" + str(VALID_DRINK_UUID), auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert db.get(Drink,VALID_DRINK_UUID) != None

def test_drink_delete_wrong_id(db, client, setup_admin,add_valid_drink):
    response = client.delete("/drinks/" + str(uuid4()), auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    assert response.status_code == status.HTTP_404_NOT_FOUND