from datetime import datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EventBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: Annotated[str, Field(min_length=5, max_length=64)]
    description: Annotated[str | None, Field(max_length=4096)] = ""

    lat: Decimal | None = None
    lng: Decimal | None = None


class Event(EventBase):
    id: UUID

    created_at: datetime
    start_at: datetime
    end_at: datetime
