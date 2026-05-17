import { baselineReport } from "@/lib/baseline-report";

const TOKEN_KEY = "wepesi:token";

export type User = {
  id: string;
  email: string;
  company_name?: string | null;
  role: "admin" | "user";
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type CategorizedDocumentItem = {
  document_name: string;
  purpose: string;
  required_by: string;
  priority: "High" | "Medium" | "Low" | string;
};

export type CategorizedComplianceDocuments = {
  licensing_documents: CategorizedDocumentItem[];
  company_documents: CategorizedDocumentItem[];
  aml_kyc_documents: CategorizedDocumentItem[];
  financial_documents: CategorizedDocumentItem[];
  technical_documents: CategorizedDocumentItem[];
  risk_and_governance_documents: CategorizedDocumentItem[];
  consumer_protection_documents: CategorizedDocumentItem[];
  data_protection_documents: CategorizedDocumentItem[];
};

export type ComplianceReport = {
  executive_summary: string;
  license_category: string;
  license_reasoning: string;
  required_documents: string[];
  capital_requirements: string;
  estimated_timeline: string;
  compliance_steps: string[];
  categorized_documents: CategorizedComplianceDocuments;
  regulatory_references: Array<{ regulator: string; title: string; citation: string; url: string | null }>;
  risks: string[];
  next_actions: string[];
};

export type ComplianceResponse = {
  request_id: string;
  report_id: string | null;
  source?: "api" | "generated";
  report: ComplianceReport;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}

export async function registerUser(payload: { email: string; password: string; company_name?: string }): Promise<AuthResponse> {
  const response = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  if (!response.ok) throw new Error("Registration failed");
  const data = (await response.json()) as AuthResponse;
  setToken(data.access_token);
  return data;
}

export async function loginUser(payload: { email: string; password: string }): Promise<AuthResponse> {
  const response = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  if (!response.ok) throw new Error("Invalid email or password");
  const data = (await response.json()) as AuthResponse;
  setToken(data.access_token);
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getToken()) return null;
  const response = await apiFetch("/auth/me");
  if (!response.ok) return null;
  return response.json();
}

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
    const response = await apiFetch("/compliance/analyze", {
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
    return baselineReport;
  }
}

export async function uploadRegulation(formData: FormData) {
  const response = await apiFetch("/admin/regulations/upload", { method: "POST", body: formData });
  if (!response.ok) throw new Error("Unable to upload regulation");
  return response.json();
}

export async function listAdminRegulations() {
  const response = await apiFetch("/admin/regulations");
  if (!response.ok) throw new Error("Unable to load regulations");
  return response.json();
}
