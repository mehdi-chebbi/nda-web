# Eritrea Readiness Project - National Designated Authority

A full-stack web application for Eritrea's National Designated Authority to showcase climate readiness initiatives and provide access to policies, project readiness documents, templates, and deliverables.

## Project Structure

```
project/
├── frontend/
│   └── react/
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── pages/           # Page components
│       │   ├── App.tsx          # Main app component
│       │   └── main.tsx         # Entry point
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
├── backend/
│   ├── server.js               # Express server with PostgreSQL integration
│   ├── package.json
│   └── .env.example            # Environment variables template
└── docs/
    ├── policy/                 # Policy PDF documents
    ├── project-readiness/       # Project Readiness documents
    ├── templates/               # Template documents
    ├── deliverable/            # Deliverable documents
    └── manifest.json           # Document registry (auto-generated from DB)
```

## Features

### Frontend
- **Home Page**: Hero section, mission/vision, focus areas, statistics
- **Resources Page**: Document browser with filtering, search, and download
- **About Us Page**: Information about NDA and Readiness Program
- **Contact Us Page**: Contact information and form
- **Admin Dashboard**: Document upload, delete, and management

### Backend
- Express.js server with REST APIs
- **PostgreSQL database** for storing documents and admin users
- Document management (upload/delete only - no update)
- Admin authentication with JWT
- **Auto-generated manifest.json** from database
- Audit logging for all document operations
- Static file serving for React app and documents

### Design System
- Deep green government theme
- Professional, clean UI
- Responsive design (mobile-first)
- No indigo/blue colors (as specified)

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js with Express.js
- **PostgreSQL** (direct pg driver, no ORM)
- JWT authentication
- Multer for file uploads
- CORS enabled
- **Dual storage system**:
  - PostgreSQL for data persistence
  - manifest.json for frontend compatibility

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- **PostgreSQL database** (required)

### 1. Database Setup

First, create a PostgreSQL database:

```sql
CREATE DATABASE eritrea_readiness;
```

### 2. Install Frontend Dependencies

```bash
cd project/frontend/react
npm install
```

### 3. Install Backend Dependencies

```bash
cd project/backend
npm install
```

### 4. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eritrea_readiness
DB_USER=postgres
DB_PASSWORD=your_password
```

### 5. Development Setup

**Backend (Terminal 1):**
```bash
cd project/backend
npm start
```

Backend will run on `http://localhost:3000`

The server will:
- Connect to PostgreSQL database
- Create all necessary tables automatically
- Initialize default admin user
- Regenerate manifest.json from database

**Frontend (Terminal 2):**
```bash
cd project/frontend/react
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Production Build

```bash
# Build frontend
cd project/frontend/react
npm run build

