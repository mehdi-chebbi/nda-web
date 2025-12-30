const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const MANIFEST_PATH = path.join(DOCS_DIR, 'manifest.json');

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eritrea_readiness',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React build)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'react', 'dist')));

// Serve docs directory
app.use('/docs', express.static(DOCS_DIR));

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 50 // Max 50 files at once
  }
});

// Helper functions for manifest
async function initializeManifest() {
  try {
    await fs.access(MANIFEST_PATH);
  } catch {
    const initialManifest = {
      gcf: [],
      policy: [],
      lastUpdated: new Date().toISOString()
    };
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(initialManifest, null, 2));
    console.log('Initialized manifest.json');
  }
}

async function readManifest() {
  const data = await fs.readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function regenerateManifestFromDB() {
  try {
    const result = await pool.query(
      'SELECT id, name, display_name, category, size, modified FROM documents ORDER BY modified DESC'
    );

    const manifest = {
      gcf: [],
      policy: [],
      lastUpdated: new Date().toISOString()
    };

    for (const row of result.rows) {
      const document = {
        id: row.id,
        name: row.name,
        displayName: row.display_name,
        size: parseInt(row.size),
        modified: row.modified,
        category: row.category
      };
      manifest[row.category].push(document);
    }

    await writeManifest(manifest);
    console.log('Regenerated manifest.json from database');
    return manifest;
  } catch (error) {
    console.error('Error regenerating manifest from DB:', error);
    throw error;
  }
}

function generateId(category) {
  const prefix = category === 'gcf' ? 'gcf' : 'policy';
  const timestamp = Date.now();
  const random = crypto.randomBytes(2).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
}

// Database initialization
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        category VARCHAR(20) NOT NULL,
        size INTEGER NOT NULL,
        modified TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_category CHECK (category IN ('gcf', 'policy'))
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category)
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_category_name ON documents(category, name)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_documents_modified ON documents(modified DESC)
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_audit_log (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(50),
        action VARCHAR(20) NOT NULL,
        performed_by VARCHAR(50),
        performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details JSONB,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_document_id ON document_audit_log(document_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_action ON document_audit_log(action)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at ON document_audit_log(performed_at DESC)
    `);

    // Create trigger function for updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_documents_updated_at ON documents
    `);
    await pool.query(`
      CREATE TRIGGER update_documents_updated_at
        BEFORE UPDATE ON documents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users
    `);
    await pool.query(`
      CREATE TRIGGER update_admin_users_updated_at
        BEFORE UPDATE ON admin_users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function initializeAdminUser() {
  try {
    const existingUser = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      ['admin']
    );

    if (existingUser.rows.length === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      await pool.query(
        'INSERT INTO admin_users (username, password_hash, email) VALUES ($1, $2, $3)',
        ['admin', hashedPassword, 'admin@readiness-eritrea.er']
      );
      console.log('Initialized default admin user (username: admin, password: admin123)');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
    throw error;
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
}

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: dbCheck.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Update last_login
    await pool.query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { username: user.username, id: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Verify admin session
app.post('/api/admin/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT username, email FROM admin_users WHERE username = $1',
      [req.user.username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ authenticated: false });
    }

    res.json({ authenticated: true, username: result.rows[0].username });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get all documents (admin only)
app.get('/api/admin/documents', authenticateToken, async (req, res) => {
  try {
    const manifest = await readManifest();
    res.json(manifest);
  } catch (error) {
    console.error('Error reading manifest:', error);
    res.status(500).json({ error: 'Failed to read documents.' });
  }
});

// Upload new document (admin only)
app.post('/api/admin/documents', authenticateToken, upload.single('file'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { category = 'gcf', displayName } = req.body;

    if (!displayName) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Display name is required.' });
    }

    if (!['gcf', 'policy'].includes(category)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid category. Must be "gcf" or "policy".' });
    }

    // Generate unique ID
    const id = generateId(category);

    // Generate stable filename from displayName
    const ext = path.extname(req.file.originalname);
    const sanitizedName = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const filename = `${sanitizedName}${ext}`;

    // Create category directory
    const categoryDir = path.join(DOCS_DIR, category);
    await fs.mkdir(categoryDir, { recursive: true });

    // Move file from uploads/ to final destination
    const sourcePath = req.file.path;
    const destPath = path.join(categoryDir, filename);
    await fs.rename(sourcePath, destPath);

    // Get file stats
    const fileStats = await fs.stat(destPath);

    const modified = new Date().toISOString();

    // Insert into database
    await client.query(
      `INSERT INTO documents (id, name, display_name, category, size, modified)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, filename, displayName, category, fileStats.size, modified]
    );

    // Log audit entry
    await client.query(
      `INSERT INTO document_audit_log (document_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [id, 'upload', req.user.username, JSON.stringify({ displayName, category, size: fileStats.size })]
    );

    await client.query('COMMIT');

    // Update manifest
    const manifest = await regenerateManifestFromDB();

    const document = {
      id,
      name: filename,
      displayName,
      size: fileStats.size,
      modified,
      category
    };

    res.json({
      message: 'Document uploaded successfully.',
      document
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Upload error:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ error: 'Failed to upload document.' });
  } finally {
    client.release();
  }
});

// Bulk upload documents (admin only)
app.post('/api/admin/documents/bulk', authenticateToken, upload.array('files', 50), async (req, res) => {
  const client = await pool.connect();
  const uploadedFiles = [];
  const errors = [];

  try {
    await client.query('BEGIN');

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const { category = 'gcf' } = req.body;

    if (!['gcf', 'policy'].includes(category)) {
      // Delete all uploaded files
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
      return res.status(400).json({ error: 'Invalid category. Must be "gcf" or "policy".' });
    }

    // Create category directory
    const categoryDir = path.join(DOCS_DIR, category);
    await fs.mkdir(categoryDir, { recursive: true });

    // Process each file
    for (const file of req.files) {
      try {
        // Extract display name from filename (remove extension and clean up)
        const baseName = path.basename(file.originalname, path.extname(file.originalname));
        const displayName = baseName
          .replace(/[-_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Generate unique ID
        const id = generateId(category);

        // Generate stable filename
        const ext = path.extname(file.originalname);
        const sanitizedName = displayName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const filename = `${sanitizedName}${ext}`;

        // Move file from uploads/ to final destination
        const sourcePath = file.path;
        const destPath = path.join(categoryDir, filename);
        await fs.rename(sourcePath, destPath);

        // Get file stats
        const fileStats = await fs.stat(destPath);

        const modified = new Date().toISOString();

        // Insert into database
        await client.query(
          `INSERT INTO documents (id, name, display_name, category, size, modified)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, filename, displayName, category, fileStats.size, modified]
        );

        // Log audit entry
        await client.query(
          `INSERT INTO document_audit_log (document_id, action, performed_by, details)
           VALUES ($1, $2, $3, $4)`,
          [id, 'upload', req.user.username, JSON.stringify({ displayName, category, size: fileStats.size, bulkUpload: true })]
        );

        uploadedFiles.push({
          id,
          name: filename,
          displayName,
          size: fileStats.size,
          modified,
          category
        });
      } catch (err) {
        console.error('Error processing file:', file.originalname, err);
        errors.push({
          filename: file.originalname,
          error: err.message
        });
        // Delete failed file
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
    }

    await client.query('COMMIT');

    // Update manifest
    await regenerateManifestFromDB();

    res.json({
      message: `Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''}.`,
      uploaded: uploadedFiles,
      errors,
      totalUploaded: uploadedFiles.length,
      totalFailed: errors.length
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk upload error:', error);
    // Delete all uploaded files
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
    }
    res.status(500).json({ error: 'Failed to upload documents.' });
  } finally {
    client.release();
  }
});

