from telegram import Update

from app.tgbot.user.schemas import UserTgData


def extract_user_data(update: Update) -> UserTgData | None:
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

    return UserTgData(**user.to_dict())
