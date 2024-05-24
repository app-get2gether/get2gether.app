# Backend

Backend is implemented with [FastAPI](https://fastapi.tiangolo.com/) framework

```
cd packages/fastapi
poetry install
docker-compose up
task migrate
task dev
```

## PostgreSQL

The main database is PostgreSQL, with [SQLAlchemy ORM](https://www.sqlalchemy.org/)

{% hint style="info" %}
You need to add [PostGIS extension](http://postgis.net/documentation/getting\_started/) to the database
{% endhint %}

## Additional

* [Postman](postman.md)
* [Setup tunnels](setup-tunnels.md)
