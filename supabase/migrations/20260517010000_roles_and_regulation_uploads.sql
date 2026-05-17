ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role VARCHAR(30) NOT NULL DEFAULT 'user';

ALTER TABLE regulatory_chunks
  ADD COLUMN IF NOT EXISTS category VARCHAR(120),
  ADD COLUMN IF NOT EXISTS license_type VARCHAR(160);

CREATE TABLE IF NOT EXISTS regulation_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_name VARCHAR(120) NOT NULL,
  regulator_name VARCHAR(255) NOT NULL,
  regulation_category VARCHAR(120) NOT NULL,
  license_type VARCHAR(160) NOT NULL,
  document_title VARCHAR(255) NOT NULL,
  source_url TEXT,
  notes TEXT,
  stored_file_path TEXT NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(120) NOT NULL,
  uploaded_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_regulation_documents_country_name ON regulation_documents(country_name);
CREATE INDEX IF NOT EXISTS ix_regulation_documents_regulation_category ON regulation_documents(regulation_category);
CREATE INDEX IF NOT EXISTS ix_regulation_documents_license_type ON regulation_documents(license_type);
