import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    company_name: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="user", server_default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Country(Base):
    __tablename__ = "countries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iso_code: Mapped[str] = mapped_column(String(3), unique=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    regulator_name: Mapped[str] = mapped_column(String(255))


class License(Base):
    __tablename__ = "licenses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("countries.id"))
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(120))
    capital_requirement: Mapped[str] = mapped_column(Text)
    timeline: Mapped[str] = mapped_column(String(120))
    documents: Mapped[list[str]] = mapped_column(JSON)


class Regulation(Base):
    __tablename__ = "regulations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("countries.id"))
    regulator: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255))
    source_url: Mapped[str | None] = mapped_column(Text)
    effective_year: Mapped[int | None] = mapped_column(Integer)
    summary: Mapped[str] = mapped_column(Text)


class ComplianceRequest(Base):
    __tablename__ = "compliance_requests"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    home_country: Mapped[str] = mapped_column(String(120))
    target_country: Mapped[str] = mapped_column(String(120))
    business_type: Mapped[str] = mapped_column(String(120))
    transaction_model: Mapped[str] = mapped_column(String(255))
    product_category: Mapped[str] = mapped_column(String(120))
    holds_customer_funds: Mapped[bool] = mapped_column(Boolean)
    cross_border_transfers: Mapped[bool] = mapped_column(Boolean)
    feature_flags: Mapped[list[str]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reports: Mapped[list["ComplianceReport"]] = relationship(back_populates="request")


class ComplianceReport(Base):
    __tablename__ = "compliance_reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("compliance_requests.id"))
    report_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    request: Mapped[ComplianceRequest] = relationship(back_populates="reports")


class RegulatoryChunk(Base):
    __tablename__ = "regulatory_chunks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    regulation_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("regulations.id"), nullable=True)
    country: Mapped[str] = mapped_column(String(120), index=True)
    regulator: Mapped[str] = mapped_column(String(255))
    category: Mapped[str | None] = mapped_column(String(120), nullable=True)
    license_type: Mapped[str | None] = mapped_column(String(160), nullable=True)
    title: Mapped[str] = mapped_column(String(255))
    chunk_text: Mapped[str] = mapped_column(Text)
    qdrant_point_id: Mapped[str | None] = mapped_column(String(120))
    metadata_json: Mapped[dict] = mapped_column(JSON)


class RegulationDocument(Base):
    __tablename__ = "regulation_documents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_name: Mapped[str] = mapped_column(String(120), index=True)
    regulator_name: Mapped[str] = mapped_column(String(255))
    regulation_category: Mapped[str] = mapped_column(String(120), index=True)
    license_type: Mapped[str] = mapped_column(String(160), index=True)
    document_title: Mapped[str] = mapped_column(String(255))
    source_url: Mapped[str | None] = mapped_column(Text)
    notes: Mapped[str | None] = mapped_column(Text)
    stored_file_path: Mapped[str] = mapped_column(Text)
    original_filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(120))
    uploaded_by_user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class AIGeneration(Base):
    __tablename__ = "ai_generations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("compliance_requests.id"), nullable=True)
    provider: Mapped[str] = mapped_column(String(80))
    model: Mapped[str] = mapped_column(String(120))
    prompt_version: Mapped[str] = mapped_column(String(80))
    input_json: Mapped[dict] = mapped_column(JSON)
    output_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
