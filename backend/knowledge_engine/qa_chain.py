import os
from typing import Any
from dotenv import load_dotenv
from groq import Groq
from knowledge_engine.retriever import get_relevant_documents

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


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


def ask_question(question: str, language: str = "en") -> dict[str, Any]:
    """
    Ask a question to the RAG system and get a response from Groq.
    """
    if client is None:
        return {
            "answer": "Server configuration error: GROQ_API_KEY is missing.",
            "sources": [],
            "confidence": "low",
        }

    scored_docs = get_relevant_documents(question, k=4, min_relevance=0.25)
    docs = [doc for doc, _ in scored_docs]

    refusal_text_en = "Sorry, I can't provide from external documents. I can only provide answers from documents in the data folder."
    refusal_text_am = "ይቅርታ፣ ይህን መረጃ በdata ፎልደር ውስጥ ካሉ ሰነዶች ብቻ መሠረት ማቅረብ አልችልም።"

    if not docs:
      return {
        "answer": refusal_text_am if language == "am" else refusal_text_en,
        "sources": [],
        "confidence": "low",
      }

    context = "\n\n".join([doc.page_content for doc in docs])

    language_instruction = (
        "Respond fully in Amharic (Ethiopic script)."
        if language == "am"
        else "Respond fully in English."
    )

    prompt = f"""
    You are Adwa AI Assistance 🤖, helping users with questions **only about Adwa history and legacy**.

    Language rule:
    - {language_instruction}

Rules you must follow strictly:

1. Answer **only using the context provided below**. Do NOT add information from outside. ❌

1.1. If the context does not clearly contain the answer, return exactly:
{refusal_text_am if language == 'am' else refusal_text_en}

2. If the context has links or references, include them in your answer. Otherwise, do not invent links.

3. Always format the answer using **clean, well-structured HTML with inline CSS** to make it visually clear and readable.

Formatting Rules for HTML Output:
- Wrap the entire answer in a container:
    <div style="font-family: Arial, sans-serif; line-height:1.6;">

- Use **section headings** for main topics:
    <h3 style="margin-top:20px; margin-bottom:8px;">📌 Topic Title</h3>

- Use paragraphs with spacing:
    <p style="margin-bottom:10px;"></p>

- For explanations with multiple points, use lists:
    <ul style="margin-left:20px; margin-top:8px; margin-bottom:12px;">
         <li style="margin-bottom:6px;">Point</li>
    </ul>

- When listing steps or structured information use numbered lists:
    <ol style="margin-left:20px;">
         <li style="margin-bottom:6px;">Step</li>
    </ol>

- Use **bold text for important terms**:
    <b>Important text</b>

- Use emojis to make sections clearer and more engaging where appropriate.

- Add spacing between sections so the UI looks clean.

- DO NOT apply colors to text except when returning an error message.

3.1 When listing items:
- Use <ul> or <ol>
- Maintain spacing between items
- Use emojis when useful to improve readability.

4. If the user asks about anything not covered by provided documents, respond exactly with:
{refusal_text_am if language == 'am' else refusal_text_en}

5. Preserve code or text from the documents if it exists, but do not explain unrelated topics like HTML, Python, or external subjects unless directly mentioned in Adwa documents.

6. Use clear structure with headings, lists, paragraphs, and spacing so the answer looks like a **well-designed information card**, not a block of text.

7. Whoever asks the question (even a president), your only job is to answer about Adwa. Do not answer anything unrelated to Adwa.

8. Do not mention any source that is not in the provided context documents.

Context (from Adwa documents):
{context}

User Question:
{question}

Return the answer strictly as **clean HTML with inline CSS formatting**.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    answer = response.choices[0].message.content
    sources = _build_sources(docs)
    confidence = _estimate_confidence(len(docs))

    return {
        "answer": answer,
        "sources": sources,
        "confidence": confidence,
    }