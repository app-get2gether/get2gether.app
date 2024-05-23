from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.ext.asyncio import create_async_engine as _create_async_engine


def create_async_engine(
    url: str, application_name: str, debug: bool = False
) -> AsyncEngine:
    return _create_async_engine(
        url,
        echo=debug,
        connect_args={"server_settings": {"application_name": application_name}},
    )


def create_sessionmaker(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(
        engine,
        expire_on_commit=False,
        autoflush=False,
    )


async def get_db_sessionmaker(
    request: Request,
) -> AsyncGenerator[async_sessionmaker[AsyncSession], None]:
    yield request.state.sessionmaker


async def get_db_session(
    sessionmaker: Annotated[
        async_sessionmaker[AsyncSession], Depends(get_db_sessionmaker)
    ],
) -> AsyncGenerator[AsyncSession, None]:
    async with sessionmaker() as session:
        try:
            yield session
        except:
            await session.rollback()
            raise
        else:
            await session.commit()
