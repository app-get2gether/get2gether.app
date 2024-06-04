from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, WebAppInfo
from telegram.ext import BaseHandler, CommandHandler

from app.settings import settings
from app.tgbot.context import Context, enrich_context
from app.tgbot.utils import extract_user_data


@enrich_context
async def start(db: AsyncSession, update: Update, context: Context) -> None:
    user_data = extract_user_data(update)
    if user_data is None:
        raise ValueError("User data is None")

    chat = update.effective_chat
    if not chat:
        return
    await chat.send_message(
        "Hello",
        reply_markup=InlineKeyboardMarkup(
            [
                [
                    InlineKeyboardButton(
                        "Open app",
                        web_app=WebAppInfo(url=f"{settings.WEBAPP_URL}/tgbot/events"),
                    )
                ]
            ]
        ),
    )


handlers: List[BaseHandler[Update, Context]] = [
    CommandHandler("start", start),
]
