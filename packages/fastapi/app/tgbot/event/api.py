from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.event.services import EventService

router = APIRouter()


@router.get("/events")
async def get_events(
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
) -> list[Event]:
    return await event_svc.list()


@router.get("/events/{event_id}")
async def get_event(
    event_id: UUID,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
) -> Event | None:
    return await event_svc.get_by_id(event_id)


@router.post("/events")
async def create_event(
    event_data: EventBase,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
) -> Event:
    event = await event_svc.create(event_data)
    return event
