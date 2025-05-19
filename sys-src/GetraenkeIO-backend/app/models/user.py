from decimal import Decimal
from typing import Annotated
import uuid
from pydantic import AfterValidator, constr
from sqlmodel import Field, SQLModel

# Reservierte Benutzernamen
RESERVERD_USER_NAMES = ["admin", "me", "getraenkeverwalter"]

def check_reserved_usernames(value: str) -> str:
    if value.lower() in RESERVERD_USER_NAMES:
        raise ValueError(f'Der Benutzername {value} ist reserviert und darf nicht verwendet werden!')
    return value

# Datentyp mit Validierungsoptionen für den Name verwendet
NameString = Annotated[
    constr(min_length=2, pattern=r"^\w+$"),
    Field(index=True, unique=True, schema_extra={"examples": ["BierBuddy200"]}),
    AfterValidator(check_reserved_usernames)
]

# Datenmodelle für die Benutzer-Endpunkte ("/users/")
class UserBase(SQLModel):
    name: NameString

class UserGet(UserBase):
    id: uuid.UUID
    guthaben: Decimal
    is_admin: bool

class UserPost(UserBase):
    password: str = Field(min_length=5, max_length=255, schema_extra={"examples": ["Geheim123!?"]})

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    guthaben: Decimal = Field(default=0, decimal_places=2)
    hashed_password: str
    is_admin: bool = Field(default=False)