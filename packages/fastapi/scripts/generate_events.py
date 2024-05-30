import asyncio

from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import create_async_engine
from app.settings import settings
from app.tgbot.event.schemas import EventBase
from app.tgbot.event.services import EventService

AMOUNT = 10000


async def generate_events() -> None:
    """
    Script populate database with multiple faked events
    for development and testing purposes
    """
    faker = Faker()
    engine = create_async_engine(settings.DATABASE_URL, "script::generate_events")
    session = AsyncSession(engine)
    event_svc = EventService(session)
    for i in range(AMOUNT):
        lat = faker.latitude()
        lng = faker.longitude()
        title = faker.title()
        description = faker.text()
        address = faker.address()
        address_info = faker.text()

        await event_svc.create(
            EventBase.model_validate(
                {
                    "lat": lat,
                    "lng": lng,
                    "title": title,
                    "description": description,
                    "address": address,
                    "address_info": address_info,
                }
            )
        )
        print(f"{i}: {lat}, {lng}")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(generate_events())
