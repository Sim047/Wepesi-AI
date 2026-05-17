# Deployment Guide

## Current Production Layout

- Frontend: Vercel project `frontend`
- Backend: Render web service `wepesi-api`
- Database: dedicated Supabase project `Wepesi AI`
- Vector search: Qdrant Cloud or Render-hosted Qdrant
- Source repository: `https://github.com/Sim047/Wepesi-AI`

## Supabase

Dedicated project:

- Name: `Wepesi AI`
- Project ref: `drhcgdnvgehxjyfaduel`
- Region: `eu-central-1`
- API URL: `https://drhcgdnvgehxjyfaduel.supabase.co`

The initial schema is stored in:

```text
supabase/migrations/20260517000000_initial_schema.sql
```

The app backend needs the Supabase Postgres connection string in Render:

```text
DATABASE_URL=postgresql://postgres.<project-ref>:<database-password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Replace `<project-ref>` with `drhcgdnvgehxjyfaduel` and `<database-password>` with the database password from the Supabase dashboard.

## Render Backend

The repository includes a Render Blueprint:

```text
render.yaml
```

Create a new Blueprint or Web Service in Render from the GitHub repository and point it at `render.yaml`.

Required Render environment variables:

```text
DATABASE_URL=<dedicated Supabase Postgres connection string>
QDRANT_URL=<Qdrant Cloud URL or Render Qdrant URL>
QDRANT_COLLECTION=regulatory_chunks
OPENAI_API_KEY=<OpenAI API key>
OPENAI_MODEL=gpt-5
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
JWT_SECRET=<generated secret>
JWT_ALGORITHM=HS256
CORS_ORIGINS=<Vercel production URL>
```

Expected health check:

```text
https://wepesi-api.onrender.com/health
```

## Railway Backend

Railway can also run the backend from `backend/Dockerfile`.

Use:

```text
Root directory: backend
Build: Dockerfile
Health check path: /health
```

Set the same environment variables listed for Render.

## Vercel Frontend

Set the frontend environment variable:

```text
NEXT_PUBLIC_API_URL=https://wepesi-api.onrender.com
```

Vercel builds from the root and delegates to `frontend/` through `vercel.json`.

## Security Note

The Wepesi tables are intended for backend-only database access. If Supabase client access is introduced in the frontend, enable Row Level Security and add policies before exposing keys to browsers.

## Email Note

Resend is not a backend hosting target. Use Resend only for email workflows such as account verification, password reset, report delivery, and admin notifications.
