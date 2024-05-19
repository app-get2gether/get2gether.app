from contextlib import asynccontextmanager
from typing import AsyncIterator, TypedDict

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.api import router
from app.conf import settings
from app.db import create_async_engine, create_sessionmaker


class State(TypedDict):
    sessionmaker: async_sessionmaker[AsyncSession]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[State]:
    engine = create_async_engine(settings.DATABASE_URL, "app", settings.DEBUG_SQL)
    sessionmaker = create_sessionmaker(engine)
    yield {"sessionmaker": sessionmaker}
    await engine.dispose()


app = FastAPI(lifespan=lifespan)
app.include_router(router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello World"}
