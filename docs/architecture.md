# Wepesi MVP Architecture

## Product Boundary

Wepesi starts with one high-value corridor: Kenya fintechs expanding into Nigeria for payments and remittance products.

The MVP is a structured workflow, not an autonomous legal agent:

1. User completes a regulatory intake.
2. Backend retrieves relevant CBK and CBN regulatory chunks.
3. LLM receives the intake plus retrieved context.
4. Wepesi returns a strict JSON compliance report.
5. Frontend renders the report into an executive-ready view.

## Backend

- `FastAPI` exposes auth, intake analysis, and references routes.
- `SQLAlchemy` models represent users, requests, regulations, chunks, reports, and AI generations.
- `ComplianceService` owns the analysis workflow.
- `RegulatoryRetriever` connects OpenAI embeddings and Qdrant.
- `StaticRegulatoryRetriever` keeps the demo usable without external credentials.

## Frontend

- `Next.js 14` app router.
- Tailwind design system inspired by modern enterprise SaaS.
- Pages: landing, dashboard, intake, report, references.
- The current intake is fixed to the MVP corridor to avoid false breadth.

## RAG Pipeline

1. Upload or place regulatory PDFs locally.
2. Run `backend/scripts/ingest_pdfs.py`.
3. Parse PDFs with `PyPDFLoader`.
4. Chunk with recursive text splitting.
5. Embed with OpenAI embeddings.
6. Store chunks in Qdrant with regulator/country/title/citation metadata.
7. Retrieve top chunks during compliance analysis.

## Production Notes

- Add refresh tokens and password reset before public launch.
- Store AI generations for auditability.
- Add source URLs and exact section citations during ingestion.
- Add counsel-reviewed rule packs for license classification.
- Add role-based access controls before multi-company rollout.
