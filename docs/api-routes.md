# API Routes

The backend mounts both clean production paths and `/api` compatibility paths.

## Health

`GET /health`

## Auth

`POST /auth/register`

Creates a user and returns a JWT. The first registered user is assigned `admin`; later users are assigned `user`.

`POST /auth/login`

Authenticates a user and returns a JWT.

`GET /auth/me`

Returns the current authenticated user.

## Admin

`POST /admin/regulations/upload`

Admin-only multipart upload for regulatory source documents.

Fields:

- `country_name`
- `regulator_name`
- `regulation_category`
- `license_type`
- `document_title`
- `source_url`
- `notes`
- `file`

Supported file types: PDF, TXT, Markdown.

`GET /admin/regulations`

Admin-only list of uploaded regulation documents.

## Compliance

`POST /compliance/analyze`

Authenticated user route. Creates a compliance request, retrieves relevant regulatory chunks, generates a structured report, and stores it under the current user.

`GET /compliance/reports`

Returns reports owned by the current user.

`GET /compliance/reports/{id}`

Returns a single report owned by the current user.

## Report JSON

```json
{
  "executive_summary": "",
  "license_category": "",
  "license_reasoning": "",
  "required_documents": [],
  "capital_requirements": "",
  "estimated_timeline": "",
  "compliance_steps": [],
  "categorized_documents": {
    "licensing_documents": [],
    "company_documents": [],
    "aml_kyc_documents": [],
    "financial_documents": [],
    "technical_documents": [],
    "risk_and_governance_documents": [],
    "consumer_protection_documents": [],
    "data_protection_documents": []
  },
  "regulatory_references": [],
  "risks": [],
  "next_actions": []
}
```

## References

`GET /api/references`

Returns seed CBK and CBN knowledge base entries.
