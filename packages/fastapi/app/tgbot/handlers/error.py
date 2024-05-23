import html
import traceback

from sqlalchemy.ext.asyncio import AsyncSession
from telegram import Update
from telegram.constants import ParseMode

from app.settings import settings
from app.tgbot.context import Context, enrich_context
from app.tgbot.utils import extract_user_data


@enrich_context
async def error_handler(db: AsyncSession, update: object, context: Context) -> None:
    if not context.error:
        raise ValueError("Context error is None")

    # Message to user
    await _message_to_user(update, context)

    # Message to logs
    if not settings.TELEGRAM_ERROR_CHAT_ID:
        return

    tb_list = traceback.format_exception(
        None, context.error, context.error.__traceback__
    )
    tb_string = "".join(tb_list)
    # Build the message with some markup and additional information about what happened.
    # You might need to add some logic to deal with messages longer than the 4096 character limit.
    message = (
        f"An exception was raised while handling an update\n"
        f"<pre>{html.escape(tb_string)}</pre>"
    )

    error_msg = "\n".join(
        [
            "<b>Spain Translator Error</b>\n",
            f"{message[:4000]}",
        ]
    )

    if isinstance(update, Update):
        user_tg_data = extract_user_data(update)
        if user_tg_data:
            user_msg = "\n".join(
                [
                    f"User: {user_tg_data.first_name} {user_tg_data.last_name}",
                    f"User telegram_id: {user_tg_data.id}",
                    f"User username: {user_tg_data.username}",
                ]
            )
            error_msg += f"\n\n{user_msg}"
    else:
        error_msg += f"\n\nupdate: {str(update)}"

    if settings.TELEGRAM_ERROR_CHAT_ID:
        await context.bot.send_message(
            chat_id=settings.TELEGRAM_ERROR_CHAT_ID,
            text=error_msg,
            parse_mode=ParseMode.HTML,
        )


async def _message_to_user(update: object, context: Context) -> None:
    if not isinstance(update, Update):
        return
    user_tg_data = extract_user_data(update)
    if not user_tg_data:
        return

    # TODO: localize
    error_msg = (
        "Oops! An error occurred while processing your request. Please try again later."
    )
    await context.bot.send_message(
        chat_id=user_tg_data.id,
        text=error_msg,
    )
