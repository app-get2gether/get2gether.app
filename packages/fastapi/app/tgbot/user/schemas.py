from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str | None

    tg_id: int
    tg_username: str
    tg_first_name: str
    tg_last_name: str
    tg_phone: str
    tg_language_code: str
    tg_is_bot: bool

    is_admin: bool
    is_blocked: bool


class UserTgData(BaseModel):
    id: Annotated[int, Field(serialization_alias="tg_id")]
    username: Annotated[str, Field(serialization_alias="tg_username")] = ""
    first_name: Annotated[str, Field(serialization_alias="tg_first_name")] = ""
    last_name: Annotated[str, Field(serialization_alias="tg_last_name")] = ""
    language_code: Annotated[str, Field(serialization_alias="tg_language_code")] = ""
    is_bot: Annotated[bool, Field(serialization_alias="tg_is_bot")] = False
