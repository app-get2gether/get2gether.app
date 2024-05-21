from fastapi import APIRouter, Depends

from .tgbot.api import router as tgbot_api
from .tgbot.auth.dependencies import validate_init_data

router = APIRouter(prefix="/tgbot/v1")

router.include_router(tgbot_api, dependencies=[Depends(validate_init_data)])
