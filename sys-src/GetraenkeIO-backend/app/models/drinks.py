import uuid
from decimal import Decimal
from typing import Annotated, Optional
import uuid
from pydantic import AfterValidator, constr
from sqlmodel import Field, SQLModel

# Datentyp für Getränkenamen, sodass keine Unsichtbaren Getränkenamen möglich sind
DrinkName = Annotated[
    constr(min_length=1, pattern=r"^\w(.*\w)?$"),
    Field(index=True, unique=True, schema_extra={"examples": ["Augustiner Lagerbier Hell"]}),
]

# Datenmodell für das ändern einzelner Attribute
# Wenn kein Wert oder None angegeben ist bleibt der aktuelle Wert erhalten
class DrinkPut(SQLModel):
    name: Optional[DrinkName] = None
    count: Optional[int] = None
    cost: Optional[Decimal] = None

# Datenmodell für das Erstellen eines Neuen Getränkeeintrags
class DrinkPost(SQLModel):
    name: DrinkName
    count: int
    cost: Decimal

# Tabelle für Getränke
class Drink(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: DrinkName
    count: int = Field(default=0)
    cost: Decimal = Field(default=0, decimal_places=2)