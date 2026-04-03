from fastapi import APIRouter

from app.services.risk_service import calculate_risk_index

router = APIRouter(prefix="/risk")


@router.get("/")
def get_risk_index():
    return {"risk_analysis": calculate_risk_index()}


@router.get("/top")
def get_top_regions():
    data = calculate_risk_index()
    critical = data[:3]
    critical_regions = {zone["region"] for zone in critical}
    safe = [zone for zone in reversed(data) if zone["region"] not in critical_regions][:3]

    return {
        "most_critical": critical,
        "safest": safe,
    }
