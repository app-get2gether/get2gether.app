from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_200_OK

from app.tgbot.event.schemas import Event
from app.tgbot.tests.utils import generate_telegram_auth_key
from app.tgbot.user.schemas import User


async def test_create_event_ticket(
    client: AsyncClient, session: AsyncSession, event: Event, user_frank: User
) -> None:
    response = await client.post(
        f"/tgbot/v1/events/{event.id}/tickets",
        headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
    )

    assert response.status_code == HTTP_200_OK, response.json()
