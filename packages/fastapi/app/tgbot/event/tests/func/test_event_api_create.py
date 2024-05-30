from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_200_OK, HTTP_422_UNPROCESSABLE_ENTITY

from app.tgbot.event.services import EventService
from app.tgbot.tests.utils import generate_telegram_auth_key


async def test_create_event(client: AsyncClient, session: AsyncSession) -> None:
    response = await client.post(
        "/tgbot/v1/events",
        json={
            "title": "My event",
            "description": "Party place",
            "address": "San Francisco, Google office",
            "lat": 37.7938396,
            "lng": -122.3947187,
            "address_info": "Go to the left, jump and call",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key()},
    )

    event_svc = EventService(session)
    assert response.status_code == HTTP_200_OK, response.json()

    data = response.json()
    event = await event_svc.get_by_id(data["id"])
    assert str(event.id) == data["id"]


async def test_create_event_without_title(client: AsyncClient) -> None:
    response = await client.post(
        "/tgbot/v1/events",
        json={
            "description": "Party place without title",
            "address": "San Francisco, Google office",
            "lat": 37.7938396,
            "lng": -122.3947187,
            "address_info": "Go to the left, jump and call",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key()},
    )
    data = response.json()
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY, data
    assert data["detail"][0]["msg"] == "Field required"
