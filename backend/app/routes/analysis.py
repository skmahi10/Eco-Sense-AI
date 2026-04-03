from fastapi import APIRouter
from app.services.risk_service import calculate_risk_index

router = APIRouter(prefix="/analysis")

@router.get("/")
def get_analysis():
    return calculate_risk_index()