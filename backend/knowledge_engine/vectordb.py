import json
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "chroma_db"
DATA_PATH = BASE_DIR / "data"
INDEX_META_FILE = "index_meta.json"
EMBEDDING_VERSION = "hashing-v1"
_VDB_CACHE = None

def create_vector_db(chunks):
    from langchain_chroma import Chroma
    from knowledge_engine.embeddings import get_embeddings

    embeddings = get_embeddings()

    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(DB_PATH)
    )

    return vectordb


def _current_data_snapshot() -> dict:
    files = []
    if DATA_PATH.exists():
        for pdf in sorted(DATA_PATH.glob("*.pdf")):
            stat = pdf.stat()
            files.append(
                {
                    "name": pdf.name,
                    "size": stat.st_size,
                    "mtime": int(stat.st_mtime),
                }
            )

    return {
        "files": files,
        "embedding_version": EMBEDDING_VERSION,
    }


def _meta_path() -> Path:
    return DB_PATH / INDEX_META_FILE


def _read_index_meta() -> dict | None:
    path = _meta_path()
    if not path.exists():
        return None

    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _write_index_meta(meta: dict) -> None:
    path = _meta_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(meta, indent=2), encoding="utf-8")


def _needs_reindex() -> bool:
    snapshot = _current_data_snapshot()
    existing_meta = _read_index_meta()

    if existing_meta is None:
        return True

    return existing_meta.get("files") != snapshot.get("files")


def ensure_vector_db_current() -> None:
    from knowledge_engine.loader import load_documents
    from knowledge_engine.splitter import split_documents

    db_dir = DB_PATH
    if not db_dir.exists() or _needs_reindex():
        if db_dir.exists():
            shutil.rmtree(db_dir)
        documents = load_documents()
        chunks = split_documents(documents)
        create_vector_db(chunks)
        _write_index_meta(_current_data_snapshot())


def load_vector_db():
    global _VDB_CACHE

    if _VDB_CACHE is not None:
        return _VDB_CACHE

    from langchain_chroma import Chroma
    from knowledge_engine.embeddings import get_embeddings

    ensure_vector_db_current()

    embeddings = get_embeddings()

    vectordb = Chroma(
        persist_directory=str(DB_PATH),
        embedding_function=embeddings
    )

    _VDB_CACHE = vectordb
    return _VDB_CACHE