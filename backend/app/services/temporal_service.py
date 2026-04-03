from collections import defaultdict
from app.db.database import data_store


def get_time_series():
    region_data = defaultdict(lambda: {
        "temperature": [],
        "chlorophyll": [],
        "timestamps": []
    })

    for d in data_store:
        r = d["region"]
        region_data[r]["temperature"].append(d["temperature"])
        region_data[r]["chlorophyll"].append(d["chlorophyll"])
        region_data[r]["timestamps"].append(d["timestamp"])

    return region_data