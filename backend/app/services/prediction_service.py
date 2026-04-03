import numpy as np

from app.services.data_service import get_time_series
from app.services.risk_service import FORMULA_TEXT, compute_combined_risk
from app.utils.cleaner import clean_nan


def step_value(values):
    if len(values) < 2:
        return 0
    return float(np.mean(np.diff(values)))


def next_days(values, days=3):
    if not values:
        return []
    delta = step_value(values)
    latest = float(values[-1])
    return [round(latest + delta * day, 2) for day in range(1, days + 1)]


def classify_outcome(level):
    if level == "high":
        return "High pollution / bloom-stress risk likely if the trend continues."
    if level == "medium":
        return "Moderate stress watch: conditions may worsen and should be monitored."
    return "Low risk expected in the next few days if the trend stays stable."


def get_predictions():
    data = get_time_series()
    results = []

    for region, values in data.items():
        temp_forecast = next_days(values["temperature"])
        wq_forecast = next_days(values["water_quality"])
        humidity_forecast = next_days(values["humidity"])
        ndvi_forecast = next_days(values["ndvi"])
        wind_forecast = next_days(values["wind"])
        trend_forecast = next_days(values["trend_rate"])

        day_forecast = []
        for idx in range(len(temp_forecast)):
            metrics = {
                "temperature": temp_forecast[idx],
                "water_quality": wq_forecast[idx],
                "humidity": humidity_forecast[idx],
                "ndvi": ndvi_forecast[idx],
                "wind": wind_forecast[idx],
                "trend_rate": trend_forecast[idx],
            }
            score, level, scores = compute_combined_risk(metrics)
            day_forecast.append({
                "day": idx + 1,
                "temperature": metrics["temperature"],
                "water_quality": metrics["water_quality"],
                "humidity": metrics["humidity"],
                "ndvi": metrics["ndvi"],
                "wind": metrics["wind"],
                "trend_rate": metrics["trend_rate"],
                "predicted_score": score,
                "risk_level": level,
                "score_breakdown": scores,
            })

        final_day = day_forecast[-1] if day_forecast else None
        outcome = classify_outcome(final_day["risk_level"]) if final_day else "No forecast available."

        results.append({
            "region": region,
            "score_formula": FORMULA_TEXT,
            "forecast_days": day_forecast,
            "predicted_final_score": final_day["predicted_score"] if final_day else 0,
            "predicted_risk": final_day["risk_level"] if final_day else "low",
            "outcome": outcome,
            "explanation": (
                f"Over the next 3 days, {region.replace('_', ' ')} is projected to reach "
                f"{final_day['predicted_score'] if final_day else 0}/100 risk. {outcome} "
                f"Formula used: {FORMULA_TEXT}."
            ),
        })

    results.sort(key=lambda item: item["predicted_final_score"], reverse=True)
    return clean_nan(results)
