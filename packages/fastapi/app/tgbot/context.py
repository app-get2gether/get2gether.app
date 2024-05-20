from functools import wraps
from typing import Any, Callable, Coroutine, Dict, TypeVar

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from telegram import Update
from telegram.ext import CallbackContext, ExtBot

R = TypeVar("R")
AnyDict = Dict[Any, Any]


class Context(CallbackContext[ExtBot[None], AnyDict, AnyDict, AnyDict]):
    sessionmaker: async_sessionmaker[AsyncSession]


def enrich_context(
    call: Callable[..., Coroutine[Any, Any, R]],
) -> Callable[..., Coroutine[Any, Any, R]]:
    @wraps(call)
    async def wrapper(update: Update, context: Context, **kwargs: Any) -> R:
        async with context.sessionmaker() as db:
            return await call(db, update, context, **kwargs)

    return wrapper
