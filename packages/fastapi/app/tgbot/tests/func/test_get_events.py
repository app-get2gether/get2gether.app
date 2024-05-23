from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from app.tgbot.tests.utils import generate_telegram_auth_key


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
