from collections.abc import AsyncGenerator, AsyncIterator

import pytest
import pytest_asyncio
from httpx import AsyncClient
from pytest_asyncio import is_async_test
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.db import create_async_engine, get_db_session
from app.models.base import BaseModel
from app.models.event import EventModel
from app.models.user import UserModel
from app.server import app
from app.settings import settings
from app.tgbot.event.schemas import Event, EventBase
from app.tgbot.user.schemas import User


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


@pytest_asyncio.fixture(scope="session")
async def user(session: AsyncSession) -> AsyncGenerator[User, None]:
    # fmt: off
    user_data = User.model_validate({
        "id": "f1a6b1c1-4f7b-4c9d-8f8c-4d1e1b1c1f1a",
        "username": "bob",

        "is_admin": False,
        "is_blocked": False,

        "tg_id": -10,
        "tg_first_name": "Bob",
        "tg_last_name": "Doe",
        "tg_username": "bob",
        "tg_language_code": "en",
        "tg_phone": "",
        # "tg_is_premium": True,
        # "tg_allows_write_to_pm": True,
        "tg_is_bot": False,
    })
    # fmt: on

    user = UserModel(**user_data.model_dump(by_alias=True))
    session.add(user)
    await session.flush()
    await session.refresh(user)
    yield User.model_validate(user)


@pytest_asyncio.fixture(scope="session")
async def user_frank(session: AsyncSession) -> AsyncGenerator[User, None]:
    # fmt: off
    user_data = User.model_validate({
        "id": "bcdc9431-de95-4670-aa4c-f474d4c237f5",
        "username": "frank",

        "is_admin": False,
        "is_blocked": False,

        "tg_id": -11,
        "tg_first_name": "Frank",
        "tg_last_name": "Anderson",
        "tg_username": "notfrank",
        "tg_language_code": "en",
        "tg_phone": "",
        "tg_is_bot": False,
    })
    # fmt: on

    user = UserModel(**user_data.model_dump(by_alias=True))
    session.add(user)
    await session.flush()
    await session.refresh(user)
    yield User.model_validate(user)


@pytest_asyncio.fixture(scope="session")
async def event(session: AsyncSession, user: User) -> AsyncGenerator[Event, None]:
    event_data = EventBase.model_validate(
        {
            "id": "3c1b1e4d-8f8c-4c9d-4f7b-f1a6b1c1f1a",
            "title": "TestEvent",
        }
    )

    event = EventModel(
        **{**event_data.model_dump(by_alias=True), "created_by": user.id}
    )
    session.add(event)
    await session.flush()
    await session.refresh(event)
    yield Event.model_validate(event)
