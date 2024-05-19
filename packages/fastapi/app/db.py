from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker as _async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine as _create_async_engine


def create_async_engine(
    url: str, application_name: str, debug: bool = False
) -> AsyncEngine:
    return _create_async_engine(
        url,
        echo=debug,
        connect_args={"server_settings": {"application_name": application_name}},
    )


def create_sessionmaker(engine: AsyncEngine) -> _async_sessionmaker[AsyncSession]:
    return _async_sessionmaker(
        engine,
        expire_on_commit=False,
        autoflush=False,
    )
