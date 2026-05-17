from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_admin
from app.db.session import get_session
from app.models.domain import RegulationDocument, User
from app.schemas.admin import RegulationDocumentResponse
from app.services.regulation_ingestion_service import RegulationIngestionService

router = APIRouter()


@router.post("/regulations/upload", response_model=RegulationDocumentResponse)
async def upload_regulation(
    country_name: str = Form(...),
    regulator_name: str = Form(...),
    regulation_category: str = Form(...),
    license_type: str = Form(...),
    document_title: str = Form(...),
    source_url: str | None = Form(None),
    notes: str | None = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> RegulationDocumentResponse:
    document = await RegulationIngestionService().ingest(
        session,
        country_name=country_name,
        regulator_name=regulator_name,
        regulation_category=regulation_category,
        license_type=license_type,
        document_title=document_title,
        source_url=source_url,
        notes=notes,
        upload=file,
        current_user=current_user,
    )
    return _serialize(document)


@router.get("/regulations", response_model=list[RegulationDocumentResponse])
async def list_regulations(
    current_user: User = Depends(require_admin),
    session: AsyncSession = Depends(get_session),
) -> list[RegulationDocumentResponse]:
    _ = current_user
    documents = (await session.scalars(select(RegulationDocument).order_by(RegulationDocument.created_at.desc()))).all()
    return [_serialize(document) for document in documents]


def _serialize(document: RegulationDocument) -> RegulationDocumentResponse:
    return RegulationDocumentResponse(
        id=str(document.id),
        country_name=document.country_name,
        regulator_name=document.regulator_name,
        regulation_category=document.regulation_category,
        license_type=document.license_type,
        document_title=document.document_title,
        source_url=document.source_url,
        notes=document.notes,
        original_filename=document.original_filename,
        created_at=document.created_at,
    )
