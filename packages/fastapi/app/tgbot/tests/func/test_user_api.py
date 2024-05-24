from httpx import AsyncClient
from starlette.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from app.tgbot.tests.utils import generate_telegram_auth_key


async def test_me_unathorized(client: AsyncClient) -> None:
    response = await client.get("/tgbot/v1/me")
    assert response.status_code == HTTP_403_FORBIDDEN


async def test_me(client: AsyncClient) -> None:
    tg_id = -72138117
    response = await client.get(
        "/tgbot/v1/me", headers={"x-telegram-auth": generate_telegram_auth_key(tg_id)}
    )

    data = response.json()
    assert response.status_code == HTTP_200_OK, data
    assert data["tg_id"] == tg_id


async def test_update_username(client: AsyncClient) -> None:
    response = await client.post(
        "/tgbot/v1/me/username",
        json={"username": "Bob"},
        headers={"x-telegram-auth": generate_telegram_auth_key()},
    )

    data = response.json()
    assert response.status_code == HTTP_200_OK, data
    assert data["username"] == "Bob"
