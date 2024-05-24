from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.tgbot.auth.dependencies import UserDep
from app.tgbot.user.schemas import User
from app.tgbot.user.services import UserService

router = APIRouter()


@router.get("/me")
async def get_me(user: UserDep) -> User:
    return user


class UsernameData(BaseModel):
    username: str


@router.post("/me/username")
async def set_username(
    data: UsernameData,
    user: UserDep,
    user_svc: Annotated[UserService, Depends(UserService.get_svc)],
) -> User:
    _user = await user_svc.update(user.id, {"username": data.username})
    return _user
