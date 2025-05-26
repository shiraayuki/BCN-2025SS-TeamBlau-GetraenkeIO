# Tests für den /users Endpunkt
from fastapi import status
from app.models.user import User, UserGet
from ...core.security import get_password_hash
from ...crud.user import read_user_by_uname
from sqlmodel import delete

VALID_USER_NAME="TestBenutzer"
VALID_USER_PASSWORD="password"
VALID_USER_JSON = {
    "name": VALID_USER_NAME,
    "is_admin": False,
    "guthaben": 25.30,
    "hashed_password": get_password_hash(VALID_USER_PASSWORD) 
    }

def test_read_user_me_unauthorized(db, client):
    # Arrange
    db.add(User.model_validate(VALID_USER_JSON))
    db.commit()
    # Act
    response = client.get("/users/me", auth=("falscheruser", "UnglueltigesPassowrt"))
    # Assert
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Benutzername oder Passwort sind fehlerhaft!"

def test_read_user_me_authorized(db, client):
    user = User.model_validate(VALID_USER_JSON)
    db.add(user)
    db.commit()

    response = client.get("/users/me", auth=(VALID_USER_NAME, VALID_USER_PASSWORD))
    
    assert response.status_code == status.HTTP_200_OK
    print(response.json())
    assert UserGet.model_validate(response.json()) == UserGet.model_validate(user)

def test_post_user_creates_new_user_succesful(db, client):
    req_content = {"name": VALID_USER_NAME,"password": VALID_USER_PASSWORD}
    response = client.post("/users", json=req_content)

    response_user = UserGet.model_validate(response.json())
    db_user = read_user_by_uname(session = db, name=VALID_USER_NAME)

    assert response.status_code == status.HTTP_200_OK
    assert response_user.name == VALID_USER_NAME == db_user.name
    assert response_user.is_admin == False == db_user.is_admin
    assert response_user.guthaben == 0 == db_user.guthaben
    assert response_user.id == db_user.id != 0

def test_post_user_throws_bad_request_on_double_entry(client):
    req_content = {"name": VALID_USER_NAME,"password": VALID_USER_PASSWORD}
    response = client.post("/users", json=req_content)
    assert response.status_code == status.HTTP_200_OK
    response = client.post("/users", json=req_content)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Der Benutzer mit dem Name " + VALID_USER_NAME + " existiert bereits!"

