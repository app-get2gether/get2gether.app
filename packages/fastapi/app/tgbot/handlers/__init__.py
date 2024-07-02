from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, WebAppInfo
from telegram.constants import ParseMode
from telegram.ext import BaseHandler, CommandHandler

from app.settings import settings
from app.tgbot.context import Context, enrich_context
from app.tgbot.utils import extract_user_data

text = r"""
Hello\!
Welcome to the *Get2Gether* bot\.
This bot helps you to find events near your or create your own event\.
Participating in events is a great way to meet new people and make new friends\.
Also you can earn GET Tokens by participating in events\.

Let's get started\!
"""


@enrich_context
async def start(db: AsyncSession, update: Update, context: Context) -> None:
    user_data = extract_user_data(update)
    if user_data is None:
        raise ValueError("User data is None")

    chat = update.effective_chat
    if not chat:
        return
    await chat.send_photo(
        photo=f"{settings.S3_ENDPOINT_URL}/{settings.S3_BUCKET_NAME}/media/logo.png",
        caption=text,
        parse_mode=ParseMode.MARKDOWN_V2,
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
