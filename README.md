Adwa AI Assistance
Adwa AI Assistance is a specialized, bilingual AI-powered learning platform dedicated to the history, significance, and legacy of the Battle of Adwa (March 1, 1896) — Ethiopia's decisive victory over Italian colonial forces under Emperor Menelik II, which preserved Ethiopian independence and became a powerful symbol of African resistance and pan-African pride.
The platform provides accurate, evidence-based answers in English and Amharic, delivered through an intuitive modern chat interface.
✨ Why This Project Matters

Highly focused domain knowledge — Built exclusively around the Battle of Adwa and related Ethiopian history (not a general-purpose chatbot).
True bilingual experience — Full support for natural conversation in both English and Amharic.
Transparency & trustworthiness — Responses include source references, confidence indicators, and direct snippets from historical documents/PDFs.
Educational & engaging UI — Features timeline visualization, interactive quizzes, guided prompts, and showcase modes.
Production-ready full-stack — Modern Next.js frontend + FastAPI backend with vector search.

Architecture Overview
#mermaid-diagram-mermaid-nkykq0j{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:#ccc;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-diagram-mermaid-nkykq0j .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-diagram-mermaid-nkykq0j .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-diagram-mermaid-nkykq0j .error-icon{fill:#a44141;}#mermaid-diagram-mermaid-nkykq0j .error-text{fill:#ddd;stroke:#ddd;}#mermaid-diagram-mermaid-nkykq0j .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-mermaid-nkykq0j .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-mermaid-nkykq0j .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-mermaid-nkykq0j .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-mermaid-nkykq0j .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-mermaid-nkykq0j .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-mermaid-nkykq0j .marker{fill:lightgrey;stroke:lightgrey;}#mermaid-diagram-mermaid-nkykq0j .marker.cross{stroke:lightgrey;}#mermaid-diagram-mermaid-nkykq0j svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid-diagram-mermaid-nkykq0j p{margin:0;}#mermaid-diagram-mermaid-nkykq0j .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:#ccc;}#mermaid-diagram-mermaid-nkykq0j .cluster-label text{fill:#F9FFFE;}#mermaid-diagram-mermaid-nkykq0j .cluster-label span{color:#F9FFFE;}#mermaid-diagram-mermaid-nkykq0j .cluster-label span p{background-color:transparent;}#mermaid-diagram-mermaid-nkykq0j .label text,#mermaid-diagram-mermaid-nkykq0j span{fill:#ccc;color:#ccc;}#mermaid-diagram-mermaid-nkykq0j .node rect,#mermaid-diagram-mermaid-nkykq0j .node circle,#mermaid-diagram-mermaid-nkykq0j .node ellipse,#mermaid-diagram-mermaid-nkykq0j .node polygon,#mermaid-diagram-mermaid-nkykq0j .node path{fill:#1f2020;stroke:#ccc;stroke-width:1px;}#mermaid-diagram-mermaid-nkykq0j .rough-node .label text,#mermaid-diagram-mermaid-nkykq0j .node .label text,#mermaid-diagram-mermaid-nkykq0j .image-shape .label,#mermaid-diagram-mermaid-nkykq0j .icon-shape .label{text-anchor:middle;}#mermaid-diagram-mermaid-nkykq0j .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-mermaid-nkykq0j .rough-node .label,#mermaid-diagram-mermaid-nkykq0j .node .label,#mermaid-diagram-mermaid-nkykq0j .image-shape .label,#mermaid-diagram-mermaid-nkykq0j .icon-shape .label{text-align:center;}#mermaid-diagram-mermaid-nkykq0j .node.clickable{cursor:pointer;}#mermaid-diagram-mermaid-nkykq0j .root .anchor path{fill:lightgrey!important;stroke-width:0;stroke:lightgrey;}#mermaid-diagram-mermaid-nkykq0j .arrowheadPath{fill:lightgrey;}#mermaid-diagram-mermaid-nkykq0j .edgePath .path{stroke:lightgrey;stroke-width:2.0px;}#mermaid-diagram-mermaid-nkykq0j .flowchart-link{stroke:lightgrey;fill:none;}#mermaid-diagram-mermaid-nkykq0j .edgeLabel{background-color:hsl(0, 0%, 34.4117647059%);text-align:center;}#mermaid-diagram-mermaid-nkykq0j .edgeLabel p{background-color:hsl(0, 0%, 34.4117647059%);}#mermaid-diagram-mermaid-nkykq0j .edgeLabel rect{opacity:0.5;background-color:hsl(0, 0%, 34.4117647059%);fill:hsl(0, 0%, 34.4117647059%);}#mermaid-diagram-mermaid-nkykq0j .labelBkg{background-color:rgba(87.75, 87.75, 87.75, 0.5);}#mermaid-diagram-mermaid-nkykq0j .cluster rect{fill:hsl(180, 1.5873015873%, 28.3529411765%);stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-diagram-mermaid-nkykq0j .cluster text{fill:#F9FFFE;}#mermaid-diagram-mermaid-nkykq0j .cluster span{color:#F9FFFE;}#mermaid-diagram-mermaid-nkykq0j div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:hsl(20, 1.5873015873%, 12.3529411765%);border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-mermaid-nkykq0j .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-diagram-mermaid-nkykq0j rect.text{fill:none;stroke-width:0;}#mermaid-diagram-mermaid-nkykq0j .icon-shape,#mermaid-diagram-mermaid-nkykq0j .image-shape{background-color:hsl(0, 0%, 34.4117647059%);text-align:center;}#mermaid-diagram-mermaid-nkykq0j .icon-shape p,#mermaid-diagram-mermaid-nkykq0j .image-shape p{background-color:hsl(0, 0%, 34.4117647059%);padding:2px;}#mermaid-diagram-mermaid-nkykq0j .icon-shape rect,#mermaid-diagram-mermaid-nkykq0j .image-shape rect{opacity:0.5;background-color:hsl(0, 0%, 34.4117647059%);fill:hsl(0, 0%, 34.4117647059%);}#mermaid-diagram-mermaid-nkykq0j :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}POST /api/chatUserNext.js FrontendFastAPI BackendRetriever / QA ChainChroma Vector DBAdwa Historical PDFs & DocumentsGroq LLM
Tech Stack
Frontend

