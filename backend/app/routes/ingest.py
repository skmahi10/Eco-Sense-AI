from fastapi import APIRouter, UploadFile, File
import pandas as pd
from app.db.database import data_store

router = APIRouter()


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    records = df.to_dict(orient="records")
    data_store.extend(records)

    return {
        "message": "CSV uploaded successfully",
        "records_added": len(records)
    }


@router.post("/json")
def ingest_json(data: dict):
    data_store.append(data)
    return {"message": "Data added successfully"}