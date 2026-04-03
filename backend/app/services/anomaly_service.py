import numpy as np
from app.db.database import data_store
from app.utils.cleaner import clean_nan


def detect_anomalies():
    anomalies = []

    if len(data_store) < 5:
        return anomalies

    temps = [d["temperature"] for d in data_store]
    chloro = [d["chlorophyll"] for d in data_store]

    temp_mean = np.mean(temps)
    temp_std = np.std(temps)

    chl_mean = np.mean(chloro)
    chl_std = np.std(chloro)

    for d in data_store:
        temp_z = (d["temperature"] - temp_mean) / (temp_std + 1e-5)
        chl_z = (d["chlorophyll"] - chl_mean) / (chl_std + 1e-5)

        if abs(temp_z) > 2 or abs(chl_z) > 2:
            anomalies.append({
                "region": d["region"],
                "lat": d["lat"],
                "lon": d["lon"],
                "temperature": d["temperature"],
                "chlorophyll": d["chlorophyll"],
                "temp_zscore": round(temp_z, 2),
                "chl_zscore": round(chl_z, 2)
            })

    return clean_nan(anomalies)