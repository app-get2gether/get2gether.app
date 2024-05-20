from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from telegram import BotCommand
from telegram.ext import Application, ApplicationBuilder, ContextTypes, ExtBot

from app.settings import settings
from app.tgbot.context import AnyDict, Context
from app.tgbot.handlers import handlers
from app.tgbot.handlers.error import error_handler


@asynccontextmanager
async def start_tg_app(
    sessionmaker: async_sessionmaker[AsyncSession],
) -> AsyncIterator[Application[ExtBot[None], Context, AnyDict, AnyDict, AnyDict, None]]:
    builder = (
        ApplicationBuilder()
        .context_types(ContextTypes(context=Context))
        .job_queue(None)
        .token(settings.TELEGRAM_TOKEN)
    )
    # TODO:
    Context.sessionmaker = sessionmaker

    tg_app = builder.build() if settings.DEBUG else builder.updater(None).build()

    tg_app.add_handlers(handlers)
    tg_app.add_error_handler(error_handler)

    async with tg_app:
        await tg_app.start()
        if tg_app.updater is not None:
            await tg_app.updater.start_polling()
        if settings.TELEGRAM_SETUP_COMMANDS:
            await setup_commands(tg_app)
        yield tg_app
        if tg_app.updater is not None:
            await tg_app.updater.stop()
        await tg_app.stop()


async def setup_commands(
    tg_app: Application[ExtBot[None], Context, AnyDict, AnyDict, AnyDict, None],
) -> None:
    commands = {
        "start": "start",
    }
    # localize
    for lang in ["en", "ru"]:
        await tg_app.bot.set_my_commands(
            [BotCommand(k, v) for k, v in commands.items()],
            language_code=lang,
        )
