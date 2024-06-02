import re
from datetime import timedelta
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from minio import Minio

from app.settings import settings
from app.tgbot.auth.dependencies import get_user_or_create_with_tg_data
from app.tgbot.event.schemas import (
    Event,
    EventBase,
    EventReportPayload,
    EventUpdatePayload,
)
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
    event_model = await event_svc.get_by_id(event_id)
    if not event_model:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event.model_validate(event_model)


@router.put("/events/{event_id}")
async def update_event(
    event_id: UUID,
    event_payload: EventUpdatePayload,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> Event:
    event_model = await event_svc.get_by_id(event_id)
    if not event_model:
        raise HTTPException(status_code=404, detail="Event not found")
    if event_model.created_by != user.id:
        raise HTTPException(status_code=403, detail="You can't update this event")

    event = await event_svc.update(event_id, event_payload)
    return event


@router.post("/events/{event_id}/report")
async def report_event(
    event_id: UUID,
    report_payload: EventReportPayload,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> Event:
    event_model = await event_svc.get_by_id(event_id)
    if not event_model:
        raise HTTPException(status_code=404, detail="Event not found")
    if event_model.created_by == user.id:
        return Event.model_validate(event_model)

    event_model = await event_svc.report(event_id, user, report_payload)
    return Event.model_validate(event_model)


@router.post("/events")
async def create_event(
    event_data: EventBase,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> Event:
    event = await event_svc.create(event_data, user)
    return event


@router.get("/events/{event_id}/get_upload_url")
async def get_upload_url(
    event_id: UUID,
    file_name: str,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> str:
    event = await event_svc.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event.created_by != user.id:
        raise HTTPException(
            status_code=403, detail="You can't upload files for this event"
        )

    # TODO: move to the lifespan hook
    s3_endpoint = re.sub(r"https?://", "", settings.S3_ENDPOINT_URL)
    is_secure = settings.S3_ENDPOINT_URL.startswith("https")
    client = Minio(
        s3_endpoint,
        secure=is_secure,
        region=settings.S3_BUCKET_REGION,
        access_key=settings.S3_ACCESS_KEY,
        secret_key=settings.S3_SECRET_KEY,
    )

    url = client.get_presigned_url(
        "PUT",
        settings.S3_BUCKET_NAME,
        f"events/{str(event.id)}/{file_name}",
        expires=timedelta(minutes=5),
    )
    return url
