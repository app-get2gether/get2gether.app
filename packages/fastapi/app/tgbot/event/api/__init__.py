from fastapi import APIRouter

from .base import router as base_router
from .tickets import router as ticket_router

router = APIRouter()

router.include_router(base_router)
router.include_router(ticket_router)
