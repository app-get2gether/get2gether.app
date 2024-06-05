import enum
from datetime import datetime, timedelta
from typing import cast

from geoalchemy2 import Geography
from sqlalchemy import BigInteger, CheckConstraint, ForeignKey, Index, UniqueConstraint
from sqlalchemy.engine.default import DefaultExecutionContext
from sqlalchemy.orm import mapped_column
from sqlalchemy.types import TIMESTAMP, Boolean, Enum, Integer, Numeric, String, Text

from app.models.base import PostgresUUID, RecordModel, utc_now


def get_default_end_at(ctx: DefaultExecutionContext) -> datetime:
    """
    Set end_at shift(3 hours) ahead from start_at by default
    """
    shift = {"hours": 3}

    params = ctx.current_parameters
    assert params is not None, "ctx.current_parameters couldn't be None"
    start_at = cast(datetime, params.get("start_at", utc_now()))
    return start_at + timedelta(**shift)


class EventModel(RecordModel):
    __tablename__ = "events"
    __table_args__ = (
        Index("ix_events_created_by", "created_by"),
        Index("ix_events_end_at", "end_at"),
        Index("ix_events_location", "location", postgresql_using="gist"),
        CheckConstraint(
            "NOT((lat is NULL) <> (lng is NULL))", name="ch_events_not_xor_lat_lng"
        ),
    )
    created_by = mapped_column(PostgresUUID, ForeignKey("users.id"), nullable=False)

    title = mapped_column(String(64), nullable=False)
    description = mapped_column(Text(), nullable=False, default="")
    image_url = mapped_column(String(128), nullable=False, default="")

    address = mapped_column(String(256), nullable=False, default="")
    address_info = mapped_column(Text(), nullable=False, default="")
    lat = mapped_column(Numeric, nullable=True)
    lng = mapped_column(Numeric, nullable=True)
    location = mapped_column(
        Geography("POINT", 4326, spatial_index=False), nullable=True
    )  # SRID 4326, WGS84

    members_count = mapped_column(Integer, nullable=False, default=1)
    reports_count = mapped_column(Integer, nullable=False, default=0)

    start_at = mapped_column(TIMESTAMP(timezone=True), nullable=False, default=utc_now)
    end_at = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=get_default_end_at,
    )


class EventReportModel(RecordModel):
    __tablename__ = "event_reports"
    __table_args__ = (
        Index("ix_event_reports_event_id", "event_id"),
        Index("ix_event_reports_reported_by", "reported_by"),
        UniqueConstraint(
            "event_id", "reported_by", name="uq_event_reports_event_id_reported_by"
        ),
    )
    event_id = mapped_column(PostgresUUID, ForeignKey("events.id"), nullable=False)
    reported_by = mapped_column(PostgresUUID, ForeignKey("users.id"), nullable=False)
    reason = mapped_column(Text(), nullable=False, default="")


class TicketType(enum.Enum):
    REGULAR = "regular"


class TicketCurrency(enum.Enum):
    GET = "GET"


class EventTicketTypeModel(RecordModel):
    __tablename__ = "event_ticket_types"
    __table_args__ = (
        Index("ix_event_ticket_types_event_id", "event_id"),
        CheckConstraint("total_count >= -1", name="ck_event_ticket_types_total_count"),
        CheckConstraint("sold_count >= 0", name="ck_event_ticket_types_sold_count"),
        CheckConstraint("price >= 0", name="ck_event_ticket_types_price"),
    )

    event_id = mapped_column(PostgresUUID, ForeignKey("events.id"), nullable=False)
    ticket_type = mapped_column(
        Enum(TicketType), nullable=False, default=TicketType.REGULAR
    )
    price = mapped_column(BigInteger, nullable=False, default=0)
    currency = mapped_column(
        Enum(TicketCurrency), nullable=False, default=TicketCurrency.GET
    )
    total_count = mapped_column(Integer, nullable=False, default=-1)
    sold_count = mapped_column(Integer, nullable=False, default=0)


class TicketOnChainStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class EventPurchasedTicketModel(RecordModel):
    __tablename__ = "event_purchased_tickets"
    __table_args__ = (
        Index("ix_event_purchased_tickets_event_id", "event_id"),
        Index("ix_event_purchased_tickets_owned_by", "owned_by"),
        CheckConstraint("price >= 0", name="ck_event_purchased_tickets_price"),
        CheckConstraint(
            "is_onchain = TRUE OR onchain_status IS NULL",
            name="ck_event_purchased_tickets_onchain_status",
        ),
    )

    event_id = mapped_column(PostgresUUID, ForeignKey("events.id"), nullable=False)
    ticket_type_id = mapped_column(
        PostgresUUID, ForeignKey("event_ticket_types.id"), nullable=False
    )
    owned_by = mapped_column(PostgresUUID, ForeignKey("users.id"), nullable=False)
    price = mapped_column(BigInteger, nullable=False, default=0)

    # if tickets were bought on-chain
    is_onchain = mapped_column(Boolean, nullable=False, default=False)
    onchain_status = mapped_column(Enum(TicketOnChainStatus), nullable=True)


class EventBankModel(RecordModel):
    __tablename__ = "event_banks"
    __table_args__ = (
        Index("ix_event_banks_event_id", "event_id"),
        CheckConstraint(
            "total_offchain_funds >= withdrawn_offchain_funds",
            name="ck_event_banks_total_offchain_funds",
        ),
        CheckConstraint(
            "total_onchain_funds >= withdrawn_onchain_funds",
            name="ck_event_banks_total_onchain_funds",
        ),
    )

    event_id = mapped_column(
        PostgresUUID, ForeignKey("events.id"), unique=True, nullable=False
    )
    is_locked = mapped_column(Boolean, nullable=False, default=True)

    total_offchain_funds = mapped_column(BigInteger, nullable=False, default=0)
    total_onchain_funds = mapped_column(BigInteger, nullable=False, default=0)

    withdrawn_offchain_funds = mapped_column(BigInteger, nullable=False, default=0)
    withdrawn_onchain_funds = mapped_column(BigInteger, nullable=False, default=0)
