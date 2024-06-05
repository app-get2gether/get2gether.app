import asyncio

from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import create_async_engine
from app.settings import settings
from app.tgbot.event.schemas import EventCreatePayload
from app.tgbot.event.services import EventService
from app.tgbot.user.schemas import UserTgData
from app.tgbot.user.services import UserService

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
    user_svc = UserService(session)
    tg_id = -332143144
    user = await user_svc.get_by_tg_id(tg_id)
    if not user:
        user = await user_svc.create_with_tg_data(
            UserTgData.model_validate(
                {"username": "script::generate_events", "id": -332143144}
            )
        )
    for i in range(AMOUNT):
        lat = faker.latitude()
        lng = faker.longitude()
        title = faker.text(20)
        description = faker.text()
        address = faker.address()
        address_info = faker.text()

        await event_svc.create(
            EventCreatePayload.model_validate(
                {
                    "lat": lat,
                    "lng": lng,
                    "title": title,
                    "description": description,
                    "address": address,
                    "address_info": address_info,
                }
            ),
            user,
        )
        print(f"{i}: {lat}, {lng}")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(generate_events())
