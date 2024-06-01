from decimal import Decimal
from typing import Annotated, Optional, Self
from uuid import UUID

from fastapi import Depends
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_DistanceSphere, ST_MakePoint
from sqlalchemy import cast, func, sql
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import now

from app.db import get_db_session
from app.models import EventModel
from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.user.schemas import User

# hardcoded limit for list of events
DEFAULT_LIST_LIMIT = 20


class EventService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    @classmethod
    async def get_svc(
        cls, db: Annotated[AsyncSession, Depends(get_db_session)]
    ) -> Self:
        return cls(db)

    async def list(
        self,
        *,
        user_lat: Optional[Decimal] = None,
        user_lng: Optional[Decimal] = None,
        created_by: Optional[UUID] = None,
        limit: int = DEFAULT_LIST_LIMIT,
        offset: int = 0,
    ) -> list[Event]:
        # calculate score for each event based on distance and end_at
        if user_lat and user_lng:
            distance_weight = 0.5
            time_weight = 0.5
            score = (
                ST_DistanceSphere(
                    cast(EventModel.location, Geometry),
                    ST_MakePoint(user_lng, user_lat),
                )
                * distance_weight
                + (func.extract("epoch", EventModel.end_at - now()) / 3600)
                * time_weight
            ).label("score")
            stmt = sql.select(EventModel, score).order_by(score)
        else:
            stmt = sql.select(EventModel)

        if created_by:
            stmt = stmt.where(EventModel.created_by == created_by)
        if limit > DEFAULT_LIST_LIMIT:
            raise ValueError(f"Limit should be less than {DEFAULT_LIST_LIMIT}")
        stmt = stmt.limit(limit).offset(offset)

        stmt.where(EventModel.end_at > now())
        res = await self.db.execute(stmt)
        return [Event.model_validate(row) for row in res.scalars()]

    async def get_by_id(self, event_id: UUID) -> Event:
        stmt = sql.select(EventModel).where(EventModel.id == event_id)
        res = await self.db.execute(stmt)
        return Event.model_validate(res.scalar_one())

    async def create(self, event: EventBase, user: User) -> Event:
        event_data = event.model_dump()
        if event.lat and event.lng:
            event_data["location"] = ST_MakePoint(event.lng, event.lat)

        stmt = (
            sql.insert(EventModel)
            .values(**event_data, created_by=user.id)
            .returning(EventModel)
        )
        res = await self.db.execute(stmt)
        _event = Event.model_validate(res.scalar_one())
        await self.db.commit()
        return _event
