from geoalchemy2.functions import ST_MakePoint
from sqlalchemy import sql
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import EventModel
from app.tgbot.event.schemas import Event, EventBase


class EventService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, event: EventBase) -> Event:
        stmt = (
            sql.insert(EventModel)
            .values(
                **{
                    "lat": event.lat,
                    "lng": event.lng,
                    "location": ST_MakePoint(event.lat, event.lng),
                }
            )
            .returning(EventModel)
        )
        res = await self.db.execute(stmt)
        _event = Event.model_validate(res.scalar_one())
        await self.db.commit()
        return _event
