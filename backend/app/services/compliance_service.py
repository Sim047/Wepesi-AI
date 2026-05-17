import json
import uuid

from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.domain import ComplianceReport, ComplianceRequest
from app.rag.retriever import RetrievedContext, get_retriever
from app.schemas.compliance import ComplianceReportJSON, ComplianceRequestCreate

SYSTEM_PROMPT = """You are Wepesi, an African fintech compliance analyst.
Return only valid JSON matching this schema:
{
  "executive_summary": "string",
  "license_category": "string",
  "license_reasoning": "string",
  "required_documents": ["string"],
  "capital_requirements": "string",
  "estimated_timeline": "string",
  "compliance_steps": ["string"],
  "categorized_documents": {
    "licensing_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "company_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "aml_kyc_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "financial_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "technical_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "risk_and_governance_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "consumer_protection_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}],
    "data_protection_documents": [{"document_name": "string", "purpose": "string", "required_by": "string", "priority": "High|Medium|Low"}]
  },
  "regulatory_references": [{"regulator": "string", "title": "string", "citation": "string", "url": null}],
  "risks": ["string"],
  "next_actions": ["string"]
}
Do not invent binding legal advice. Flag uncertainty and cite retrieved references.
"""


class ComplianceService:
    async def create_report(
        self,
        session: AsyncSession,
        payload: ComplianceRequestCreate,
        user_id: uuid.UUID | None = None,
    ) -> tuple[ComplianceRequest, ComplianceReport]:
        request = ComplianceRequest(user_id=user_id, **payload.model_dump())
        session.add(request)
        await session.flush()

        contexts = await get_retriever().search(
            self._build_query(payload),
            country=payload.target_country,
            product_type=payload.product_category,
            business_type=payload.business_type,
        )
        report_json = await self._generate_structured_report(payload, contexts)
        report = ComplianceReport(request_id=request.id, report_json=report_json.model_dump(mode="json"))
        session.add(report)
        await session.commit()
        await session.refresh(request)
        await session.refresh(report)
        return request, report

    def _build_query(self, payload: ComplianceRequestCreate) -> str:
        return (
            f"{payload.home_country} fintech expanding to {payload.target_country}; "
            f"{payload.product_category}; {payload.transaction_model}; "
            f"holds funds={payload.holds_customer_funds}; features={', '.join(payload.feature_flags)}"
        )

    async def _generate_structured_report(
        self,
        payload: ComplianceRequestCreate,
        contexts: list[RetrievedContext],
    ) -> ComplianceReportJSON:
        if not settings.openai_api_key:
            return self._fallback_report(contexts)

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        response = await client.chat.completions.create(
            model=settings.openai_model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": json.dumps(
                        {
                            "intake": payload.model_dump(),
                            "retrieved_context": [context.__dict__ for context in contexts],
                        }
                    ),
                },
            ],
        )
        content = response.choices[0].message.content or "{}"
        return ComplianceReportJSON.model_validate_json(content)

    def _fallback_report(self, contexts: list[RetrievedContext]) -> ComplianceReportJSON:
        references = [
            {"regulator": item.regulator, "title": item.title, "citation": item.citation, "url": item.url}
            for item in contexts
        ]
        return ComplianceReportJSON(
            executive_summary=(
                "Wepesi identifies the likely Nigeria pathway as a CBN payment services licensing review, "
                "with remittance analysis if the startup facilitates cross-border transfers or payout flows."
            ),
            license_category="CBN Payment Service Provider review, with possible International Money Transfer Operator analysis",
            license_reasoning=(
                "The business originates in Kenya and plans Nigeria payments/remittance activity, holds or touches "
                "customer funds, and supports cross-border transfers. Those facts typically trigger payment system, "
                "AML/CFT, consumer protection, settlement, and corporate governance requirements."
            ),
            required_documents=[
                "Certificate of incorporation and constitutional documents",
                "Board and shareholder structure",
                "Business plan and Nigeria operating model",
                "AML/CFT policy, sanctions screening process, and transaction monitoring framework",
                "Technology architecture, data protection controls, and incident response plan",
                "Settlement bank arrangements and customer funds safeguarding policy",
                "Evidence of capitalisation and audited or management accounts",
                "CBK authorisation or home-country regulatory status evidence",
            ],
            capital_requirements=(
                "Confirm against the current CBN category selected. Treat capital as category-specific and obtain "
                "local counsel validation before submission."
            ),
            estimated_timeline="8-16 weeks for MVP planning readiness; formal licensing may take several months after regulator engagement.",
            compliance_steps=[
                "Map the exact Nigeria product flow and identify whether the company processes, stores, settles, or remits funds.",
                "Select the closest CBN license pathway and document why adjacent categories do or do not apply.",
                "Prepare AML/CFT, KYC, sanctions, transaction monitoring, data protection, and consumer complaint controls.",
                "Compile corporate, financial, technical, risk, and governance documents.",
                "Run a pre-submission review with Nigeria regulatory counsel.",
            ],
            regulatory_references=references,
            categorized_documents={
                "licensing_documents": [
                    {
                        "document_name": "License application cover letter and regulatory application form",
                        "purpose": "Formally submit the selected payment/remittance license pathway to the regulator.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "High",
                    }
                ],
                "company_documents": [
                    {
                        "document_name": "Certificate of incorporation and constitutional documents",
                        "purpose": "Evidence legal existence, ownership, and governance structure.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "High",
                    }
                ],
                "aml_kyc_documents": [
                    {
                        "document_name": "AML/CFT and sanctions compliance manual",
                        "purpose": "Demonstrate customer due diligence, monitoring, escalation, and reporting controls.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "High",
                    }
                ],
                "financial_documents": [
                    {
                        "document_name": "Capitalization evidence and financial statements",
                        "purpose": "Show financial capacity and category-specific capital readiness.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "High",
                    }
                ],
                "technical_documents": [
                    {
                        "document_name": "Technology architecture and cybersecurity controls",
                        "purpose": "Evidence secure processing, resilience, incident response, and data handling.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "Medium",
                    }
                ],
                "risk_and_governance_documents": [
                    {
                        "document_name": "Risk management framework and board governance pack",
                        "purpose": "Show oversight of operational, compliance, liquidity, outsourcing, and fraud risks.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "High",
                    }
                ],
                "consumer_protection_documents": [
                    {
                        "document_name": "Customer complaints and disclosure policy",
                        "purpose": "Set out customer communication, complaints, redress, and transparency procedures.",
                        "required_by": "Central Bank of Nigeria",
                        "priority": "Medium",
                    }
                ],
                "data_protection_documents": [
                    {
                        "document_name": "Data protection impact assessment and privacy notice",
                        "purpose": "Evidence lawful personal-data processing and cross-border data controls.",
                        "required_by": "Nigeria data protection framework",
                        "priority": "Medium",
                    }
                ],
            },
            risks=[
                "License category ambiguity if wallets, settlement, cards, or remittance are bundled together.",
                "Capital requirement and local presence expectations may change or vary by CBN classification.",
                "Holding customer funds raises safeguarding, settlement, and trust-account design risk.",
            ],
            next_actions=[
                "Confirm product scope: payments only, remittance only, wallet, cards, switching, or combined model.",
                "Collect CBK and CBN source documents into the Wepesi knowledge base.",
                "Validate the generated pathway with Nigeria counsel before user-facing submission guidance.",
            ],
        )
