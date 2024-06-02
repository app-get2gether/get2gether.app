from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import (
    HTTP_200_OK,
    HTTP_403_FORBIDDEN,
)

from app.tgbot.event.schemas import Event
from app.tgbot.event.services import EventService
from app.tgbot.tests.utils import generate_telegram_auth_key
from app.tgbot.user.schemas import User


async def test_update_event(
    client: AsyncClient, session: AsyncSession, event: Event, user: User
) -> None:
    image_url = "event_image.jpg"
    response = await client.put(
        f"/tgbot/v1/events/{event.id}",
        json={
            "image_url": image_url,
        },
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    assert response.status_code == HTTP_200_OK, response.json()

    data = response.json()
    event_svc = EventService(session)
    updated_event = await event_svc.get_by_id(data["id"])
    assert updated_event is not None
    assert str(updated_event.image_url) == data["image_url"]

    title = "No update"
    response = await client.put(
        f"/tgbot/v1/events/{event.id}",
        json={
            "title": title,
        },
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    assert response.status_code == HTTP_200_OK, response.json()
    data = response.json()
    updated_event = await event_svc.get_by_id(data["id"])
    assert updated_event is not None
    assert str(updated_event.title) != title
    assert str(updated_event.image_url) == image_url

    # remove image
    response = await client.put(
        f"/tgbot/v1/events/{event.id}",
        json={
            "image_url": "",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    assert response.status_code == HTTP_200_OK, response.json()
    data = response.json()
    updated_event = await event_svc.get_by_id(data["id"])
    assert updated_event is not None
    assert str(updated_event.title) != title
    assert str(updated_event.image_url) == ""


async def test_update_event_fails_not_owner(
    client: AsyncClient, session: AsyncSession, event: Event
) -> None:
    response = await client.put(
        f"/tgbot/v1/events/{event.id}",
        json={
            "image_url": "event_image.jpg",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key()},
    )

    assert response.status_code == HTTP_403_FORBIDDEN, response.json()
