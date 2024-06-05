from fastapi import APIRouter

router = APIRouter()


@router.post("/event/{event_id}/tickets")
def purchase_ticket() -> None:
    pass
