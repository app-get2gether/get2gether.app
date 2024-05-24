# Backend

## Getting started

Backend is implemented with [FastAPI](https://fastapi.tiangolo.com/) framework

```
cd packages/fastapi
poetry install
docker-compose up
task migrate
task dev
```

Default URLs:

{% hint style="info" %}
[http://localhost:8000](http://localhost:8000)\
[http://localhost:8000/doc](http://localhost:8000/doc)\
[http://localhost:8000/redoc](http://localhost:8000/redoc)
{% endhint %}

## PostgreSQL

The main database is PostgreSQL, with [SQLAlchemy ORM](https://www.sqlalchemy.org/)

{% hint style="danger" %}
You need to add [PostGIS extension](http://postgis.net/documentation/getting\_started/) to the database
{% endhint %}

## Additional

* [Postman](postman.md)
* [Setup tunnels](setup-tunnels.md)
