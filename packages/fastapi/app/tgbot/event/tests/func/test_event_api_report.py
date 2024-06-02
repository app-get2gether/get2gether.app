from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_200_OK

from app.tgbot.event.schemas import Event
from app.tgbot.event.services import EventService
from app.tgbot.tests.utils import generate_telegram_auth_key
from app.tgbot.user.schemas import User


async def test_report_event(
    client: AsyncClient, session: AsyncSession, event: Event, user_frank: User
) -> None:
    response = await client.post(
        f"/tgbot/v1/events/{event.id}/report",
        json={
            "reason": "Spam",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
    )

    data = response.json()
    assert response.status_code == HTTP_200_OK, data

    event_svc = EventService(session)
    updated_event_model = await event_svc.get_by_id(data["id"])
    assert updated_event_model is not None
    assert updated_event_model.reports_count == 1

    # fails on second time
    # TODO: enable back when issue with pytest_ayncio loop is fixed
    return
    response = await client.post(
        f"/tgbot/v1/events/{event.id}/report",
        json={
            "reason": "Spam",
        },
        headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
    )
