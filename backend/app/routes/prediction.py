from fastapi import APIRouter
from app.services.prediction_service import get_predictions

router = APIRouter(prefix="/prediction")

@router.get("/")
def get_prediction():
    return {"predictions": get_predictions()}
