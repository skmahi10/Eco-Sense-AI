from fastapi import APIRouter
from app.services.alert_service import generate_alerts

router = APIRouter(prefix="/alerts")

@router.get("/")
def get_alerts():
    return {"alerts": generate_alerts()}
