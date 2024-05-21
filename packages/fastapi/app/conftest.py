from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.server import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    yield TestClient(app)
