from typing import Annotated, Self

from fastapi import Depends
from sqlalchemy import sql
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db_session
from app.models.user import UserModel
from app.tgbot.user.schemas import User, UserTgData


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    @classmethod
    async def get_svc(
        cls, db: Annotated[AsyncSession, Depends(get_db_session)]
    ) -> Self:
        return cls(db)

    async def get_by_tg_id(self, tg_id: int) -> User | None:
        stmt = sql.select(UserModel).where(UserModel.tg_id == tg_id)
        res = await self.db.execute(stmt)
        user = res.scalars().one_or_none()
        if not user:
            return None
        return User.model_validate(user)

    async def create_with_tg_data(self, user_data: UserTgData) -> User:
        user_dict = user_data.model_dump(by_alias=True)
        stmt = sql.insert(UserModel).values(**user_dict).returning(UserModel)
        res = await self.db.execute(stmt)
        await self.db.commit()
        return User.model_validate(res.scalar_one())
