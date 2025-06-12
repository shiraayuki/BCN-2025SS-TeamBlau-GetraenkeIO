import uuid
from sqlmodel import Field, SQLModel
from app.models.drinks import DrinkCost, DrinkImageUrl, DrinkName

# Datenmodell zum Zurückgabe der Attribute des Getränks
class DrinkHistoryGet(SQLModel):
    name: DrinkName
    imageUrl: DrinkImageUrl
    cost: DrinkCost

# Tabelle mit allen Versionen von gekauften Getränken
class DrinkHistory(DrinkHistoryGet, table = True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)