from datetime import datetime
from uuid import UUID, uuid4

from fastapi import APIRouter
from pydantic import BaseModel

from app.tgbot.auth.dependencies import UserDep

router = APIRouter()


class Event(BaseModel):
    id: UUID
    title: str
    description: str | None = None
    created_at: datetime
    start_at: datetime
    end_at: datetime


@router.get("/events")
async def get_events(user: UserDep) -> list[Event]:
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
        Event(
            id=uuid4(),
            title="Event #5",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
        Event(
            id=uuid4(),
            title="Event #6",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
        Event(
            id=uuid4(),
            title="Event #7",
            created_at=datetime.now(),
            start_at=datetime.now() + timedelta(hours=3),
            end_at=datetime.now() + timedelta(hours=4),
        ),
    ]
