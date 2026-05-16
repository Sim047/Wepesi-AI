# Deployment Guide

## Railway

1. Create PostgreSQL.
2. Create a FastAPI service from `backend/`.
3. Create a Next.js service from `frontend/`.
4. Add Qdrant Cloud or a Qdrant service.
5. Set environment variables:
   - `DATABASE_URL`
   - `QDRANT_URL`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `OPENAI_EMBEDDING_MODEL`
   - `JWT_SECRET`
   - `CORS_ORIGINS`
   - `NEXT_PUBLIC_API_URL`

## Render

1. Create managed PostgreSQL.
2. Create web service for `backend` using Docker.
3. Create web service for `frontend` using Docker.
4. Use Qdrant Cloud for vector search.
5. Configure the same environment variables.

## Pre-Launch Checklist

- Add refresh tokens, email verification, and password reset.
- Run database migrations.
- Load counsel-reviewed source documents.
- Validate citations and capital requirements.
- Add legal disclaimer to generated reports.
