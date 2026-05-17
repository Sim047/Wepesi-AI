import type { ComplianceResponse } from "@/lib/api";

export const baselineReport: ComplianceResponse = {
  request_id: "ke-ng-payments",
  report_id: "wepesi-ke-ng-payments",
  source: "generated",
  report: {
    executive_summary:
      "A Kenya-based fintech expanding into Nigeria with cross-border payment and wallet features should treat the launch as a regulated payment services expansion, not a simple market-entry exercise. The highest-probability path is to validate CBN payment-service licensing fit, confirm whether remittance activity triggers IMTO obligations, and prepare governance, AML/CFT, safeguarding, and operational-resilience evidence before commercial launch.",
    license_category: "Nigeria payment services pathway with remittance review",
    license_reasoning:
      "The product touches stored value, customer-fund handling, cross-border transfer flows, and payment initiation. That combination usually requires mapping against CBN payment-service categories such as PSSP, MMO, switching/super-agent activity, and IMTO rules depending on the final operating model.",
    required_documents: [
      "Board-approved Nigeria market entry memo and regulated-activity map",
      "AML/CFT, sanctions, transaction monitoring, and suspicious activity escalation policies",
      "Customer-funds safeguarding and settlement reconciliation procedure",
      "Technology architecture, business continuity, incident response, and cyber-risk controls",
      "Local partner, banking, and payment-processor agreements",
      "Capitalization plan, audited financials, and responsible-person profiles"
    ],
    capital_requirements:
      "Capital depends on the final Nigerian license category and whether the model includes wallet issuance, switching, super-agent activity, or international money transfer services. Wepesi flags this as a counsel-confirmed item before filing and recommends modeling a capital reserve plus 12 months of compliance operating cost.",
    estimated_timeline: "10-18 weeks for readiness, partner validation, document pack, and regulator-facing review.",
    compliance_steps: [
      "Freeze the target operating model and decide whether funds are held, pooled, or passed through.",
      "Map the product features against CBN payment-service and remittance categories.",
      "Prepare evidence for AML/CFT governance, transaction monitoring, sanctions screening, and complaints handling.",
      "Validate banking, settlement, and local entity requirements with Nigerian counsel.",
      "Assemble a regulator-ready document room and track open questions through launch."
    ],
    categorized_documents: {
      licensing_documents: [
        {
          document_name: "License application cover letter and regulatory application form",
          purpose: "Submit the selected payment/remittance license pathway to the regulator.",
          required_by: "Central Bank of Nigeria",
          priority: "High"
        }
      ],
      company_documents: [
        {
          document_name: "Certificate of incorporation and constitutional documents",
          purpose: "Evidence legal existence, ownership, and governance structure.",
          required_by: "Central Bank of Nigeria",
          priority: "High"
        }
      ],
      aml_kyc_documents: [
        {
          document_name: "AML/CFT and sanctions compliance manual",
          purpose: "Demonstrate CDD, monitoring, escalation, and reporting controls.",
          required_by: "Central Bank of Nigeria",
          priority: "High"
        }
      ],
      financial_documents: [
        {
          document_name: "Capitalization evidence and financial statements",
          purpose: "Show financial capacity and category-specific capital readiness.",
          required_by: "Central Bank of Nigeria",
          priority: "High"
        }
      ],
      technical_documents: [
        {
          document_name: "Technology architecture and cybersecurity controls",
          purpose: "Evidence secure processing, resilience, and incident response.",
          required_by: "Central Bank of Nigeria",
          priority: "Medium"
        }
      ],
      risk_and_governance_documents: [
        {
          document_name: "Risk management framework and board governance pack",
          purpose: "Show oversight of compliance, liquidity, outsourcing, and fraud risks.",
          required_by: "Central Bank of Nigeria",
          priority: "High"
        }
      ],
      consumer_protection_documents: [
        {
          document_name: "Customer complaints and disclosure policy",
          purpose: "Set out customer communication, complaints, redress, and transparency procedures.",
          required_by: "Central Bank of Nigeria",
          priority: "Medium"
        }
      ],
      data_protection_documents: [
        {
          document_name: "Data protection impact assessment and privacy notice",
          purpose: "Evidence lawful personal-data processing and cross-border data controls.",
          required_by: "Nigeria data protection framework",
          priority: "Medium"
        }
      ]
    },
    regulatory_references: [
      {
        regulator: "Central Bank of Nigeria",
        title: "Payment service provider licensing categories",
        citation: "CBN payment system licensing guidance and related circulars",
        url: null
      },
      {
        regulator: "Central Bank of Nigeria",
        title: "International money transfer and AML/CFT obligations",
        citation: "IMTO and AML/CFT regulatory framework review required",
        url: null
      },
      {
        regulator: "Central Bank of Kenya",
        title: "National Payment System regulatory obligations",
        citation: "CBK obligations for payment service providers and safeguarding controls",
        url: null
      }
    ],
    risks: [
      "Misclassifying the Nigerian license category could delay launch or force a model redesign.",
      "Customer-fund handling increases scrutiny around safeguarding, settlement, reconciliation, and insolvency protection.",
      "Cross-border transfers increase AML/CFT, sanctions, and reporting obligations.",
      "Partner-led launch models can still leave the fintech with operational and consumer-protection exposure."
    ],
    next_actions: [
      "Run a counsel review on the operating model and license map.",
      "Create a 30-day document-room sprint for governance, AML, tech-risk, and safeguarding evidence.",
      "Shortlist Nigerian banking/payment partners and confirm what regulated functions they cover.",
      "Model the launch budget with capital, legal, compliance, and local operations assumptions."
    ]
  }
};
