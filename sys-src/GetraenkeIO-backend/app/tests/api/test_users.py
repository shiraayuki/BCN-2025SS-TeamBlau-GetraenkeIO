# Tests für den /users Endpunkt
from fastapi import status
from app.models.user import User


VALID_USER = User(
    name = "TestBenutzer",
    is_admin=False,
    guthaben=25.30,
    hashed_password="FakeHashedPassword"
    )

def test_read_user_me_unauthorized(db, client):
    # Arrange
    db.add(VALID_USER)
    db.commit()
    # Act
    response = client.get("/users/me", auth=("falscheruser", "UnglueltigesPassowrt"))
    # Assert
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Benutzername oder Passwort sind fehlerhaft!"

# TODO mehr Tests