from fastapi import APIRouter

from .tgbot.api import router as tgbot_api

router = APIRouter()

router.include_router(tgbot_api)
