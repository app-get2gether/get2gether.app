from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    lat: Decimal | None
    lng: Decimal | None


class Event(EventBase):
    id: UUID
