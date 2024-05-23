from collections.abc import AsyncIterator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from pytest_asyncio import is_async_test
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.db import create_async_engine, get_db_session
from app.models.base import BaseModel
from app.server import app
from app.settings import settings


# https://pytest-asyncio.readthedocs.io/en/latest/how-to-guides/run_session_tests_in_same_loop.html
# https://github.com/pytest-dev/pytest-asyncio/issues/705
# https://github.com/pytest-dev/pytest-asyncio/issues/706
def pytest_collection_modifyitems(items: list[pytest.Item]) -> None:
    pytest_asyncio_tests = (item for item in items if is_async_test(item))
    session_scope_marker = pytest.mark.asyncio(scope="session")
    for async_test in pytest_asyncio_tests:
        async_test.add_marker(session_scope_marker, append=False)


@pytest_asyncio.fixture(scope="session")
async def engine() -> AsyncIterator[AsyncEngine]:
    engine = create_async_engine(settings.DATABASE_URL, "app", settings.DEBUG_SQL)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def init_db(engine: AsyncEngine) -> AsyncIterator[None]:
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.drop_all)


@pytest_asyncio.fixture(scope="session")
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_db_session] = lambda: session
    async with AsyncClient(
        app=app,
        base_url="http://test",
    ) as client:
        yield client
    app.dependency_overrides.pop(get_db_session)


@pytest_asyncio.fixture(scope="session")
async def session(
    engine: AsyncEngine,
) -> AsyncIterator[AsyncSession]:
    connection = await engine.connect()
    transaction = await connection.begin()

    session = AsyncSession(bind=connection, expire_on_commit=False)
    yield session

    await transaction.rollback()
    await connection.close()
