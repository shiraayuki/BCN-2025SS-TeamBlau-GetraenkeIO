import uuid
from decimal import Decimal
from typing import Annotated, Optional
import uuid
from pydantic import AfterValidator, constr, BeforeValidator
from sqlmodel import Field, SQLModel

def check_invalid_drink_counter(value: int) -> int:
    if value < 0:
        raise ValueError(f'Der Wert des Attributs cout darf nicht kleiner als 0 sein!')
    return value
def check_invalid_drink_cost(value: Decimal) -> Decimal:
    if value < 0:
        raise ValueError(f'Der Wert des Attributs cost darf nicht kleiner als 0 sein!')
    return value

# Datentyp für Getränkenamen, sodass keine Unsichtbaren Getränkenamen möglich sind
DrinkName = Annotated[
    constr(min_length=1, pattern=r"^\w(.*\w)?$"),
    Field(index=True, unique=True, schema_extra={"examples": ["Augustiner Lagerbier Hell"]}),
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

# Datenmodell für das ändern einzelner Attribute
# Wenn kein Wert oder None angegeben ist bleibt der aktuelle Wert erhalten
class DrinkPut(SQLModel):
    name: Optional[DrinkName] = None
    count: Optional[DrinkCount] = None
    cost: Optional[DrinkCost] = None

# Datenmodell für das Erstellen eines Neuen Getränkeeintrags
class DrinkPost(SQLModel):
    name: DrinkName
    count: DrinkCount
    cost: DrinkCost

# Tabelle für Getränke
class Drink(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: DrinkName
    count: DrinkCount
    cost: DrinkCost