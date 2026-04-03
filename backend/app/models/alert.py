from pydantic import BaseModel

class Alert(BaseModel):
    region: str
    type: str
    priority: str
    confidence: float
    message: str