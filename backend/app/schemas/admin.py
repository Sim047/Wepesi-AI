from datetime import datetime

from pydantic import BaseModel


class RegulationDocumentResponse(BaseModel):
    id: str
    country_name: str
    regulator_name: str
    regulation_category: str
    license_type: str
    document_title: str
    source_url: str | None
    notes: str | None
    original_filename: str
    created_at: datetime
