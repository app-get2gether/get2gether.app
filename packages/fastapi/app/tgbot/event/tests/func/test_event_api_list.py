from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from app.tgbot.event.schemas import Event
from app.tgbot.tests.utils import generate_telegram_auth_key
from app.tgbot.user.schemas import User


async def test_get_events_unauthenticated(client: AsyncClient) -> None:
    response = await client.get("/tgbot/v1/events")
    assert response.status_code == HTTP_403_FORBIDDEN


async def test_get_events_incorrect_auth_header(client: AsyncClient) -> None:
    response = await client.get("/tgbot/v1/events", headers={"x-telegram-auth": "123"})
    assert response.status_code == HTTP_403_FORBIDDEN


async def test_get_events(client: AsyncClient) -> None:
    response = await client.get(
        "/tgbot/v1/events", headers={"x-telegram-auth": generate_telegram_auth_key()}
    )
    assert response.status_code == HTTP_200_OK, response.json()


async def test_get_events_created_by_me(
    client: AsyncClient, user: User, event: Event
) -> None:
    response = await client.get(
        "/tgbot/v1/events/created_by_me",
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_200_OK, data
    assert len(data) == 1
    assert response.json()[0]["id"] == str(event.id)
