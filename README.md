# Wepesi

Wepesi is an AI-native African fintech compliance platform for Kenya to Nigeria payments and remittance expansion.

The platform gives fintech teams a structured licensing view, compliance checklist, document inventory, timeline, risk notes, and regulatory references using a FastAPI backend, a Next.js dashboard, PostgreSQL, Qdrant, and OpenAI-powered RAG.

## Monorepo Layout

```text
backend/   FastAPI API, auth, compliance workflow, RAG pipeline
frontend/  Next.js 14 app router UI
infra/     Docker Compose and deployment notes
docs/      Architecture, database schema, implementation plan
```

## Core Features

- Email/password registration and JWT login
- Role-based users: first user becomes admin, later users are general users
- Admin-only regulation upload for PDF, TXT, and Markdown files
- Text extraction, chunking, embedding, and Qdrant indexing
- User-specific compliance requests and report access
- Structured AI compliance reports with categorized document requirements

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

## Initial Scope

The first working path is intentionally narrow:

- Home country: Kenya
- Target country: Nigeria
- Business type: payments/remittance fintech
- Output: suggested license, checklist, capital requirements, timeline, risks, and references

This is not legal advice. Wepesi should be used as decision-support software and reviewed by qualified counsel before regulatory submission.
