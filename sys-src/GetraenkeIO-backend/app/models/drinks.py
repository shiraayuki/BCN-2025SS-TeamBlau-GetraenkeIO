import uuid
from decimal import Decimal
from typing import Annotated, Optional
import uuid
from pydantic import AfterValidator, constr, BeforeValidator
from sqlmodel import Field, SQLModel

def check_invalid_drink_counter(value: int) -> int:
    if value < 0:
        raise ValueError(f'Der Wert des Attributs count darf nicht kleiner als 0 sein!')
    return value
def check_invalid_drink_cost(value: Decimal) -> Decimal:
    if value < 0:
        raise ValueError(f'Der Wert des Attributs cost darf nicht kleiner als 0 sein!')
    return value

# Datentyp für Getränkenamen, sodass keine Unsichtbaren Getränkenamen möglich sind
DrinkName = Annotated[
    constr(min_length=1, pattern=r"^\w(.*\w)?$"),
    Field(index=True, unique=False, schema_extra={"examples": ["Augustiner Lagerbier Hell"]}),
]

DrinkCount = Annotated[
    int,
    Field(default=0),
    AfterValidator(check_invalid_drink_counter)
]

DrinkCost = Annotated[
    Decimal,
    Field(default=0, decimal_places=2),
    AfterValidator(check_invalid_drink_cost)
]

# Regex von https://dev.to/jbxamora/url-regex-1pol abgerufen am 16.06.2025 um 15:30
DrinkImageUrl = Annotated[
    constr(pattern=r"^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"),
    Field(index=False, schema_extra={"examples": ["https://cdn.pixabay.com/photo/2017/06/24/23/44/beer-2439238_1280.jpg"]})
]

# Datenmodell für das ändern einzelner Attribute
# Wenn kein Wert oder None angegeben ist bleibt der aktuelle Wert erhalten
class DrinkPut(SQLModel):
    name: Optional[DrinkName] = None
    imageUrl: Optional[DrinkImageUrl] = None
    count: Optional[DrinkCount] = None
    cost: Optional[DrinkCost] = None

# Datenmodell für das Erstellen eines Neuen Getränkeeintrags
class DrinkPost(SQLModel):
    name: DrinkName
    imageUrl: DrinkImageUrl
    count: DrinkCount
    cost: DrinkCost

# Tabelle für Getränke
class Drink(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: DrinkName
    imageUrl: DrinkImageUrl
    count: DrinkCount
    cost: DrinkCost