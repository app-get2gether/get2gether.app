from fastapi import APIRouter, Depends

from app.tgbot.auth.dependencies import (
    get_user_or_create_with_tg_data,
    validate_init_data,
)
from app.tgbot.event.api import router as event_api
from app.tgbot.user.api import router as user_api

router = APIRouter(
    prefix="/tgbot/v1",
    dependencies=[
        Depends(validate_init_data),
        Depends(get_user_or_create_with_tg_data),
    ],
)

router.include_router(event_api)
router.include_router(user_api)
