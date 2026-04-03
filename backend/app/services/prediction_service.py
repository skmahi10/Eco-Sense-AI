import numpy as np

from app.services.data_service import get_time_series
from app.services.risk_service import FORMULA_TEXT, compute_combined_risk
from app.utils.cleaner import clean_nan

FORECAST_DAYS = 10
FORECAST_LIMITS = {
    "temperature": (0, 45),
    "water_quality": (0, 100),
    "humidity": (0, 100),
    "ndvi": (0, 1),
    "wind": (0, 25),
    "trend_rate": (0, 20),
}


def step_value(values):
    if len(values) < 2:
        return 0
    return float(np.mean(np.diff(values)))


def next_days(values, days=FORECAST_DAYS, min_value=None, max_value=None):
    if not values:
        return []
    delta = step_value(values)
    latest = float(values[-1])
    forecast = [latest + delta * day for day in range(1, days + 1)]
    if min_value is not None and max_value is not None:
        forecast = [float(np.clip(value, min_value, max_value)) for value in forecast]
    return [round(value, 2) for value in forecast]


def classify_outcome(level):
    if level == "high":
        return "High pollution / bloom-stress risk likely if the trend continues."
    if level == "medium":
        return "Moderate stress watch: conditions may worsen and should be monitored."
    return "Low risk expected in the next few days if the trend stays stable."


def summarize_forecast(day_forecast):
    if not day_forecast:
        return {
            "avg_score": 0,
            "avg_temperature": 0,
            "avg_water_quality": 0,
            "avg_humidity": 0,
            "avg_ndvi": 0,
            "avg_wind": 0,
            "avg_trend_rate": 0,
            "peak_day": 0,
            "peak_score": 0,
        }

    peak_day = max(day_forecast, key=lambda day: day["predicted_score"])
    return {
        "avg_score": round(float(np.mean([day["predicted_score"] for day in day_forecast])), 2),
        "avg_temperature": round(float(np.mean([day["temperature"] for day in day_forecast])), 2),
        "avg_water_quality": round(float(np.mean([day["water_quality"] for day in day_forecast])), 2),
        "avg_humidity": round(float(np.mean([day["humidity"] for day in day_forecast])), 2),
        "avg_ndvi": round(float(np.mean([day["ndvi"] for day in day_forecast])), 3),
        "avg_wind": round(float(np.mean([day["wind"] for day in day_forecast])), 2),
        "avg_trend_rate": round(float(np.mean([day["trend_rate"] for day in day_forecast])), 2),
        "peak_day": peak_day["day"],
        "peak_score": peak_day["predicted_score"],
    }


def get_predictions():
    data = get_time_series()
    results = []

    for region, values in data.items():
        temp_forecast = next_days(
            values["temperature"],
            min_value=FORECAST_LIMITS["temperature"][0],
            max_value=FORECAST_LIMITS["temperature"][1],
        )
        wq_forecast = next_days(
            values["water_quality"],
            min_value=FORECAST_LIMITS["water_quality"][0],
            max_value=FORECAST_LIMITS["water_quality"][1],
        )
        humidity_forecast = next_days(
            values["humidity"],
            min_value=FORECAST_LIMITS["humidity"][0],
            max_value=FORECAST_LIMITS["humidity"][1],
        )
        ndvi_forecast = next_days(
            values["ndvi"],
            min_value=FORECAST_LIMITS["ndvi"][0],
            max_value=FORECAST_LIMITS["ndvi"][1],
        )
        wind_forecast = next_days(
            values["wind"],
            min_value=FORECAST_LIMITS["wind"][0],
            max_value=FORECAST_LIMITS["wind"][1],
        )
        trend_forecast = next_days(
            values["trend_rate"],
            min_value=FORECAST_LIMITS["trend_rate"][0],
            max_value=FORECAST_LIMITS["trend_rate"][1],
        )

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
        summary = summarize_forecast(day_forecast)

        results.append({
            "region": region,
            "score_formula": FORMULA_TEXT,
            "forecast_days": day_forecast,
            "forecast_summary": summary,
            "predicted_final_score": final_day["predicted_score"] if final_day else 0,
            "predicted_risk": final_day["risk_level"] if final_day else "low",
            "outcome": outcome,
            "explanation": (
                f"10-day forecast average risk is {summary['avg_score']}/100, with a peak of "
                f"{summary['peak_score']}/100 on day {summary['peak_day']}. {outcome} "
                f"Weighted formula used: {FORMULA_TEXT}."
            ),
        })

    results.sort(key=lambda item: item["predicted_final_score"], reverse=True)
    return clean_nan(results)
