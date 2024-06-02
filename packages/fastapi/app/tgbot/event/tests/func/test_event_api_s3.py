from faker import Faker
from httpx import AsyncClient
from starlette.status import (
    HTTP_200_OK,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY,
)

from app.tgbot.event.schemas import Event
from app.tgbot.tests.utils import generate_telegram_auth_key
from app.tgbot.user.schemas import User

faker = Faker()


async def test_get_event_upload_url(
    client: AsyncClient, user: User, event: Event
) -> None:
    response = await client.get(
        f"/tgbot/v1/events/{event.id}/get_upload_url?file_name=test.jpg",
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_200_OK, data


async def test_get_event_upload_url_fails_without_filename(
    client: AsyncClient, user: User, event: Event
) -> None:
    response = await client.get(
        f"/tgbot/v1/events/{event.id}/get_upload_url",
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY, data


async def test_get_event_upload_url_fails_without_correct_event(
    client: AsyncClient, user: User
) -> None:
    response = await client.get(
        f"/tgbot/v1/events/{str(faker.uuid4())}/get_upload_url?file_name=test.jpg",
        headers={"x-telegram-auth": generate_telegram_auth_key(user.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_404_NOT_FOUND
    assert data == {"detail": "Event not found"}


async def test_get_event_upload_url_fails_as_non_owner(
    client: AsyncClient, user_frank: User, event: Event
) -> None:
    response = await client.get(
        f"/tgbot/v1/events/{event.id}/get_upload_url?file_name=test.jpg",
        headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_403_FORBIDDEN
    assert data == {"detail": "You can't upload files for this event"}
