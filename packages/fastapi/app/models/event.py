from datetime import datetime, timedelta
from typing import cast

from geoalchemy2 import Geography
from sqlalchemy import CheckConstraint, String, Text
from sqlalchemy.engine.default import DefaultExecutionContext
from sqlalchemy.orm import mapped_column
from sqlalchemy.types import TIMESTAMP, Numeric

from app.models.base import RecordModel, utc_now


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
        CheckConstraint(
            "NOT((lat is NULL) <> (lng is NULL))", name="ch_events_not_xor_lat_lng"
        ),
    )

    title = mapped_column(String(64), nullable=False)
    description = mapped_column(Text(), nullable=False, default="")
    image_url = mapped_column(String(128), nullable=False, default="")

    address = mapped_column(String(256), nullable=False, default="")
    address_info = mapped_column(Text(), nullable=False, default="")
    lat = mapped_column(Numeric, nullable=True)
    lng = mapped_column(Numeric, nullable=True)
    location = mapped_column(
        Geography("POINT", 4326, spatial_index=True), nullable=True
    )  # SRID 4326, WGS84

    start_at = mapped_column(TIMESTAMP(timezone=True), nullable=False, default=utc_now)
    end_at = mapped_column(
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
        default=get_default_end_at,
    )
