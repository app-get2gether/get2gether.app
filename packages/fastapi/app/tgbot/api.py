from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Event(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    created_at: datetime
    start_at: datetime
    end_at: datetime


@router.get("/events")
async def get_events() -> list[Event]:
    from datetime import timedelta

    return [
        Event(
            id=uuid4(),
            title="Event #1",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
        Event(
            id=uuid4(),
            title="Event #2",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
        Event(
            id=uuid4(),
            title="Event #3",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
        Event(
            id=uuid4(),
            title="Event #4",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
    ]
