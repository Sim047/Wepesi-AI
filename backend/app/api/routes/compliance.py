from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.compliance import ComplianceReportResponse, ComplianceRequestCreate
from app.services.compliance_service import ComplianceService

router = APIRouter()


@router.post("/analyze", response_model=ComplianceReportResponse)
async def analyze_compliance(
    payload: ComplianceRequestCreate,
    session: AsyncSession = Depends(get_session),
) -> ComplianceReportResponse:
    request, report = await ComplianceService().create_report(session, payload)
    return ComplianceReportResponse(
        request_id=str(request.id),
        report_id=str(report.id),
        report=report.report_json,
    )
