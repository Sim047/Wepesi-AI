import { demoReport } from "@/lib/demo-report";

export type ComplianceReport = {
  executive_summary: string;
  license_category: string;
  license_reasoning: string;
  required_documents: string[];
  capital_requirements: string;
  estimated_timeline: string;
  compliance_steps: string[];
  regulatory_references: Array<{ regulator: string; title: string; citation: string; url: string | null }>;
  risks: string[];
  next_actions: string[];
};

export type ComplianceResponse = {
  request_id: string;
  report_id: string | null;
  source?: "api" | "demo";
  report: ComplianceReport;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type IntakePayload = {
  home_country: string;
  target_country: string;
  business_type: string;
  transaction_model: string;
  product_category: string;
  holds_customer_funds: boolean;
  cross_border_transfers: boolean;
  feature_flags: string[];
};

export const defaultIntake: IntakePayload = {
  home_country: "Kenya",
  target_country: "Nigeria",
  business_type: "Fintech startup",
  transaction_model: "Cross-border payments and remittance",
  product_category: "Payments/remittance",
  holds_customer_funds: true,
  cross_border_transfers: true,
  feature_flags: ["payments", "remittance", "wallets", "customer funds"]
};

export async function analyzeCompliance(payload: IntakePayload = defaultIntake): Promise<ComplianceResponse> {
  try {
    const response = await fetch(`${API_URL}/api/compliance/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to generate compliance analysis");
    }

    const data = (await response.json()) as ComplianceResponse;
    return { ...data, source: "api" };
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return demoReport;
  }
}