// Delete document (admin only)
app.delete('/api/admin/documents/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Get document info before deletion
    const docResult = await client.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );

    if (docResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Document not found.' });
    }

    const document = docResult.rows[0];

    // Log audit entry
    await client.query(
      `INSERT INTO document_audit_log (document_id, action, performed_by, details)
       VALUES ($1, $2, $3, $4)`,
      [id, 'delete', req.user.username, JSON.stringify({ 
        displayName: document.display_name, 
        category: document.category 
      })]
    );

    // Delete from database
    await client.query('DELETE FROM documents WHERE id = $1', [id]);

    await client.query('COMMIT');

    // Delete file from disk
    const filePath = path.join(DOCS_DIR, document.category, document.name);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with manifest update even if file deletion fails
    }

    // Update manifest
    await regenerateManifestFromDB();

    res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document.' });
  } finally {
    client.release();
  }
});

// Serve manifest.json (public)
app.get('/docs/manifest.json', async (req, res) => {
  try {
    const manifest = await readManifest();
    res.json(manifest);
  } catch (error) {
    console.error('Error serving manifest:', error);
    res.status(500).json({ error: 'Failed to read manifest.' });
  }
});

// Serve specific PDF files
app.get('/docs/:category/:filename', async (req, res) => {
  const { category, filename } = req.params;

  if (!['gcf', 'policy'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' });
  }

  const filePath = path.join(DOCS_DIR, category, filename);

  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch (error) {
    res.status(404).json({ error: 'File not found.' });
  }
});

// Catch all - serve React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'react', 'dist', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds 50MB limit.' });
  }
  res.status(500).json({ error: 'Internal server error.' });
});

// Initialize and start server
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL database');

    // Initialize database schema
    await initializeDatabase();

    // Initialize admin user
    await initializeAdminUser();

    // Create necessary directories
    await fs.mkdir(path.join(DOCS_DIR, 'gcf'), { recursive: true });
    await fs.mkdir(path.join(DOCS_DIR, 'policy'), { recursive: true });

    // Initialize manifest
    await initializeManifest();

    // Regenerate manifest from database (in case of existing data)
    await regenerateManifestFromDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Docs directory: ${DOCS_DIR}`);
      console.log(`Database: ${process.env.DB_NAME || 'eritrea_readiness'}`);
      console.log(`Default admin: username=admin, password=admin123`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
