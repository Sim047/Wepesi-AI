# Wepesi MVP Implementation Plan

## Phase 1: Working Vertical Slice

- Run FastAPI, PostgreSQL, Qdrant, and Next.js with Docker Compose.
- Submit the fixed Kenya to Nigeria payments/remittance intake.
- Generate structured compliance JSON.
- Render the report in the frontend.

## Phase 2: Real Regulatory Knowledge

- Collect counsel-approved CBK and CBN public source PDFs.
- Ingest with the PDF script.
- Add exact source URL, document date, page number, and section metadata.
- Add reference quality checks so every report has citations.

## Phase 3: Authentication and Persistence

- Persist registered users with hashed passwords.
- Add JWT-protected request/report routes.
- Add dashboard history from PostgreSQL.
- Store AI generations and retrieved chunk IDs for audit.

## Phase 4: Submission-Ready Output

- Add exportable PDF or DOCX report generation.
- Add document checklist status tracking.
- Add counsel review workflow.
- Add jurisdiction and product expansion after the Kenya to Nigeria path is reliable.

## Phase 5: Deployment

- Deploy PostgreSQL on Railway or Render.
- Deploy Qdrant Cloud or a managed container.
- Deploy FastAPI as a web service.
- Deploy Next.js as a web service.
- Set `OPENAI_API_KEY`, `JWT_SECRET`, `DATABASE_URL`, `QDRANT_URL`, and `NEXT_PUBLIC_API_URL`.
