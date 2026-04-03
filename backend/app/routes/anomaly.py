from fastapi import APIRouter
from app.services.data_service import get_time_series

router = APIRouter(prefix="/anomaly")

@router.get("/graph")
def get_graph():
    return {"graph_data": get_time_series()}
