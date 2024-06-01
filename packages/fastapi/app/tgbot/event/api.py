from decimal import Decimal
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.tgbot.auth.dependencies import get_user_or_create_with_tg_data
from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.event.services import EventService
from app.tgbot.user.schemas import User

router = APIRouter()


@router.get("/events")
async def list_events(
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    lat: Decimal | None = None,
    lng: Decimal | None = None,
) -> list[Event]:
    return await event_svc.list(user_lat=lat, user_lng=lng)


@router.get("/events/created_by_me")
async def list_events_created_by_me(
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> list[Event]:
    return await event_svc.list(created_by=user.id)


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
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> Event:
    event = await event_svc.create(event_data, user)
    return event
