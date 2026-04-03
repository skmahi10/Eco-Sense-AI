from pydantic import BaseModel

class EnvironmentalData(BaseModel):
    region: str
    lat: float
    lon: float
    temperature: float
    water_quality: float
    humidity: float
    ndvi: float
    wind: float
    trend_rate: float
    timestamp: str
