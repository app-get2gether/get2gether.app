#!/usr/bin/env bash
#
# Preview alembic's revision autogeneration
# https://github.com/sqlalchemy/alembic/issues/407#issuecomment-531223680

set -euo pipefail

echo "================================================================================="
generated_revision=$(alembic revision --autogenerate | grep Generating | cut -d' ' -f4)
cat "${generated_revision}"
echo "================================================================================="
alembic upgrade --sql +1
echo "================================================================================="
rm -rf "${generated_revision}"
