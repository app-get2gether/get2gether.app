# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM docker.io/python:3.12.4-slim-bullseye
LABEL org.opencontainers.image.source=https://github.com/app-get2gether/get2gether.app
LABEL org.opencontainers.image.description="Get2Gether"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_VERSION=1.8.3

RUN pip install --upgrade pip && \
    pip install poetry==${POETRY_VERSION}

WORKDIR /app/

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-dev --no-root

COPY . ./

EXPOSE 5000

CMD ["poetry", "run", "uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "5000"]
