from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, auth, compliance, references
from app.core.config import settings

app = FastAPI(
    title="Wepesi API",
    version="0.1.0",
    description="AI-native African fintech compliance platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
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
    return {"status": "ok", "service": "wepesi-api"}
