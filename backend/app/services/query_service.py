from app.services.prediction_service import get_predictions
from app.services.risk_service import calculate_risk_index


def handle_query(question: str):
    question = question.lower().strip()
    risk_rows = calculate_risk_index()
    predictions = get_predictions()

    if not risk_rows:
        return {"response": "No environmental data is available right now."}

    top_risk = risk_rows[0]
    top_prediction = predictions[0] if predictions else None

    if "score" in question or "risk" in question:
        breakdown = top_risk["score_breakdown"]
        return {
            "response": (
                f"{top_risk['region']} has a combined score of {top_risk['eco_risk_index']}/100. "
                f"It is calculated from temperature {breakdown['temperature_score']}, "
                f"water quality {breakdown['water_quality_score']}, humidity {breakdown['humidity_score']}, "
                f"NDVI {breakdown['ndvi_score']}, wind {breakdown['wind_score']}, "
                f"and trend rate {breakdown['trend_score']}. {top_risk['explanation']}"
            )
        }

    if "water" in question:
        return {
            "response": (
                f"{top_risk['region']} has water quality {top_risk['water_quality_latest']}/100. "
                "Lower water-quality values increase the risk score because they suggest degraded marine conditions."
            )
        }

    if "ndvi" in question or "vegetation" in question or "chlorophyll" in question:
        return {
            "response": (
                f"{top_risk['region']} has NDVI {top_risk['ndvi_latest']}. "
                "In this project NDVI is used as a vegetation/chlorophyll proxy, so higher NDVI can indicate stronger bloom growth."
            )
        }

    if (
        "crisis" in question
        or "prediction" in question
        or "future" in question
        or "next" in question
        or "happen" in question
    ):
        if top_prediction:
            return {
                "response": (
                    f"Expected condition in {top_prediction['region']}: {top_prediction['outcome']} "
                    f"Projected day-3 score: {top_prediction['predicted_final_score']}/100 "
                    f"({top_prediction['predicted_risk']} risk). "
                    f"{top_prediction['explanation']}"
                )
            }

    return {
        "response": (
            "Ask about risk score, water quality, NDVI, expected crisis, or future prediction."
        )
    }
