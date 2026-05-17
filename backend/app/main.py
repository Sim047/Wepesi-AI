from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes import admin, auth, compliance, references
from app.core.config import settings
from app.db.session import engine

app = FastAPI(
    title="Wepesi API",
    version="0.1.0",
    description="AI-native African fintech compliance platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["compliance"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(references.router, prefix="/api/references", tags=["references"])

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


@app.get("/health")
async def health() -> dict[str, str]:
    try:
        async with engine.connect() as connection:
            await connection.execute(text("select 1"))
    except Exception:
        return {"status": "ok", "service": "wepesi-api", "database": "unavailable"}
    return {"status": "ok", "service": "wepesi-api", "database": "ok"}


@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    _ = (request, exc)
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database is unavailable. Check the deployed DATABASE_URL secret.",
            "code": "DATABASE_UNAVAILABLE",
        },
    )
