from decimal import Decimal
from typing import Annotated, Optional, Self, Tuple
from uuid import UUID

from fastapi import Depends
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_DistanceSphere, ST_MakePoint
from sqlalchemy import cast, func, sql
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.functions import now

from app.db import get_db_session
from app.models import EventModel
from app.models.event import (
    EventBankModel,
    EventPurchasedTicketModel,
    EventReportModel,
    EventTicketTypeModel,
    TicketCurrency,
    TicketType,
)
from app.tgbot.event.schemas import (
    Event,
    EventCreatePayload,
    EventReportPayload,
    EventUpdatePayload,
)
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

    async def get_by_id(self, event_id: UUID) -> EventModel | None:
        """
        @return SQLAlchemy model
        """
        stmt = sql.select(EventModel).where(EventModel.id == event_id)
        res = await self.db.execute(stmt)
        event_model = res.scalar_one_or_none()
        if not event_model:
            return None
        return event_model

    async def create(self, event_payload: EventCreatePayload, user: User) -> EventModel:
        event_data = event_payload.dict(exclude_unset=True)
        if event_payload.lat and event_payload.lng:
            event_data["location"] = ST_MakePoint(event_payload.lng, event_payload.lat)

        stmt = (
            sql.insert(EventModel)
            .values(**event_data, created_by=user.id)
            .returning(EventModel)
        )
        res = await self.db.execute(stmt)
        event_model = res.scalar_one()
        ticket_type_stmt = sql.insert(EventTicketTypeModel).values(
            event_id=event_model.id, price=event_payload.ticket_price
        )
        await self.db.execute(ticket_type_stmt)
        await self.db.commit()
        return event_model

    async def update(self, event_id: UUID, event_payload: EventUpdatePayload) -> Event:
        stmt = (
            sql.update(EventModel)
            .where(EventModel.id == event_id)
            .values(**event_payload.model_dump(exclude_unset=True))
            .returning(EventModel)
        )
        res = await self.db.execute(stmt)
        await self.db.commit()
        return Event.model_validate(res.scalar_one())

    async def report(
        self, event_id: UUID, reported_by: User, report_payload: EventReportPayload
    ) -> EventModel:
        """
        @return SQLAlchemy model
        """
        try:
            stmt_get = sql.select(EventReportModel).where(
                EventReportModel.event_id == event_id,
                EventReportModel.reported_by == reported_by.id,
            )
            res = await self.db.execute(stmt_get)
            if res.scalar_one_or_none():
                raise ValueError("You have already reported this event")

            stmt_insert = sql.insert(EventReportModel).values(
                event_id=event_id,
                reported_by=reported_by.id,
                **report_payload.model_dump(exclude_unset=True),
            )
            await self.db.execute(stmt_insert)

            stmt_update = (
                sql.update(EventModel)
                .where(EventModel.id == event_id)
                .values(reports_count=EventModel.reports_count + 1)
                .returning(EventModel)
            )
            res_update = await self.db.execute(stmt_update)
            await self.db.commit()
            return res_update.scalar_one()
        except:
            await self.db.rollback()
            raise

    async def purchase_ticket(
        self, event_id: UUID, user: User, ticket_type: TicketType = TicketType.REGULAR
    ) -> Tuple[EventPurchasedTicketModel, EventTicketTypeModel]:
        """
        At this moment purchasing ticket supports only offchain
        """
        try:
            # get event
            stmt_get = sql.select(EventModel).where(
                EventModel.id == event_id,
                EventModel.end_at > now(),
            )
            res_event = await self.db.execute(stmt_get)
            event_model = res_event.scalar_one_or_none()
            if not event_model:
                raise ValueError("Event is not active")

            # get ticket type
            stmt_get_ticket_type = sql.select(EventTicketTypeModel).where(
                EventTicketTypeModel.event_id == event_model.id,
                EventTicketTypeModel.ticket_type == ticket_type,
                # only GET jettons are supported
                EventTicketTypeModel.currency == TicketCurrency.GET,
            )
            res_ticket_type = await self.db.execute(stmt_get_ticket_type)
            ticket_type_model = res_ticket_type.scalar_one_or_none()
            if not ticket_type_model:
                raise ValueError("Ticket type is not available")

            if (
                ticket_type_model.total_count != -1
                and ticket_type_model.sold_count >= ticket_type_model.total_count
            ):
                raise ValueError("Ticket type is sold out")

            if ticket_type_model.price > user.offchain_funds:
                raise ValueError("Not enough funds")

            # purchase ticket
            stmt_create_ticket = (
                sql.insert(EventPurchasedTicketModel)
                .values(
                    event_id=event_id,
                    owned_by=user.id,
                    ticket_type_id=ticket_type_model.id,
                )
                .returning(EventPurchasedTicketModel)
            )
            res_purchased_ticket = await self.db.execute(stmt_create_ticket)
            purchased_ticket_model = res_purchased_ticket.scalar_one()

            # update event bank
            stmt_upsert_event_bank = (
                insert(EventBankModel)
                .values(
                    event_id=event_model.id,
                    total_offchain_funds=purchased_ticket_model.price,
                )
                .on_conflict_do_update(
                    index_elements=[EventBankModel.event_id],
                    set_={
                        "total_offchain_funds": EventBankModel.total_offchain_funds
                        + purchased_ticket_model.price
                    },
                )
            )
            await self.db.execute(stmt_upsert_event_bank)

            await self.db.commit()
            return purchased_ticket_model, ticket_type_model
        except:
            await self.db.rollback()
            raise
