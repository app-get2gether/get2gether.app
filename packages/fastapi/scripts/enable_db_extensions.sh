#!/bin/bash

function create_extensions() {
  local database=$1
  echo "  Creating extensions '$database'"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d $database <<-EOSQL
    CREATE EXTENSION postgis;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Multiple database create extensions: $POSTGRES_MULTIPLE_DATABASES"
  for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    create_extensions $db
  done
  echo "Multiple databases extensions created"
fi
