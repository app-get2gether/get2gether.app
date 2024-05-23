from sqlalchemy import BigInteger
from sqlalchemy.orm import mapped_column
from sqlalchemy.types import Boolean, String

from app.models.base import RecordModel


class UserModel(RecordModel):
    __tablename__ = "users"

    username = mapped_column(String(64), nullable=False, default="")

    # fmt: off
    tg_id            = mapped_column(BigInteger, nullable=False, unique=True, index=True)
    tg_username      = mapped_column(String(64), nullable=False, default="")
    tg_first_name    = mapped_column(String(64), nullable=False, default="")
    tg_last_name     = mapped_column(String(64), nullable=False, default="")
    tg_phone         = mapped_column(String(64), nullable=False, default="")
    tg_language_code = mapped_column(String(8), nullable=False, default="")
    tg_is_bot        = mapped_column(Boolean, nullable=False, default=False)

    is_admin      = mapped_column(Boolean, nullable=False, default=False)
    is_blocked    = mapped_column(Boolean, nullable=False, default=False)
    # fmt: on
