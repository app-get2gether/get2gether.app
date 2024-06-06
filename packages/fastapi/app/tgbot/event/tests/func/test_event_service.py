import sqlalchemy
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession

from app.tgbot.event.schemas import EventCreatePayload
from app.tgbot.event.services import EventService
from app.tgbot.user.schemas import User

faker = Faker()


async def test_create_event(session: AsyncSession, user: User) -> None:
    event_svc = EventService(session)
    lat = faker.latitude()
    lng = faker.longitude()
    title = "TestEvent"
    event = await event_svc.create(
        EventCreatePayload.model_validate({"title": title, "lat": lat, "lng": lng}),
        user,
    )

    assert event.title == title
    assert event.lat == lat
    assert event.lng == lng

    # creates without coords
    await event_svc.create(EventCreatePayload.model_validate({"title": title}), user)


# @pytest.mark.skip(reason="issue with pytest-asyncio event_loops per scope")
async def test_create_event_fails_on_missed_coords(
    session: AsyncSession, user: User
) -> None:
    event_svc = EventService(session)
    try:
        await event_svc.create(
            EventCreatePayload.model_validate(
                {"title": "TestEvent", "lat": faker.latitude()}
            ),
            user,
        )
        raise AssertionError("expected IntegrityError")
    except sqlalchemy.exc.IntegrityError as e:
        assert "asyncpg.exceptions.CheckViolationError" in str(e)
        assert "ck_events_ch_events_not_xor_lat_lng" in str(e)
    finally:
        await session.rollback()

    try:
        await event_svc.create(
            EventCreatePayload.model_validate(
                {"title": "TestEvent", "lng": faker.longitude()}
            ),
            user,
        )
        raise AssertionError("expected IntegrityError")
    except sqlalchemy.exc.IntegrityError as e:
        assert "asyncpg.exceptions.CheckViolationError" in str(e)
        assert "ck_events_ch_events_not_xor_lat_lng" in str(e)
    finally:
        await session.rollback()
