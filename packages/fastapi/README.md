# Get2Gether FastAPI backend [![codecov](https://codecov.io/github/app-get2gether/get2gether.app/branch/main/graph/badge.svg?token=YCAKITUCIR&flags=fastapi)](https://codecov.io/github/app-get2gether/get2gether.app)

## Installation

* python >= 3.12.1, poetry
* copy `.env.example` to `.env` and edit it
* `poetry install`

## Running

* `docker-compose up`
* `task migrate`
* `task dev`

## MinIO

For storing images please setup MinIO policies  
Open http://localhost:9001, authorize as `minioadmin:minioadmin`  
Go to `Buckets > g2g (by default)`. Click on `Access Policy`, select `Custom` and put the policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::g2g/events/*"
            ]
        }
    ]
}
```

## Migrations

* `task alembic_print` - to see generated migrations output
* `task makemigrations my_migration`
* `task migrate`
