# Tests für den /users Endpunkt
from fastapi import status
from app.models.user import User, UserGet
from ...core.security import get_password_hash

VALID_USER_PASSWORD="password"
VALID_USER = User(
    name = "TestBenutzer",
    is_admin=False,
    guthaben=25.30,
    hashed_password=get_password_hash(VALID_USER_PASSWORD)
    )

def check_user_get_is_valid_user(userget: UserGet):
    assert userget == UserGet.model_validate(VALID_USER)

def test_read_user_me_unauthorized(db, client):
    # Arrange
    db.add(VALID_USER)
    db.commit()
    # Act
    response = client.get("/users/me", auth=("falscheruser", "UnglueltigesPassowrt"))
    # Assert
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Benutzername oder Passwort sind fehlerhaft!"

def test_read_user_me_authorized(db, client):
    db.add(VALID_USER)
    db.commit()

    response = client.get("/users/me", auth=(VALID_USER.name, VALID_USER_PASSWORD))
    
    assert response.status_code == status.HTTP_200_OK
    assert UserGet.model_validate(response.json()) == UserGet.model_validate(VALID_USER)

