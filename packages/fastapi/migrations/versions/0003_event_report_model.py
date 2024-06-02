"""event_report_model

Revision ID: 0003
Revises: 0002
Create Date: 2024-06-03 02:46:22.996354

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "event_reports",
        sa.Column("event_id", sa.UUID(), nullable=False),
        sa.Column("reported_by", sa.UUID(), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["event_id"], ["events.id"], name=op.f("fk_event_reports_events_event_id")
        ),
        sa.ForeignKeyConstraint(
            ["reported_by"],
            ["users.id"],
            name=op.f("fk_event_reports_users_reported_by"),
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_event_reports")),
        sa.UniqueConstraint(
            "event_id", "reported_by", name="uq_event_reports_event_id_reported_by"
        ),
    )
    op.create_index(
        "ix_event_reports_event_id", "event_reports", ["event_id"], unique=False
    )
    op.create_index(
        "ix_event_reports_reported_by", "event_reports", ["reported_by"], unique=False
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index("ix_event_reports_reported_by", table_name="event_reports")
    op.drop_index("ix_event_reports_event_id", table_name="event_reports")
    op.drop_table("event_reports")
    # ### end Alembic commands ###
