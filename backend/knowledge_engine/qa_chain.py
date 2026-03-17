import os
import re
import time
from types import SimpleNamespace
from typing import Any
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


def _normalize_text(value: str) -> str:
        return re.sub(r"\s+", " ", value.strip().lower())


def _is_greeting(question: str) -> bool:
        normalized = _normalize_text(question)

        greeting_patterns = [
                r"^(hi|hello|hey|selam|peace|yo)\b",
                r"^(good morning|good afternoon|good evening)\b",
                r"^(how are you|how are u)\b",
                r"^(ሰላም|ሀሎ|ሄይ|ጤና ይስጥልኝ|እንዴት ነህ|እንዴት ነሽ)\b",
        ]

        return any(re.search(pattern, normalized) for pattern in greeting_patterns)


def _greeting_response(language: str) -> dict[str, Any]:
        if language == "am":
                return {
                        "answer": """
<div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h3 style="margin-top:20px; margin-bottom:8px;">👋 ሰላም እንኳን ደህና መጡ</h3>
    <p style="margin-bottom:10px;">እኔ <b>Adwa AI Assistance</b> ነኝ። ስለ የአድዋ ጦርነት፣ ታሪኩ፣ መሪዎቹ እና ትሩፋቱ ልረዳዎ እችላለሁ።</p>
    <h3 style="margin-top:20px; margin-bottom:8px;">📌 ሊጠይቁኝ የሚችሉት</h3>
    <ul style="margin-left:20px; margin-top:8px; margin-bottom:12px;">
        <li style="margin-bottom:6px;">የአድዋ ጦርነት መቼ እና እንዴት ተካሄደ?</li>
        <li style="margin-bottom:6px;">አፄ ምኒልክ ሁለተኛ በአድዋ ያደረጉት ምንድን ነው?</li>
        <li style="margin-bottom:6px;">የአድዋ ድል ለኢትዮጵያ እና ለአፍሪካ ምን ማለት ነው?</li>
    </ul>
    <p style="margin-bottom:10px;">🟢 ስለ አድዋ ቀጥታ ጥያቄ ይጻፉልኝ።</p>
</div>
""".strip(),
                        "sources": [],
                        "confidence": "high",
                }

        return {
                "answer": """
<div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h3 style="margin-top:20px; margin-bottom:8px;">👋 Welcome to Adwa AI Assistance</h3>
    <p style="margin-bottom:10px;">I can help you explore the <b>Battle of Adwa</b>, its history, leaders, significance, and legacy using the project documents.</p>
    <h3 style="margin-top:20px; margin-bottom:8px;">📌 You Can Ask Me</h3>
    <ul style="margin-left:20px; margin-top:8px; margin-bottom:12px;">
        <li style="margin-bottom:6px;">What happened at the Battle of Adwa?</li>
        <li style="margin-bottom:6px;">What role did Menelik II play in the victory?</li>
        <li style="margin-bottom:6px;">Why is Adwa important for Ethiopia and Africa?</li>
    </ul>
    <p style="margin-bottom:10px;">🟢 Send any Adwa-related question and I will answer in a structured format.</p>
</div>
""".strip(),
                "sources": [],
                "confidence": "high",
        }


def _build_sources(docs: list[Any]) -> list[dict[str, str]]:
    sources: list[dict[str, str]] = []
    seen: set[str] = set()

    for doc in docs:
        metadata = getattr(doc, "metadata", {}) or {}
        page_content = getattr(doc, "page_content", "") or ""

        title = str(metadata.get("source", "Adwa Knowledge Document")).split("/")[-1]
        page_number = metadata.get("page")
        reference = f"p.{page_number + 1}" if isinstance(page_number, int) else ""
        snippet = " ".join(page_content.split())[:200]
        identity = f"{title}:{reference}:{snippet[:60]}"

        if identity in seen:
            continue

        seen.add(identity)
        sources.append(
            {
                "title": title,
                "snippet": snippet,
                "reference": reference,
            }
        )

        if len(sources) >= 4:
            break

    return sources


def _estimate_confidence(docs_count: int) -> str:
    if docs_count >= 3:
        return "high"
    if docs_count >= 1:
        return "medium"
    return "low"


_STOP_WORDS = {
    "the",
    "is",
    "are",
    "a",
    "an",
    "of",
    "to",
    "in",
    "on",
    "for",
    "and",
    "or",
    "who",
    "what",
    "when",
    "where",
    "why",
    "how",
    "about",
    "tell",
    "me",
}


def _extract_keywords(question: str) -> list[str]:
    tokens = re.findall(r"\w+", question.lower())
    return [
        token
        for token in tokens
        if token not in _STOP_WORDS and (len(token) >= 3 or any(ord(ch) > 127 for ch in token))
    ]


