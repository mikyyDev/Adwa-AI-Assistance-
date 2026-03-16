# Adwa AI Assistance

**A Specialized Bilingual AI-Powered Learning Platform**  
**Dedicated to the History, Significance, and Legacy of the Battle of Adwa (March 1, 1896)**

---

## Overview

**Adwa AI Assistance** is a focused, educational AI platform that preserves and shares accurate knowledge about one of Africa's most pivotal historical events: **the Battle of Adwa**.

On March 1, 1896, Ethiopian forces led by **Emperor Menelik II** achieved a decisive victory over Italian colonial troops. This triumph preserved Ethiopia's independence at a time when much of Africa was under European colonization and became a powerful global symbol of African resistance, unity, and pan-African pride.

The platform delivers **evidence-based, trustworthy answers** in both **English** and **Amharic** through a modern, intuitive chat interface — making Ethiopian history accessible, engaging, and accurate for students, researchers, educators, and the general public worldwide.

---

## ✨ Why This Project Matters

- **Highly Focused Domain Expertise** — Unlike general-purpose chatbots, Adwa AI is built exclusively around the Battle of Adwa and related Ethiopian/East African history.
- **True Bilingual Experience** — Natural, fluent conversations in **English** and **Amharic**.
- **Transparency & Trust** — Every response includes source references, confidence indicators, and direct excerpts from historical documents and PDFs.
- **Educational & Engaging** — Rich features including interactive timeline visualization, quizzes, guided learning prompts, and showcase modes.
- **Production-Ready Full-Stack Application** — Built with modern, scalable technologies for reliability and performance.

---

## Key Features

- Accurate, sourced answers about the Battle of Adwa, Emperor Menelik II, Ethiopian resistance, and its pan-African legacy.
- Seamless bilingual support (English ↔ Amharic).
- Interactive historical timeline.
- Educational quizzes and guided prompts.
- Source citations with document snippets.
- Clean, modern chat interface with showcase and learning modes.

---

## Architecture Overview

```mermaid
flowchart TD
    A[User] -->|Chat Query| B[Next.js Frontend]
    B --> C[FastAPI Backend]
    C --> D[Retriever / QA Chain]
    D --> E[Chroma Vector DB]
    E --> F[Adwa Historical PDFs & Documents]
    D --> G[Groq LLM]
    G --> D
    C --> B
