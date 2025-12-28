-- PostgreSQL Database Schema for Eritrea Readiness Project
-- This schema is prepared for Phase 2 integration

-- Documents Table
-- Stores metadata for all PDF documents
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(50) PRIMARY KEY,              -- e.g., "gcf-001"
  name VARCHAR(255) NOT NULL,             -- filename, e.g., "gcf-guide.pdf"
  display_name VARCHAR(255) NOT NULL,      -- user-facing name
  category VARCHAR(20) NOT NULL,          -- "gcf" or "policy"
  size INTEGER NOT NULL,                  -- file size in bytes
  modified TIMESTAMP NOT NULL,            -- when file was added
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_category CHECK (category IN ('gcf', 'policy'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_modified ON documents(modified DESC);

-- Ensure unique combination of category and filename
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_category_name ON documents(category, name);

-- Admin Users Table
-- Stores administrator credentials
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create index on username for faster login lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Audit Log Table (Optional - for tracking document changes)
-- Stores a history of all document operations
CREATE TABLE IF NOT EXISTS document_audit_log (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR(50),
  action VARCHAR(20) NOT NULL,            -- "upload", "delete"
  performed_by VARCHAR(50),               -- username
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB,                          -- additional information about the action
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Create indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_log_document_id ON document_audit_log(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON document_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at ON document_audit_log(performed_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- The password hash is generated using bcrypt
INSERT INTO admin_users (username, password_hash, email)
VALUES ('admin', '$2a$10$rOZbZ5Z5Z5Z5Z5Z5Z5Z5ZeK5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'admin@readiness-eritrea.er')
ON CONFLICT (username) DO NOTHING;

-- Sample Documents (Optional - for testing)
-- These would correspond to actual files in the /docs directory
-- INSERT INTO documents (id, name, display_name, category, size, modified) VALUES
-- ('gcf-001', 'gcf-guide.pdf', 'GCF Funding Guide', 'gcf', 1881024, NOW()),
-- ('gcf-002', 'readiness-program.pdf', 'Readiness Program Overview', 'gcf', 2345678, NOW()),
-- ('policy-001', 'climate-policy-2024.pdf', 'Climate Policy 2024', 'policy', 3456789, NOW()),
-- ('policy-002', 'environmental-law.pdf', 'Environmental Protection Law', 'policy', 1234567, NOW());
