import os

import pandas as pd


def get_time_series():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    file_path = os.path.join(base_dir, "data", "data.csv")

    df = pd.read_csv(file_path)

    if "timestamp" in df.columns:
        df["timestamp"] = df["timestamp"].astype(str)

    if "water_quality" not in df.columns and "air_quality" in df.columns:
        df["water_quality"] = df["air_quality"]
    if "ndvi" not in df.columns and "chlorophyll" in df.columns:
        df["ndvi"] = df["chlorophyll"]
    if "chlorophyll" not in df.columns and "ndvi" in df.columns:
        # Derive a separate chlorophyll estimate instead of duplicating NDVI,
        # otherwise both chart lines overlap and chlorophyll appears invisible.
        df["chlorophyll"] = (df["ndvi"] * 18 + 0.8).round(2)

    grouped = {}
    for region, group in df.groupby("region"):
        ndvi_series = group["ndvi"].tolist() if "ndvi" in group.columns else [0.35] * len(group)
        chlorophyll_series = group["chlorophyll"].tolist() if "chlorophyll" in group.columns else ndvi_series
        trend_rate = (
            group["trend_rate"].tolist()
            if "trend_rate" in group.columns
            else [round(float(ndvi_series[i] - ndvi_series[i - 1]) * 100, 2) if i else 0 for i in range(len(ndvi_series))]
        )

        grouped[region] = {
            "temperature": group["temperature"].tolist() if "temperature" in group.columns else [28.0] * len(group),
            "water_quality": group["water_quality"].tolist() if "water_quality" in group.columns else [85] * len(group),
            "humidity": group["humidity"].tolist() if "humidity" in group.columns else [72] * len(group),
            "ndvi": ndvi_series,
            "chlorophyll": chlorophyll_series,
            "wind": group["wind"].tolist() if "wind" in group.columns else [6.0] * len(group),
            "trend_rate": trend_rate,
            "timestamps": group["timestamp"].tolist() if "timestamp" in group.columns else [str(i + 1) for i in range(len(group))],
            "lat": float(group["lat"].iloc[0]),
            "lon": float(group["lon"].iloc[0]),
        }

    return grouped
