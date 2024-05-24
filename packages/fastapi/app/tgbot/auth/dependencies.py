import hashlib
import hmac
import json
import re
from typing import Annotated
from urllib.parse import unquote

from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN

from app.settings import settings
from app.tgbot.user.schemas import User, UserTgData
from app.tgbot.user.services import UserService


async def validate_init_data(
    auth_key: Annotated[str, Depends(APIKeyHeader(name="x-telegram-auth"))],
) -> None:
    m = re.compile(r"^((.*?)&hash=(.*?))$").match(unquote(auth_key))
    if not m:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Invalid authentication credentials"
        )

    init_data = m.group(1)
    data_hash = m.group(3)
    data = {
        k: v for (k, v) in [p.split("=") for p in init_data.split("&")] if k != "hash"
    }
    data_check_string = "\n".join([f"{k}={data[k]}" for k in sorted(data.keys())])

    secret_key = hmac.new(
        b"WebAppData", settings.TELEGRAM_TOKEN.encode(), hashlib.sha256
    ).digest()
    result_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if result_hash != data_hash:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Hash is not valid")


async def get_user_or_create_with_tg_data(
    auth_key: Annotated[str, Depends(APIKeyHeader(name="x-telegram-auth"))],
    user_svc: Annotated[UserService, Depends(UserService.get_svc)],
) -> User:
    """
    WARNING: Data is trusted and should be validated before calling this function
    TODO: validate here one more time
    """
    m = re.compile(r"^((.*?)&hash=(.*?))$").match(unquote(auth_key))
    if not m:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Invalid authentication credentials"
        )

    init_data = m.group(1)
    data = {k: v for (k, v) in [p.split("=") for p in init_data.split("&")]}
    user_tg_data = UserTgData.model_validate(json.loads(data["user"]))
    user = await user_svc.get_by_tg_id(user_tg_data.id)
    if not user:
        user = await user_svc.create_with_tg_data(user_tg_data)
    return user


UserDep = Annotated[User, Depends(get_user_or_create_with_tg_data)]
