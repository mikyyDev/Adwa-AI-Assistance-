from langchain_core.embeddings import Embeddings
from sklearn.feature_extraction.text import HashingVectorizer


class HashingEmbeddings(Embeddings):
    """Fast local embeddings for environments where model downloads are slow/unavailable."""

    def __init__(self, n_features: int = 384):
        self.vectorizer = HashingVectorizer(
            n_features=n_features,
            alternate_sign=False,
            norm="l2",
        )

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        matrix = self.vectorizer.transform(texts)
        return matrix.toarray().tolist()

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


def get_embeddings() -> Embeddings:
    return HashingEmbeddings()