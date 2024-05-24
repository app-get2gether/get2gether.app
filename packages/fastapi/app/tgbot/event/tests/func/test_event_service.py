import pytest
import sqlalchemy
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession

from app.tgbot.event.schemas import EventBase
from app.tgbot.event.services import EventService

faker = Faker()


async def test_create_event(session: AsyncSession) -> None:
    event_svc = EventService(session)
    lat = faker.latitude()
    lng = faker.longitude()
    title = "TestEvent"
    event = await event_svc.create(
        EventBase.model_validate({"title": title, "lat": lat, "lng": lng})
    )

    assert event.title == title
    assert event.lat == lat
    assert event.lng == lng

    # creates without coords
    await event_svc.create(EventBase.model_validate({"title": title}))


@pytest.mark.skip(reason="issue with pytest-asyncio event_loops per scope")
async def test_create_event_fails_on_missed_coords(session: AsyncSession) -> None:
    event_svc = EventService(session)
    with pytest.raises(sqlalchemy.exc.IntegrityError) as e:
        await event_svc.create(EventBase.model_validate({"lat": faker.latitude()}))

    assert "asyncpg.exceptions.CheckViolationError" in str(e.value)
    assert "ck_events_ch_events_not_xor_lat_lng" in str(e.value)

    with pytest.raises(sqlalchemy.exc.IntegrityError) as e:
        await event_svc.create(EventBase.model_validate({"lng": faker.longitude()}))

    assert "asyncpg.exceptions.CheckViolationError" in str(e.value)
    assert "ck_events_ch_events_not_xor_lat_lng" in str(e.value)