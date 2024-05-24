from geoalchemy2 import Geography
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import mapped_column
from sqlalchemy.types import Numeric

from app.models.base import RecordModel


class EventModel(RecordModel):
    __tablename__ = "events"
    __table_args__ = (
        CheckConstraint(
            "NOT((lat is NULL) <> (lng is NULL))", name="ch_events_not_xor_lat_lng"
        ),
    )

    lat = mapped_column(Numeric, nullable=True)
    lng = mapped_column(Numeric, nullable=True)
    location = mapped_column(
        Geography("POINT", 4326, spatial_index=True), nullable=True
    )  # SRID 4326, WGS84
