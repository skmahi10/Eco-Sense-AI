import math

def clean_nan(data):
    if isinstance(data, dict):
        return {k: clean_nan(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_nan(v) for v in data]
    elif isinstance(data, float) and math.isnan(data):
        return 0
    return data