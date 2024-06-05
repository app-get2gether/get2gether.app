from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends

from app.tgbot.auth.dependencies import get_user_or_create_with_tg_data
from app.tgbot.event.schemas import EventPurchasedTicket
from app.tgbot.event.services import EventService
from app.tgbot.user.schemas import User

router = APIRouter()


@router.post("/events/{event_id}/tickets")
async def purchase_ticket(
    event_id: UUID,
    event_svc: Annotated[EventService, Depends(EventService.get_svc)],
    user: Annotated[User, Depends(get_user_or_create_with_tg_data)],
) -> EventPurchasedTicket:
    ticket_model, ticket_type_model = await event_svc.purchase_ticket(event_id, user)
    return EventPurchasedTicket.model_validate(
        {
            **ticket_model.__dict__,
            "ticket_type": ticket_type_model.ticket_type,
            "currency": ticket_type_model.currency,
        },
    )
