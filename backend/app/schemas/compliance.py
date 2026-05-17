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


class CategorizedDocumentItem(BaseModel):
    document_name: str
    purpose: str
    required_by: str
    priority: str


class CategorizedComplianceDocuments(BaseModel):
    licensing_documents: list[CategorizedDocumentItem]
    company_documents: list[CategorizedDocumentItem]
    aml_kyc_documents: list[CategorizedDocumentItem]
    financial_documents: list[CategorizedDocumentItem]
    technical_documents: list[CategorizedDocumentItem]
    risk_and_governance_documents: list[CategorizedDocumentItem]
    consumer_protection_documents: list[CategorizedDocumentItem]
    data_protection_documents: list[CategorizedDocumentItem]


class ComplianceReportJSON(BaseModel):
    executive_summary: str
    license_category: str
    license_reasoning: str
    required_documents: list[str]
    capital_requirements: str
    estimated_timeline: str
    compliance_steps: list[str]
    categorized_documents: CategorizedComplianceDocuments
    regulatory_references: list[RegulatoryReference]
    risks: list[str]
    next_actions: list[str]


class ComplianceReportResponse(BaseModel):
    request_id: str
    report_id: str | None = None
    report: ComplianceReportJSON


class ComplianceReportListItem(BaseModel):
    request_id: str
    report_id: str
    home_country: str
    target_country: str
    product_category: str
    created_at: str
    report: ComplianceReportJSON
