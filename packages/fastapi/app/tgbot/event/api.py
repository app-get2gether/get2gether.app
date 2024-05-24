from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends

from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.event.services import EventService

router = APIRouter()


@router.get("/events")
async def get_events() -> list[Event]:
    from datetime import datetime, timedelta

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


@router.post("/events")
async def create_event(
    event_data: EventBase,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
) -> Event:
    event = await event_svc.create(event_data)
    return event
