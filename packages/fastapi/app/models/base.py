from datetime import UTC, datetime
from typing import cast
from uuid import UUID, uuid4

import sqlalchemy
from sqlalchemy import MetaData
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import DeclarativeBase, Mapped, MappedColumn, mapped_column
from sqlalchemy.types import TIMESTAMP


def utc_now() -> datetime:
    return datetime.now(UTC)


"""
https://docs.sqlalchemy.org/en/20/core/constraints.html#configuring-a-naming-convention-for-a-metadata-collection

pkey for a Primary Key constraint
key for a Unique constraint
excl for an Exclusion constraint
idx for any other kind of index
fkey for a Foreign key
check for a Check constraint
seq for all sequences
"""
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_N_label)s",
        "uq": "uq_%(table_name)s_%(column_0_N_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(referred_table_name)s_%(column_0_N_name)s",
        "pk": "pk_%(table_name)s",
    }
)

# See https://github.com/dropbox/sqlalchemy-stubs/issues/94
PostgresUUID = cast(
    sqlalchemy.types.TypeEngine[UUID],
    postgresql.UUID(as_uuid=True),
)


class BaseModel(DeclarativeBase):
    __abstract__ = True

    metadata = metadata


class TimestampModel(BaseModel):
    __abstract__ = True

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, default=utc_now
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), onupdate=utc_now, nullable=True, default=None
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True), nullable=True, default=None
    )


class RecordModel(TimestampModel):
    __abstract__ = True

    id: MappedColumn[UUID] = mapped_column(
        PostgresUUID, primary_key=True, default=uuid4
    )
