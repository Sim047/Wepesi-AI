import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_session
from app.models.domain import ComplianceReport, ComplianceRequest, User
from app.schemas.compliance import ComplianceReportListItem, ComplianceReportResponse, ComplianceRequestCreate
from app.services.compliance_service import ComplianceService

router = APIRouter()


@router.post("/analyze", response_model=ComplianceReportResponse)
async def analyze_compliance(
    payload: ComplianceRequestCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ComplianceReportResponse:
    request, report = await ComplianceService().create_report(session, payload, user_id=current_user.id)
    return ComplianceReportResponse(
        request_id=str(request.id),
        report_id=str(report.id),
        report=report.report_json,
    )


@router.get("/reports", response_model=list[ComplianceReportListItem])
async def list_reports(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> list[ComplianceReportListItem]:
    rows = (
        await session.execute(
            select(ComplianceRequest, ComplianceReport)
            .join(ComplianceReport, ComplianceReport.request_id == ComplianceRequest.id)
            .where(ComplianceRequest.user_id == current_user.id)
            .order_by(ComplianceReport.created_at.desc())
        )
    ).all()
    return [_serialize_report(request, report) for request, report in rows]


@router.get("/reports/{report_id}", response_model=ComplianceReportListItem)
async def get_report(
    report_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ComplianceReportListItem:
    try:
        parsed_id = uuid.UUID(report_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Report not found") from exc

    row = (
        await session.execute(
            select(ComplianceRequest, ComplianceReport)
            .join(ComplianceReport, ComplianceReport.request_id == ComplianceRequest.id)
            .where(ComplianceReport.id == parsed_id, ComplianceRequest.user_id == current_user.id)
        )
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Report not found")
    request, report = row
    return _serialize_report(request, report)


def _serialize_report(request: ComplianceRequest, report: ComplianceReport) -> ComplianceReportListItem:
    return ComplianceReportListItem(
        request_id=str(request.id),
        report_id=str(report.id),
        home_country=request.home_country,
        target_country=request.target_country,
        product_category=request.product_category,
        created_at=report.created_at.isoformat(),
        report=report.report_json,
    )
