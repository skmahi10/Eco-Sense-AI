from app.services.risk_service import calculate_risk_index


def generate_alerts():
    alerts = []

    for row in calculate_risk_index():
        if row["risk_level"] == "low":
            continue

        if row["risk_level"] == "high":
            priority = "CRITICAL"
            message = (
                f"{row['region']} needs attention: low water quality, elevated NDVI, "
                f"and an upward trend are contributing to a high risk score."
            )
        else:
            priority = "WATCH"
            message = (
                f"{row['region']} is under watch as temperature, NDVI, or trend rate are rising."
            )

        alerts.append({
            "region": row["region"],
            "lat": row["lat"],
            "lon": row["lon"],
            "priority": priority,
            "confidence": round(row["eco_risk_index"] / 100, 2),
            "message": message,
        })

    return alerts
