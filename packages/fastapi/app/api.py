from fastapi import APIRouter

from .tgbot.api import router as tgbot_api

router = APIRouter(prefix="/tgbot/v1")

router.include_router(tgbot_api)
