import datetime
from decimal import Decimal
import uuid

from sqlmodel import Field, SQLModel

class RechargeBase(SQLModel):
    amount: Decimal = Field(decimal_places=2, schema_extra={"examples": ["10.00"]})

class Recharge(RechargeBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    created_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.UTC))

    user_id: uuid.UUID = Field(foreign_key="user.id")