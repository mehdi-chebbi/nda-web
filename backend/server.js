const express = require('express');
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
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Initialize manifest.json if it doesn't exist
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

// Helper functions
async function readManifest() {
  const data = await fs.readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(data);
}

async function writeManifest(manifest) {
  manifest.lastUpdated = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function generateId(category, manifest) {
  const prefix = category === 'gcf' ? 'gcf' : 'policy';
  const docs = manifest[category];
  const count = docs.length + 1;
  const paddedCount = count.toString().padStart(3, '0');
  return `${prefix}-${paddedCount}`;
}

// Admin user management (in-memory for now)
const adminUsers = new Map();

// Initialize default admin user (username: admin, password: admin123)
async function initializeAdminUser() {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);
  adminUsers.set('admin', {
    username: 'admin',
    password: hashedPassword,
    createdAt: new Date().toISOString()
  });
  console.log('Initialized default admin user (username: admin, password: admin123)');
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = adminUsers.get(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { username: user.username },
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
app.post('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ authenticated: true, username: req.user.username });
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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { category = 'gcf', displayName } = req.body;

    if (!displayName) {
      // Delete uploaded file if displayName is missing
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Display name is required.' });
    }

    if (!['gcf', 'policy'].includes(category)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid category. Must be "gcf" or "policy".' });
    }

    // Update manifest
    const manifest = await readManifest();

    // Generate unique sequential ID
    const id = generateId(category, manifest);

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

    // Create document entry
    const document = {
      id,
      name: filename,
      displayName,
      size: fileStats.size,
      modified: new Date().toISOString(),
      category
    };

    manifest[category].push(document);
    await writeManifest(manifest);

    res.json({
      message: 'Document uploaded successfully.',
      document
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ error: 'Failed to upload document.' });
  }
});

// Delete document (admin only)
app.delete('/api/admin/documents/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const manifest = await readManifest();

    // Find document in both categories
    let document = null;
    let category = null;

    for (const cat of ['gcf', 'policy']) {
      const index = manifest[cat].findIndex(doc => doc.id === id);
      if (index !== -1) {
        document = manifest[cat][index];
        category = cat;
        manifest[cat].splice(index, 1);
        break;
      }
    }

    if (!document) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    // Delete file from disk
    const filePath = path.join(DOCS_DIR, category, document.name);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with manifest update even if file deletion fails
    }

    // Update manifest
    await writeManifest(manifest);

    res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document.' });
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

  // Validate category
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
    // Create necessary directories
    await fs.mkdir(path.join(DOCS_DIR, 'gcf'), { recursive: true });
    await fs.mkdir(path.join(DOCS_DIR, 'policy'), { recursive: true });

    // Initialize manifest
    await initializeManifest();

    // Initialize admin user
    await initializeAdminUser();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Docs directory: ${DOCS_DIR}`);
      console.log(`Default admin: username=admin, password=admin123`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
