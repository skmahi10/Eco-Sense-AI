from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router
from app.routes.risk import router as risk_router
from app.routes.alerts import router as alerts_router
from app.routes.prediction import router as prediction_router
from app.routes.anomaly import router as anomaly_router
from app.routes.query import router as query_router
from app.routes.ingest import router as ingest_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)
app.include_router(risk_router)
app.include_router(alerts_router)
app.include_router(prediction_router)
app.include_router(anomaly_router)
app.include_router(query_router)
app.include_router(ingest_router)