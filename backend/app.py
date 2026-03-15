from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from rag.loader import load_documents
from rag.splitter import split_documents
from rag.vectordb import create_vector_db
from api.chat import router as chat_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")