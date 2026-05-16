CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iso_code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(120) UNIQUE NOT NULL,
  regulator_name VARCHAR(255) NOT NULL
);

CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL REFERENCES countries(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  capital_requirement TEXT NOT NULL,
  timeline VARCHAR(120) NOT NULL,
  documents JSONB NOT NULL
);

CREATE TABLE regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL REFERENCES countries(id),
  regulator VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  source_url TEXT,
  effective_year INTEGER,
  summary TEXT NOT NULL
);

CREATE TABLE compliance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  home_country VARCHAR(120) NOT NULL,
  target_country VARCHAR(120) NOT NULL,
  business_type VARCHAR(120) NOT NULL,
  transaction_model VARCHAR(255) NOT NULL,
  product_category VARCHAR(120) NOT NULL,
  holds_customer_funds BOOLEAN NOT NULL,
  cross_border_transfers BOOLEAN NOT NULL,
  feature_flags JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE compliance_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES compliance_requests(id),
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE regulatory_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulation_id UUID REFERENCES regulations(id),
  country VARCHAR(120) NOT NULL,
  regulator VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  chunk_text TEXT NOT NULL,
  qdrant_point_id VARCHAR(120),
  metadata_json JSONB NOT NULL
);

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES compliance_requests(id),
  provider VARCHAR(80) NOT NULL,
  model VARCHAR(120) NOT NULL,
  prompt_version VARCHAR(80) NOT NULL,
  input_json JSONB NOT NULL,
  output_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
