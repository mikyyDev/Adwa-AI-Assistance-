from fastapi import APIRouter
from pydantic import BaseModel
from rag.qa_chain import ask_question

router = APIRouter()

class Question(BaseModel):
    question: str
    language: str = "en"


@router.post("/chat")
def chat(q: Question):

    result = ask_question(q.question, q.language)

    return result


    