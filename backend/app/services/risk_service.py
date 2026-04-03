import numpy as np

from app.services.data_service import get_time_series

FORMULA_TEXT = (
    "Risk Score = 0.22*Tn + 0.24*(100-WQ) + 0.12*Hn + 0.18*NDVIn + 0.10*Wn + 0.14*TRn, where n = normalized 0-100"
)


def clean_nan(data):
    for item in data:
        for key, value in item.items():
            if isinstance(value, float) and (np.isnan(value) or np.isinf(value)):
                item[key] = 0
    return data


def normalize_metrics(metrics):
    return {
        "temperature": np.clip(((metrics["temperature"] - 24) / 10) * 100, 0, 100),
        "water_quality": np.clip(100 - metrics["water_quality"], 0, 100),
        "humidity": np.clip(((metrics["humidity"] - 60) / 35) * 100, 0, 100),
        "ndvi": np.clip(((metrics["ndvi"] - 0.2) / 0.6) * 100, 0, 100),
        "wind": np.clip((metrics["wind"] / 15) * 100, 0, 100),
        "trend_rate": np.clip((metrics["trend_rate"] / 8) * 100, 0, 100),
    }


def compute_combined_risk(metrics):
    normalized = normalize_metrics(metrics)
    scores = {
        "temperature_score": round(float(normalized["temperature"] * 0.22), 2),
        "water_quality_score": round(float(normalized["water_quality"] * 0.24), 2),
        "humidity_score": round(float(normalized["humidity"] * 0.12), 2),
        "ndvi_score": round(float(normalized["ndvi"] * 0.18), 2),
        "wind_score": round(float(normalized["wind"] * 0.10), 2),
        "trend_score": round(float(normalized["trend_rate"] * 0.14), 2),
    }
    risk_score = round(min(100, sum(scores.values())), 2)

    if risk_score >= 70:
        level = "high"
    elif risk_score >= 40:
        level = "medium"
    else:
        level = "low"

    return risk_score, level, scores


def build_risk_explanation(region, metrics, scores, risk_score):
    return (
        f"{region.replace('_', ' ')} has final score {risk_score}/100 using {FORMULA_TEXT}. "
        f"Current inputs: temperature {metrics['temperature']:.1f} C, water quality "
        f"{metrics['water_quality']:.0f}/100, humidity {metrics['humidity']:.0f}%, "
        f"NDVI {metrics['ndvi']:.2f}, wind {metrics['wind']:.1f} m/s, trend rate "
        f"{metrics['trend_rate']:.1f}. Score split: temp {scores['temperature_score']}, "
        f"water {scores['water_quality_score']}, humidity {scores['humidity_score']}, "
        f"NDVI {scores['ndvi_score']}, wind {scores['wind_score']}, trend "
        f"{scores['trend_score']}."
    )


def calculate_risk_index():
    data = get_time_series()
    results = []

    for region, values in data.items():
        if not all([
            values["temperature"],
            values["water_quality"],
            values["humidity"],
            values["ndvi"],
            values["wind"],
            values["trend_rate"],
        ]):
            continue

        latest = {
            "temperature": float(values["temperature"][-1]),
            "water_quality": float(values["water_quality"][-1]),
            "humidity": float(values["humidity"][-1]),
            "ndvi": float(values["ndvi"][-1]),
            "wind": float(values["wind"][-1]),
            "trend_rate": float(values["trend_rate"][-1]),
        }

        risk_score, level, scores = compute_combined_risk(latest)

        results.append({
            "region": region,
            "eco_risk_index": risk_score,
            "risk_level": level,
            "temperature_latest": round(latest["temperature"], 2),
            "water_quality_latest": round(latest["water_quality"], 2),
            "humidity_latest": round(latest["humidity"], 2),
            "ndvi_latest": round(latest["ndvi"], 3),
            "wind_latest": round(latest["wind"], 2),
            "trend_rate_latest": round(latest["trend_rate"], 2),
            "score_breakdown": scores,
            "score_formula": FORMULA_TEXT,
            "explanation": build_risk_explanation(region, latest, scores, risk_score),
            "lat": values["lat"],
            "lon": values["lon"],
        })

    results.sort(key=lambda item: item["eco_risk_index"], reverse=True)
    return clean_nan(results)
