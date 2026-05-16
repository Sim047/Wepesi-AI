# API Routes

## Health

`GET /health`

Returns service status.

## Auth

`POST /api/auth/register`

Creates a user and returns a JWT.

`POST /api/auth/login`

Authenticates a user and returns a JWT.

## Compliance

`POST /api/compliance/analyze`

Request:

```json
{
  "home_country": "Kenya",
  "target_country": "Nigeria",
  "business_type": "Fintech startup",
  "transaction_model": "Cross-border payments and remittance",
  "product_category": "Payments/remittance",
  "holds_customer_funds": true,
  "cross_border_transfers": true,
  "feature_flags": ["payments", "remittance", "wallets"]
}
```

Response:

```json
{
  "request_id": "uuid",
  "report_id": "uuid",
  "report": {
    "executive_summary": "",
    "license_category": "",
    "license_reasoning": "",
    "required_documents": [],
    "capital_requirements": "",
    "estimated_timeline": "",
    "compliance_steps": [],
    "regulatory_references": [],
    "risks": [],
    "next_actions": []
  }
}
```

## References

`GET /api/references`

Returns the seed CBK and CBN knowledge base entries.
