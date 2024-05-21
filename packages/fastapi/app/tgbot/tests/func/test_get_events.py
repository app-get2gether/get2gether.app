from fastapi.testclient import TestClient
from starlette.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from app.tgbot.tests.utils import generate_telegram_auth_key


def test_get_events_unauthenticated(client: TestClient) -> None:
    response = client.get("/tgbot/v1/events")
    assert response.status_code == HTTP_403_FORBIDDEN


def test_get_events_incorrect_auth_header(client: TestClient) -> None:
    response = client.get("/tgbot/v1/events", headers={"x-telegram-auth": "123"})
    assert response.status_code == HTTP_403_FORBIDDEN


def test_get_events(client: TestClient) -> None:
    response = client.get(
        "/tgbot/v1/events", headers={"x-telegram-auth": generate_telegram_auth_key()}
    )
    assert response.status_code == HTTP_200_OK
