# Tests für den /users Endpunkt
from fastapi import status
from app.models.user import User, UserGet
from ...core.security import get_password_hash
from ...crud.user import read_user_by_uname

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
    assert response_user.is_admin is False is db_user.is_admin
    assert response_user.guthaben == 0 == db_user.guthaben
    assert response_user.id == db_user.id != 0

def test_post_user_throws_bad_request_on_double_entry(client):
    req_content = {"name": VALID_USER_NAME,"password": VALID_USER_PASSWORD}
    response = client.post("/users", json=req_content)
    assert response.status_code == status.HTTP_200_OK
    response = client.post("/users", json=req_content)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Der Benutzer mit dem Name " + VALID_USER_NAME + " existiert bereits!"

def test_get_users_returns_unauthorized_with_no_authentication(client):
    response = client.get("/users", auth=("falscheruser", "UnglueltigesPassowrt"))

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Benutzername oder Passwort sind fehlerhaft!"

def test_get_users_returns_forbidden_with_no_permission(db, client):
    db.add(User.model_validate(VALID_USER_JSON))
    db.commit()
    
    response = client.get("/users", auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == "Der aktuell eingeloggte Benutzer besitzt nicht die benötigten administrativen Rechte!"

def test_get_users_with_permission_correct_result(db, client):
    admin_user = User.model_validate(VALID_USER_JSON)
    admin_user.is_admin = True
    other_user = User.model_validate(VALID_USER_JSON)
    other_user.name = "AndererBenutzer"
    db.add(admin_user)
    db.add(other_user)
    db.commit()
    
    response = client.get("/users", auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 2
    assert response.json()[0]["name"] == VALID_USER_NAME
    assert response.json()[1]["name"] == other_user.name

def test_get_users_by_name_ok_with_own_username(db, client):
    user = User.model_validate(VALID_USER_JSON)
    db.add(user)
    db.commit()

    response = client.get("/users/" + VALID_USER_NAME, auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_200_OK
    assert UserGet.model_validate(response.json()) == UserGet.model_validate(user)

def test_get_users_by_name_returns_forbidden_with_other_username(db, client):
    user = User.model_validate(VALID_USER_JSON)
    other_user = User.model_validate(VALID_USER_JSON)
    other_user.name = "AndererBenutzer"
    db.add(user)
    db.add(other_user)
    db.commit()

    response = client.get("/users/" + other_user.name, auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] is not None

def test_get_users_by_name_returns_ok_with_admin_access(db, client):
    user = User.model_validate(VALID_USER_JSON)
    other_user = User.model_validate(VALID_USER_JSON)
    other_user.name = "AndererBenutzer"
    user.is_admin = True
    db.add(user)
    db.add(other_user)
    db.commit()

    response = client.get("/users/" + other_user.name, auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_200_OK
    assert UserGet.model_validate(response.json()) == UserGet.model_validate(other_user)

def test_get_users_by_name_returns_not_found_if_no_user_with_name_is_present(db, client):
    user = User.model_validate(VALID_USER_JSON)
    user.is_admin = True
    db.add(user)
    db.commit()

    response = client.get("/users/" + "NotExistingUser", auth=(VALID_USER_NAME, VALID_USER_PASSWORD))

    assert response.status_code == status.HTTP_404_NOT_FOUND

