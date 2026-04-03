from fastapi import APIRouter
from pydantic import BaseModel
from app.services.query_service import handle_query

router = APIRouter(prefix="/query")


class QueryRequest(BaseModel):
    question: str


@router.post("/")
def query_system(payload: QueryRequest):
    return handle_query(payload.question)
