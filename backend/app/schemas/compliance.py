from pydantic import BaseModel, Field


class ComplianceRequestCreate(BaseModel):
    home_country: str = "Kenya"
    target_country: str = "Nigeria"
    business_type: str = "Fintech startup"
    transaction_model: str = "Cross-border payments and remittance"
    product_category: str = "Payments/remittance"
    holds_customer_funds: bool = True
    cross_border_transfers: bool = True
    feature_flags: list[str] = Field(default_factory=lambda: ["payments", "remittance", "wallets"])


class RegulatoryReference(BaseModel):
    regulator: str
    title: str
    citation: str
    url: str | None = None


class ComplianceReportJSON(BaseModel):
    executive_summary: str
    license_category: str
    license_reasoning: str
    required_documents: list[str]
    capital_requirements: str
    estimated_timeline: str
    compliance_steps: list[str]
    regulatory_references: list[RegulatoryReference]
    risks: list[str]
    next_actions: list[str]


class ComplianceReportResponse(BaseModel):
    request_id: str
    report_id: str | None = None
    report: ComplianceReportJSON
