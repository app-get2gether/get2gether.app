from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_200_OK

from app.tgbot.event.schemas import Event, EventCreatePayload
from app.tgbot.event.services import EventService
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


async def test_create_event_ticket_fails_no_tickets(
    client: AsyncClient,
    session: AsyncSession,
    user: User,
    user_frank: User,
) -> None:
    event_svc = EventService(session)
    event_model = await event_svc.create(
        EventCreatePayload(title="My event", ticket_count=0),
        user,
    )

    try:
        await client.post(
            f"/tgbot/v1/events/{event_model.id}/tickets",
            headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
        )
        AssertionError("Should fail that no ticket left")
    except ValueError as e:
        assert str(e) == "Ticket type is sold out"
    finally:
        await session.rollback()


async def test_create_event_ticket_fails_no_funds(
    client: AsyncClient,
    session: AsyncSession,
    user: User,
    user_frank: User,
) -> None:
    event_svc = EventService(session)
    event_model = await event_svc.create(
        EventCreatePayload(title="My event", ticket_price=5 * 10**5),
        user,
    )

    try:
        await client.post(
            f"/tgbot/v1/events/{event_model.id}/tickets",
            headers={"x-telegram-auth": generate_telegram_auth_key(user_frank.tg_id)},
        )
        AssertionError("Should fail with price too high")
    except ValueError as e:
        assert str(e) == "Not enough funds"
    finally:
        await session.rollback()