def _has_keyword_support(question: str, docs: list[Any]) -> bool:
    keywords = _extract_keywords(question)
    if not keywords:
        return True

    context_text = " ".join(
        (getattr(doc, "page_content", "") or "")[:2000].lower() for doc in docs[:3]
    )
    compact_context = re.sub(r"\s+", "", context_text)

    matched = sum(
        1
        for keyword in keywords
        if keyword in context_text or re.sub(r"\s+", "", keyword) in compact_context
    )
    required = 1 if len(keywords) <= 2 else max(1, len(keywords) // 2)
    return matched >= required


def _keyword_fallback_documents(question: str, limit: int = 4) -> list[Any]:
    """Fallback lexical retrieval for known entities missed by vector similarity."""
    keywords = _extract_keywords(question)
    if not keywords:
        return []

    try:
        from knowledge_engine.vectordb import load_vector_db

        vectordb = load_vector_db()
        rows = vectordb.get(include=["documents", "metadatas"])
    except Exception:
        return []

    documents = rows.get("documents", []) or []
    metadatas = rows.get("metadatas", []) or []
    ranked: list[tuple[int, Any]] = []

    for idx, content in enumerate(documents):
        text = str(content or "")
        lowered = text.lower()
        compact = re.sub(r"\s+", "", lowered)

        matched = sum(
            1
            for keyword in keywords
            if keyword in lowered or re.sub(r"\s+", "", keyword) in compact
        )
        if matched == 0:
            continue

        metadata = metadatas[idx] if idx < len(metadatas) and metadatas[idx] else {}
        ranked.append((matched, SimpleNamespace(page_content=text, metadata=metadata)))

    ranked.sort(key=lambda item: item[0], reverse=True)
    return [doc for _, doc in ranked[:limit]]


def ask_question(question: str, language: str = "en") -> dict[str, Any]:
    """
    Ask a question to the RAG system and get a response from Groq.
    """
    from knowledge_engine.retriever import get_relevant_documents

    if client is None:
        return {
            "answer": "Server configuration error: GROQ_API_KEY is missing.",
            "sources": [],
            "confidence": "low",
        }

    if _is_greeting(question):
        return _greeting_response(language)

    try:
        # First pass: strict relevance to reduce hallucinations.
        scored_docs = get_relevant_documents(question, k=4, min_relevance=0.35)
        docs = [doc for doc, _ in scored_docs]

        # Second pass: relaxed retrieval for names/entities that may score lower due to OCR/chunking.
        if not docs:
            scored_docs = get_relevant_documents(
                question,
                k=8,
                min_relevance=0.0,
                allow_unfiltered=True,
            )
            docs = [doc for doc, _ in scored_docs]

        if not docs or not _has_keyword_support(question, docs):
            docs = _keyword_fallback_documents(question, limit=4)
    except Exception:
        fallback_error = (
            "ይቅርታ፣ ሰነዶችን ማስነሳት አልተቻለም። እባክዎ ትንሽ ቆይተው ይሞክሩ።"
            if language == "am"
            else "Sorry, I could not load the local documents. Please try again in a moment."
        )
        return {
            "answer": fallback_error,
            "sources": [],
            "confidence": "low",
        }

    refusal_text_en = "Sorry, I can't provide from external documents. I can only provide answers from documents in the data folder."
    refusal_text_am = "ይቅርታ፣ ይህን መረጃ በdata ፎልደር ውስጥ ካሉ ሰነዶች ብቻ መሠረት ማቅረብ አልችልም።"

    if not docs:
        return {
            "answer": refusal_text_am if language == "am" else refusal_text_en,
            "sources": [],
            "confidence": "low",
        }

    if not _has_keyword_support(question, docs):
        return {
            "answer": refusal_text_am if language == "am" else refusal_text_en,
            "sources": [],
            "confidence": "low",
        }

    # Keep prompt compact to reduce timeout/rate-limit failures on long chunks.
    context = "\n\n".join([doc.page_content[:500] for doc in docs[:2]])

    language_instruction = (
        "Respond fully in Amharic (Ethiopic script)."
        if language == "am"
        else "Respond fully in English."
    )

    prompt = f"""
You are Adwa AI Assistance.
{language_instruction}

Rules:
1) Use only the provided context. No outside facts.
2) If context is insufficient, return exactly:
{refusal_text_am if language == 'am' else refusal_text_en}
3) Output clean HTML only using this structure:
<div style="font-family: Arial, sans-serif; line-height:1.6;">
  <h3 style="margin-top:20px; margin-bottom:8px;">📍 Quick Context</h3>
  <p style="margin-bottom:10px;">...</p>
  <h3 style="margin-top:20px; margin-bottom:8px;">📝 Key Details</h3>
  <ul style="margin-left:20px; margin-top:8px; margin-bottom:12px;"><li style="margin-bottom:6px;">...</li></ul>
  <h3 style="margin-top:20px; margin-bottom:8px;">📚 Source</h3>
  <p style="margin-bottom:10px;">Mention only provided source titles.</p>
</div>
4) Do not mention sources not in context.

Context:
{context}

Question:
{question}
"""

    answer: str | None = None
    last_error: Exception | None = None

    for attempt in range(3):
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                timeout=90,
            )
            answer = response.choices[0].message.content
            break
        except Exception as exc:
            last_error = exc
            if attempt < 2:
                time.sleep(1.0 + attempt)

    if answer is None:
        print(f"[qa_chain] Groq generation failed after retries: {last_error}")
        fallback_error = (
            "ይቅርታ፣ አሁን ምላሽ ማመንጨት አልቻልኩም። እባክዎ ትንሽ ቆይተው ደግመው ይሞክሩ።"
            if language == "am"
            else "Sorry, I could not generate a response right now. Please try again shortly."
        )
        return {
            "answer": fallback_error,
            "sources": _build_sources(docs),
            "confidence": "low",
        }
    sources = _build_sources(docs)
    confidence = _estimate_confidence(len(docs))

    return {
        "answer": answer,
        "sources": sources,
        "confidence": confidence,
    }