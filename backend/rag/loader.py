from langchain_community.document_loaders import PyPDFLoader
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data"

def load_documents():
    documents = []

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Data directory not found: {DATA_PATH}")

    for pdf in sorted(DATA_PATH.glob("*.pdf")):
        loader = PyPDFLoader(str(pdf))
        docs = loader.load()
        documents.extend(docs)

    return documents