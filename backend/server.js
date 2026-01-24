const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Poppler } = require('node-poppler');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DOCS_DIR = path.join(__dirname, 'docs');
const MANIFEST_PATH = path.join(DOCS_DIR, 'manifest.json');
const NEWS_IMAGES_DIR = path.join(__dirname, 'news-imgs');
const THUMBNAILS_DIR = path.join(__dirname, 'thumbnails');

// Initialize Poppler for PDF thumbnail generation
const poppler = new Poppler();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'eritrea_readiness',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Middleware
app.use(cors({
  origin: 'http://192.168.2.134',
  credentials: true
}));app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React build)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'react', 'dist')));

// Serve docs directory
app.use('/docs', express.static(DOCS_DIR));

// Serve news images directory
app.use('/news-imgs', express.static(NEWS_IMAGES_DIR));

// Serve thumbnails directory
app.use('/thumbnails', express.static(THUMBNAILS_DIR));

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

const uploadImages = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG and JPEG images are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image
    files: 10 // Max 10 images at once
  }
});

// Helper functions for manifest
async function initializeManifest() {
  try {
    await fs.access(MANIFEST_PATH);
  } catch {
    const initialManifest = {
      policy: [],
      'project-readiness': [],
      templates: [],
      deliverable: [],
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
      'SELECT id, name, display_name, category, size, modified, description FROM documents ORDER BY modified DESC'
    );

    const manifest = {
      policy: [],
      'project-readiness': [],
      templates: [],
      deliverable: [],
      lastUpdated: new Date().toISOString()
    };

    for (const row of result.rows) {
      const document = {
        id: row.id,
        name: row.name,
        displayName: row.display_name,
        size: parseInt(row.size),
        modified: row.modified,
        category: row.category,
        description: row.description || '',
        thumbnail: `/thumbnails/${row.id}.png`
      };
      if (manifest[row.category]) {
        manifest[row.category].push(document);
      }
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
  const prefixes = {
    'policy': 'pol',
    'project-readiness': 'prd',
    'templates': 'tpl',
    'deliverable': 'del'
  };
  const prefix = prefixes[category] || 'doc';
  const timestamp = Date.now();
  const random = crypto.randomBytes(2).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
}

function generateNewsImageName() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(3).toString('hex');
  return `news-${timestamp}-${random}`;
}

// Helper function to generate thumbnail from PDF
async function generateThumbnail(pdfPath, documentId) {
  try {
    // Ensure thumbnails directory exists
    await fs.mkdir(THUMBNAILS_DIR, { recursive: true });

    // Output base path WITHOUT extension (node-poppler adds it automatically)
    const outputBasePath = path.join(THUMBNAILS_DIR, documentId);

    // Use Poppler to convert first page to PNG image
    const options = {
      pngFile: true,
      singleFile: true,
      firstPageToConvert: 1,
      lastPageToConvert: 1,
      resolutionXYAxis: 150  // DPI resolution
    };

    await poppler.pdfToCairo(pdfPath, outputBasePath, options);

    // Check what file was actually created
    const possiblePaths = [
      `${outputBasePath}.png`,           // documentId.png
      `${outputBasePath}-1.png`,         // documentId-1.png
      `${outputBasePath}-000001.png`,    // documentId-000001.png
    ];

    let actualPath = null;
    for (const checkPath of possiblePaths) {
      try {
        await fs.access(checkPath);
        actualPath = checkPath;
        break;
      } catch {
        // File doesn't exist, try next
      }
    }

    if (!actualPath) {
      throw new Error('Generated thumbnail file not found');
    }

    // If file is already correctly named, just return it
    const finalPath = path.join(THUMBNAILS_DIR, `${documentId}.png`);
    if (actualPath !== finalPath) {
      await fs.rename(actualPath, finalPath);
    }

    console.log(`Thumbnail generated: ${finalPath}`);
    return `${documentId}.png`; // Return filename
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
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
        description TEXT,
        modified TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_category CHECK (category IN ('policy', 'project-readiness', 'templates', 'deliverable'))
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

    // Create press releases table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS press_releases (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        images TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(50) REFERENCES admin_users(username)
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_press_releases_created_at ON press_releases(created_at DESC)
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

    if (!['policy', 'project-readiness', 'templates', 'deliverable'].includes(category)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid category. Must be "policy", "project-readiness", "templates", or "deliverable".' });
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

    // Generate thumbnail from PDF (non-blocking)
    generateThumbnail(destPath, id).catch(err => {
      console.error(`Failed to generate thumbnail for ${id}:`, err);
    });

    // Update manifest
    const manifest = await regenerateManifestFromDB();

    const document = {
      id,
      name: filename,
      displayName,
      size: fileStats.size,
      modified,
      category,
      thumbnail: `/thumbnails/${id}.png`
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

    if (!['policy', 'project-readiness', 'templates', 'deliverable'].includes(category)) {
      // Delete all uploaded files
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
      return res.status(400).json({ error: 'Invalid category. Must be "policy", "project-readiness", "templates", or "deliverable".' });
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
          category,
          thumbnail: `/thumbnails/${id}.png`
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

    // Generate thumbnails for all uploaded files (non-blocking)
    for (const file of uploadedFiles) {
      const pdfPath = path.join(DOCS_DIR, file.category, file.name);
      generateThumbnail(pdfPath, file.id).catch(err => {
        console.error(`Failed to generate thumbnail for ${file.id}:`, err);
      });
    }

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

// Upload documents with descriptions (admin only)
app.post('/api/admin/documents/with-descriptions', authenticateToken, upload.array('files', 50), async (req, res) => {
  const client = await pool.connect();
  const uploadedFiles = [];
  const errors = [];

  try {
    await client.query('BEGIN');

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const { category = 'policy', descriptions } = req.body;

    if (!['policy', 'project-readiness', 'templates', 'deliverable'].includes(category)) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
      return res.status(400).json({ error: 'Invalid category. Must be "policy", "project-readiness", "templates", or "deliverable".' });
    }

    // Parse descriptions if provided as JSON string
    let descriptionsMap = {};
    if (descriptions) {
      try {
        descriptionsMap = typeof descriptions === 'string' ? JSON.parse(descriptions) : descriptions;
      } catch (e) {
        console.error('Error parsing descriptions:', e);
      }
    }

    const categoryDir = path.join(DOCS_DIR, category);
    await fs.mkdir(categoryDir, { recursive: true });

    for (const file of req.files) {
      try {
        const baseName = path.basename(file.originalname, path.extname(file.originalname));
        const displayName = baseName
          .replace(/[-_]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const id = generateId(category);

        const ext = path.extname(file.originalname);
        const sanitizedName = displayName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        const filename = `${sanitizedName}${ext}`;

        const sourcePath = file.path;
        const destPath = path.join(categoryDir, filename);
        await fs.rename(sourcePath, destPath);

        const fileStats = await fs.stat(destPath);
        const modified = new Date().toISOString();

        // Get description from map or use empty string
        const description = descriptionsMap[filename] || descriptionsMap[file.originalname] || '';

        await client.query(
          `INSERT INTO documents (id, name, display_name, category, size, description, modified)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, filename, displayName, category, fileStats.size, description, modified]
        );

        await client.query(
          `INSERT INTO document_audit_log (document_id, action, performed_by, details)
           VALUES ($1, $2, $3, $4)`,
          [id, 'upload', req.user.username, JSON.stringify({ displayName, category, size: fileStats.size, hasDescription: !!description })]
        );

        uploadedFiles.push({
          id,
          name: filename,
          displayName,
          description,
          size: fileStats.size,
          modified,
          category,
          thumbnail: `/thumbnails/${id}.png`
        });
      } catch (err) {
        console.error('Error processing file:', file.originalname, err);
        errors.push({
          filename: file.originalname,
          error: err.message
        });
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
    }

    await client.query('COMMIT');

    // Generate thumbnails for all uploaded files (non-blocking)
    for (const file of uploadedFiles) {
      const pdfPath = path.join(DOCS_DIR, file.category, file.name);
      generateThumbnail(pdfPath, file.id).catch(err => {
        console.error(`Failed to generate thumbnail for ${file.id}:`, err);
      });
    }

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
    console.error('Upload with descriptions error:', error);
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

    // Delete thumbnail file
    const thumbnailPath = path.join(THUMBNAILS_DIR, `${id}.png`);
    try {
      await fs.unlink(thumbnailPath);
    } catch (error) {
      // Ignore if thumbnail doesn't exist
      if (error.code !== 'ENOENT') {
        console.error('Error deleting thumbnail:', error);
      }
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

// Update document (admin only)
app.put('/api/admin/documents/:id', authenticateToken, upload.single('file'), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { category, displayName } = req.body;

    // Check if document exists
    const docResult = await client.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );

    if (docResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Document not found.' });
    }

    const document = docResult.rows[0];

    // Validate category if provided
    if (category && !['policy', 'project-readiness', 'templates', 'deliverable'].includes(category)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid category. Must be "policy", "project-readiness", "templates", or "deliverable".' });
    }

    let updates = [];
    let values = [];
    let paramCount = 1;

    // Update display name if provided
    if (displayName && displayName !== document.display_name) {
      updates.push(`display_name = $${paramCount++}`);
      values.push(displayName);
    }

    // Update category if provided
    if (category && category !== document.category) {
      updates.push(`category = $${paramCount++}`);
      values.push(category);

      // Move file to new category directory
      const oldPath = path.join(DOCS_DIR, document.category, document.name);
      const newDir = path.join(DOCS_DIR, category);
      const newPath = path.join(newDir, document.name);

      await fs.mkdir(newDir, { recursive: true });
      await fs.rename(oldPath, newPath);
    }

    // Update file if provided
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const filename = document.name.replace(/\.[^/.]+$/, '') + ext;

      const categoryDir = path.join(DOCS_DIR, category || document.category);
      const destPath = path.join(categoryDir, filename);

      // Delete old file
      const oldPath = path.join(DOCS_DIR, document.category, document.name);
      try {
        await fs.unlink(oldPath);
      } catch (error) {
        console.error('Error deleting old file:', error);
      }

      // Move new file
      await fs.rename(req.file.path, destPath);

      // Update filename and size
      const fileStats = await fs.stat(destPath);
      updates.push(`name = $${paramCount++}`);
      values.push(filename);
      updates.push(`size = $${paramCount++}`);
      values.push(fileStats.size);

      // Store updated filename for next update
      document.name = filename;
    }

    // Add modified timestamp
    const modified = new Date().toISOString();
    updates.push(`modified = $${paramCount++}`);
    values.push(modified);

    // Add id for WHERE clause
    values.push(id);

    if (updates.length > 0) {
      await client.query(
        `UPDATE documents SET ${updates.join(', ')} WHERE id = $${paramCount}`,
        values
      );

      // Log audit entry
      await client.query(
        `INSERT INTO document_audit_log (document_id, action, performed_by, details)
         VALUES ($1, $2, $3, $4)`,
        [id, 'update', req.user.username, JSON.stringify({
          oldDisplayName: document.display_name,
          newDisplayName: displayName || document.display_name,
          oldCategory: document.category,
          newCategory: category || document.category,
          fileUpdated: !!req.file
        })]
      );

      await client.query('COMMIT');

      // Update manifest
      await regenerateManifestFromDB();
    }

    res.json({ message: 'Document updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update error:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ error: 'Failed to update document.' });
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

  if (!['policy', 'project-readiness', 'templates', 'deliverable'].includes(category)) {
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

// ================= PRESS RELEASE ENDPOINTS =================

// Get all press releases (public)
app.get('/api/press-releases', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, images, created_at, created_by
      FROM press_releases
      ORDER BY created_at DESC
    `);

    res.json(result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      images: row.images || [],
      createdAt: row.created_at,
      createdBy: row.created_by
    })));
  } catch (error) {
    console.error('Error fetching press releases:', error);
    res.status(500).json({ error: 'Failed to fetch press releases.' });
  }
});

// Get single press release (public)
app.get('/api/press-releases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT id, title, content, images, created_at, created_by
      FROM press_releases
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Press release not found.' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      title: row.title,
      content: row.content,
      images: row.images || [],
      createdAt: row.created_at,
      createdBy: row.created_by
    });
  } catch (error) {
    console.error('Error fetching press release:', error);
    res.status(500).json({ error: 'Failed to fetch press release.' });
  }
});

// Create press release (admin only)
app.post('/api/admin/press-releases', authenticateToken, uploadImages.array('images', 10), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { title, content } = req.body;

    if (!title || !content) {
      // Delete uploaded files if validation fails
      if (req.files) {
        for (const file of req.files) {
          try {
            await fs.unlink(file.path);
          } catch (e) {}
        }
      }
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    // Create news images directory if it doesn't exist
    await fs.mkdir(NEWS_IMAGES_DIR, { recursive: true });

    // Process uploaded images
    const imagePaths = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const filename = `${generateNewsImageName()}${ext}`;
        const destPath = path.join(NEWS_IMAGES_DIR, filename);
        await fs.rename(file.path, destPath);
        imagePaths.push(filename);
      }
    }

    // Insert into database
    const result = await client.query(
      `INSERT INTO press_releases (title, content, images, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, images, created_at, created_by`,
      [title, content, imagePaths, req.user.username]
    );

    await client.query('COMMIT');

    const row = result.rows[0];
    res.json({
      message: 'Press release created successfully.',
      pressRelease: {
        id: row.id,
        title: row.title,
        content: row.content,
        images: row.images || [],
        createdAt: row.created_at,
        createdBy: row.created_by
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating press release:', error);

    // Delete uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {}
      }
    }

    res.status(500).json({ error: 'Failed to create press release.' });
  } finally {
    client.release();
  }
});

