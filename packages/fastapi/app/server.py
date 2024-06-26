from contextlib import asynccontextmanager
from typing import AsyncIterator, TypedDict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from telegram import Bot

from app.api import router
from app.db import create_async_engine, create_sessionmaker
from app.settings import settings
from app.tgbot.app import start_tg_app


class State(TypedDict):
    sessionmaker: async_sessionmaker[AsyncSession]
    tgbot: Bot


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[State]:
    engine = create_async_engine(settings.DATABASE_URL, "app", settings.DEBUG_SQL)
    sessionmaker = create_sessionmaker(engine)
    async with start_tg_app(sessionmaker) as tg_app:
        yield {"sessionmaker": sessionmaker, "tgbot": tg_app.bot}
    await engine.dispose()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}