Next.js 16 (App Router)
React 19
TypeScript
Tailwind CSS

Backend

FastAPI (Python)
LangChain + Chroma (vector database & retrieval)
Groq API (fast LLM inference)
Python 3.11+

Project Structure
textAdwa-AI-Assistance/
├── backend/
│   ├── app.py                # Main FastAPI application
│   ├── api/
│   │   └── chat.py           # Chat endpoint
│   ├── knowledge_engine/
│   │   ├── loader.py         # Document loading
│   │   ├── splitter.py       # Text splitting
│   │   ├── retriever.py      # Retrieval logic
│   │   ├── vectordb.py       # Chroma DB management
│   │   └── qa_chain.py       # RAG / QA pipeline
│   ├── data/                 # (gitignored) knowledge PDFs
│   └── requirements.txt
│
├── frontend/
│   ├── app/                  # Next.js pages & layouts
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── public/
│   └── ...
│
├── .env.example
└── README.md
🚀 Quick Start – Local Development
1. Clone the repository
Bashgit clone https://github.com/mikyyDev/Adwa-AI-Assistance-.git
cd Adwa-AI-Assistance-
2. Backend Setup
Bashcd backend
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
Create .env in backend/:
envGROQ_API_KEY=your_groq_api_key_here
# Optional: FRONTEND_URL=http://localhost:3000  (for CORS in dev)
Start the backend:
Bashuvicorn app:app --host 127.0.0.1 --port 8000 --reload
3. Frontend Setup
Bashcd ../frontend
npm install
npm run dev
Open → http://localhost:3000
The frontend will connect to the backend at http://localhost:8000.
