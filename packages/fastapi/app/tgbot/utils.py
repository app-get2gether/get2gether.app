from typing import Annotated

from pydantic import BaseModel, Field
from telegram import Update


# TODO: move to the Pydantic models file
class UserData(BaseModel):
    telegram_id: Annotated[int, Field(validation_alias="id")]
    username: str = ""
    first_name: str = ""
    last_name: str = ""
    language_code: str = ""
    is_bot: bool = False


def extract_user_data(update: Update) -> UserData | None:
    try:
        user = next(
            getattr(update, attr)
            for attr in [
                "message",
                "inline_query",
                "chosen_inline_result",
                "callback_query",
                "poll",
                "poll_answer",
            ]
            if hasattr(update, attr)
        ).from_user
    except StopIteration:
        return None

    return UserData(**user.to_dict())