# Backend will serve the built files from frontend/react/dist
cd ../backend
npm start
```

## Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

The admin user is stored in PostgreSQL. You can add additional admin users directly in the database.

## Document Management

### Important Rules

1. **Stable Filenames Only**
   - Use simple, descriptive filenames: `gcf-guide.pdf`, `climate-policy-2024.pdf`
   - Never use timestamps or version numbers in filenames

2. **Unique, Permanent IDs**
   - IDs are auto-generated when documents are uploaded
   - IDs never change or get reused

3. **Document Updates = Delete + Add**
   - To update a document: Delete old, then add new version
   - No "update" or "replace" operation exists

4. **Dual Storage System**
   - PostgreSQL stores document metadata with full audit trail
   - manifest.json is auto-generated from database for frontend compatibility
   - Both are kept in sync automatically

### Upload Process

1. Go to Admin Dashboard (`/admin`)
2. Login with admin credentials
3. Fill in the upload form:
   - Select PDF file
   - Choose category (Policy, Project Readiness, Templates, or Deliverables)
   - Enter display name
4. Click "Upload Document"

The system will:
- Generate a unique ID
- Create a stable filename from display name
- Save file to `/docs/policy/`, `/docs/project-readiness/`, `/docs/templates/`, or `/docs/deliverable/`
- **Insert into PostgreSQL database**
- **Update manifest.json automatically**
- **Log the action in audit trail**

### Delete Process

1. Go to Admin Dashboard
2. Find document in the list
3. Click delete button (trash icon)
4. Confirm deletion

The system will:
- Delete file from disk
- **Remove from PostgreSQL database**
- **Update manifest.json automatically**
- **Log the action in audit trail**
- ID is never reused

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check (includes database status)
- `GET /docs/manifest.json` - Get document manifest (from DB)
- `GET /docs/:category/:filename` - Download PDF

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify admin session
- `GET /api/admin/documents` - List all documents
- `POST /api/admin/documents` - Upload new document
- `DELETE /api/admin/documents/:id` - Delete document

## Database Schema

The server automatically creates these tables on first run:

### documents
- `id` (VARCHAR) - Primary key
- `name` (VARCHAR) - Filename
- `display_name` (VARCHAR) - User-facing name
- `category` (VARCHAR) - "policy", "project-readiness", "templates", or "deliverable"
- `size` (INTEGER) - File size in bytes
- `modified` (TIMESTAMP) - Last modified timestamp
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### admin_users
- `id` (SERIAL) - Primary key
- `username` (VARCHAR) - Unique username
- `password_hash` (VARCHAR) - Bcrypt hash
- `email` (VARCHAR) - Email address
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `last_login` (TIMESTAMP) - Last login time

### document_audit_log
- `id` (SERIAL) - Primary key
- `document_id` (VARCHAR) - Foreign key to documents
- `action` (VARCHAR) - "upload" or "delete"
- `performed_by` (VARCHAR) - Username who performed action
- `performed_at` (TIMESTAMP) - Action timestamp
- `details` (JSONB) - Additional information

## How the Dual Storage Works

1. **Primary Storage (PostgreSQL)**
   - All document metadata is stored in the database
   - All admin operations query and update the database
   - Complete audit trail is maintained
   - Database is the source of truth

2. **Secondary Storage (manifest.json)**
   - Auto-generated from database on server startup
   - Regenerated after every upload/delete operation
   - Used by frontend for quick access
   - Always in sync with database

3. **Synchronization Process**
   ```
   Upload → DB Insert → Regenerate manifest.json
   Delete → DB Delete → Regenerate manifest.json
   Server Start → Load DB → Regenerate manifest.json
   ```

## Design System

### Colors
```css
--color-primary: #0d4a2e
--color-primary-dark: #07331f
--color-primary-light: #156642
--color-secondary: #c9a227
--color-secondary-light: #dbb84a
--color-bg-primary: #f5f3ef
--color-bg-secondary: #e8e6e0
--color-bg-white: #ffffff
--color-text-primary: #1a1a1a
--color-text-secondary: #5a5a5a
--color-text-muted: #8a8a8a
```

### Typography
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## Deployment

### Environment Variables

Create `.env` file in backend directory:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-secure-secret-key-here

DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=eritrea_readiness
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

### Build and Deploy

1. Build frontend:
```bash
cd project/frontend/react
npm run build
```

2. Install backend dependencies:
```bash
cd project/backend
npm install --production
```

3. Start server:
```bash
npm start
```

The server will:
- Connect to production database
- Auto-create tables if they don't exist
- Initialize admin user if needed
- Regenerate manifest from database
- Serve production React build

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`
- Check firewall/network settings

### Port Already in Use
- Change `PORT` in backend/.env
- Or stop the process using port 3000

### PDF Upload Fails
- Check file size (max 50MB)
- Ensure it's a valid PDF
- Check disk permissions on `/docs` directory
- Verify database connection

### Manifest.json Issues
- Manifest is auto-generated from database
- If corrupted, restart server to regenerate
- Check database if manifest doesn't update

## Security Notes

- Change `JWT_SECRET` in production
- Change default admin password immediately
- Use strong database passwords
- Enable SSL/TLS for database connections in production
- Consider using connection pooling for production

## Support

For issues or questions:
- Contact: Ministry of Finance, Asmara, Eritrea
- Email: info@readiness-eritrea.er

## License

© 2024 Readiness Eritrea - National Designated Authority. All rights reserved.
