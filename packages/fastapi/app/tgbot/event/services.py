from typing import Annotated, Optional, Self
from uuid import UUID

from fastapi import Depends
from geoalchemy2.functions import ST_MakePoint
from sqlalchemy import sql
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db_session
from app.models import EventModel
from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.user.schemas import User


class EventService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    @classmethod
    async def get_svc(
        cls, db: Annotated[AsyncSession, Depends(get_db_session)]
    ) -> Self:
        return cls(db)

    async def list(self, created_by: Optional[UUID] = None) -> list[Event]:
        stmt = sql.select(EventModel)
        if created_by:
            stmt = stmt.where(EventModel.created_by == created_by)
        res = await self.db.execute(stmt)
        return [Event.model_validate(row) for row in res.scalars()]

    async def get_by_id(self, event_id: UUID) -> Event:
        stmt = sql.select(EventModel).where(EventModel.id == event_id)
        res = await self.db.execute(stmt)
        return Event.model_validate(res.scalar_one())

    async def create(self, event: EventBase, user: User) -> Event:
        event_data = event.model_dump()
        if event.lat and event.lng:
            event_data["location"] = ST_MakePoint(event.lat, event.lng)

        stmt = (
            sql.insert(EventModel)
            .values(**event_data, created_by=user.id)
            .returning(EventModel)
        )
        res = await self.db.execute(stmt)
        _event = Event.model_validate(res.scalar_one())
        await self.db.commit()
        return _event