// Delete press release (admin only)
app.delete('/api/admin/press-releases/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Get press release to delete images
    const pressRelease = await client.query(
      'SELECT images FROM press_releases WHERE id = $1',
      [id]
    );

    if (pressRelease.rows.length === 0) {
      return res.status(404).json({ error: 'Press release not found.' });
    }

    // Delete images from filesystem
    const images = pressRelease.rows[0].images || [];
    for (const image of images) {
      try {
        await fs.unlink(path.join(NEWS_IMAGES_DIR, image));
      } catch (e) {
        console.error('Error deleting image:', image, e);
      }
    }

    // Delete from database
    await client.query('DELETE FROM press_releases WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.json({ message: 'Press release deleted successfully.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting press release:', error);
    res.status(500).json({ error: 'Failed to delete press release.' });
  } finally {
    client.release();
  }
});

// Update press release (admin only)
app.put('/api/admin/press-releases/:id', authenticateToken, uploadImages.array('images', 10), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { title, content, keepExistingImages } = req.body;

    // Check if press release exists
    const prResult = await client.query(
      'SELECT * FROM press_releases WHERE id = $1',
      [id]
    );

    if (prResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Press release not found.' });
    }

    const pressRelease = prResult.rows[0];

    let updates = [];
    let values = [];
    let paramCount = 1;

    // Update title if provided
    if (title && title !== pressRelease.title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    // Update content if provided
    if (content && content !== pressRelease.content) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }

    // Handle images
    const oldImages = pressRelease.images || [];
    let finalImages = [...oldImages];

    // Parse which existing images to keep
    if (keepExistingImages) {
      try {
        const keepImages = JSON.parse(keepExistingImages);
        finalImages = keepImages.filter(img => oldImages.includes(img));
      } catch (e) {
        console.error('Error parsing keepExistingImages:', e);
        finalImages = [...oldImages];
      }
    }

    // Add new images if provided
    if (req.files && req.files.length > 0) {
      const totalImages = finalImages.length + req.files.length;
      if (totalImages > 10) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Maximum 10 images allowed.' });
      }

      // Delete old images that are not being kept
      const imagesToDelete = oldImages.filter(img => !finalImages.includes(img));
      for (const image of imagesToDelete) {
        try {
          await fs.unlink(path.join(NEWS_IMAGES_DIR, image));
        } catch (e) {
          console.error('Error deleting old image:', image, e);
        }
      }

      // Generate new image names and move files
      for (const file of req.files) {
        const imageName = generateNewsImageName() + path.extname(file.originalname);
        const destPath = path.join(NEWS_IMAGES_DIR, imageName);
        await fs.rename(file.path, destPath);
        finalImages.push(imageName);
      }

      updates.push(`images = $${paramCount++}`);
      values.push(finalImages);
    } else if (keepExistingImages && finalImages.length !== oldImages.length) {
      // Only images were removed, no new ones added
      const imagesToDelete = oldImages.filter(img => !finalImages.includes(img));
      for (const image of imagesToDelete) {
        try {
          await fs.unlink(path.join(NEWS_IMAGES_DIR, image));
        } catch (e) {
          console.error('Error deleting old image:', image, e);
        }
      }

      updates.push(`images = $${paramCount++}`);
      values.push(finalImages);
    }

    if (updates.length > 0) {
      values.push(id);

      await client.query(
        `UPDATE press_releases SET ${updates.join(', ')} WHERE id = $${paramCount}`,
        values
      );

      await client.query('COMMIT');

      res.json({ message: 'Press release updated successfully.' });
    } else {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'No changes to update.' });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating press release:', error);

    // Clean up uploaded files on error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {
          console.error('Error deleting uploaded file:', file.path, e);
        }
      }
    }

    res.status(500).json({ error: 'Failed to update press release.' });
  } finally {
    client.release();
  }
});

// ================= END PRESS RELEASE ENDPOINTS =================

// Get document by ID (public endpoint)
app.get('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, display_name, category, size, description, modified FROM documents WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const document = result.rows[0];
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document.' });
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
    await fs.mkdir(NEWS_IMAGES_DIR, { recursive: true });

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
