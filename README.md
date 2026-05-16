# Wepesi

Wepesi is an AI-native African fintech compliance MVP for Kenya to Nigeria payments and remittance expansion.

The MVP gives a fintech team a structured licensing view, compliance checklist, timeline, risk notes, and regulatory references using a FastAPI backend, a Next.js dashboard, PostgreSQL, Qdrant, and OpenAI-powered RAG.

## Monorepo Layout

```text
backend/   FastAPI API, auth, compliance workflow, RAG pipeline
frontend/  Next.js 14 app router UI
infra/     Docker Compose and deployment notes
docs/      Architecture, database schema, implementation plan
```

## Quick Start

1. Copy env files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. Start dependencies and apps:

```bash
docker compose up --build
```

3. In a backend shell, create the development tables:

```bash
python backend/scripts/init_db.py
```

4. Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs
- Qdrant: http://localhost:6333/dashboard

## MVP Scope

The first working path is intentionally narrow:

- Home country: Kenya
- Target country: Nigeria
- Business type: payments/remittance fintech
- Output: suggested license, checklist, capital requirements, timeline, risks, and references

This is not legal advice. Wepesi should be used as decision-support software and reviewed by qualified counsel before regulatory submission.
