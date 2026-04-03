def calculate_score(anomaly):
    temp_score = abs(anomaly["temp_zscore"])
    chl_score = abs(anomaly["chl_zscore"])

    score = (temp_score + chl_score) / 2

    if score > 3:
        priority = "high"
    elif score > 2:
        priority = "medium"
    else:
        priority = "low"

    return score, priority