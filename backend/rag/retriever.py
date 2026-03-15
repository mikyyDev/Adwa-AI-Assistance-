from rag.vectordb import load_vector_db

def get_retriever():

    vectordb = load_vector_db()

    retriever = vectordb.as_retriever(
        search_kwargs={"k": 4}
    )

    return retriever


def get_relevant_documents(
    query: str,
    k: int = 4,
    min_relevance: float = 0.25,
):
    vectordb = load_vector_db()

    try:
        scored_docs = vectordb.similarity_search_with_relevance_scores(query, k=k)
    except Exception:
        # Fallback when score API is unavailable
        docs = vectordb.similarity_search(query, k=k)
        return [(doc, 1.0) for doc in docs]

    filtered = [
        (doc, score)
        for doc, score in scored_docs
        if score is not None and score >= min_relevance
    ]

    return filtered