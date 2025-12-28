# Eritrea Readiness Project - National Designated Authority

A full-stack web application for Eritrea's National Designated Authority to showcase climate readiness initiatives and provide access to GCF (Green Climate Fund) and policy documents.

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
│   ├── server.js               # Express server with all APIs
│   └── package.json
├── docs/
│   ├── gcf/                    # GCF PDF documents
│   ├── policy/                 # Policy PDF documents
│   └── manifest.json           # Document registry (auto-generated)
└── database/
    └── schema.sql              # PostgreSQL schema (for Phase 2)
```

## Features

### Frontend
- **Home Page**: Hero section, mission/vision, focus areas, statistics
- **Resources Page**: Document browser with filtering, search, and download
- **About Us Page**: Information about the NDA and Readiness Program
- **Contact Us Page**: Contact information and form
- **Admin Dashboard**: Document upload, delete, and management

### Backend
- Express.js server with REST APIs
- Document management (upload/delete only - no update)
- Admin authentication with JWT
- Auto-generated manifest.json
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
- JWT authentication
- Multer for file uploads
- CORS enabled
- File-based manifest system (Phase 1)

### Database (Phase 2)
- PostgreSQL (schema prepared)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (for Phase 2)

### 1. Install Frontend Dependencies

```bash
cd project/frontend/react
npm install
```

### 2. Install Backend Dependencies

```bash
cd project/backend
npm install
```

### 3. Development Setup

**Backend (Terminal 1):**
```bash
cd project/backend
npm start
```

Backend will run on `http://localhost:3000`

**Frontend (Terminal 2):**
```bash
cd project/frontend/react
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Production Build

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

To change credentials, modify the `initializeAdminUser()` function in `backend/server.js`.

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

4. **Manifest.json is Truth**
   - Always stays in sync with actual files
   - Auto-updated on any document change

### Upload Process

1. Go to Admin Dashboard (`/admin`)
2. Login with admin credentials
3. Fill in the upload form:
   - Select PDF file
   - Choose category (GCF or Policy)
   - Enter display name
4. Click "Upload Document"

The system will:
- Generate a unique ID
- Create a stable filename from display name
- Save file to `/docs/gcf/` or `/docs/policy/`
- Update `manifest.json` automatically

### Delete Process

1. Go to Admin Dashboard
2. Find document in the list
3. Click delete button (trash icon)
4. Confirm deletion

The system will:
- Delete file from disk
- Remove entry from `manifest.json`
- ID is never reused

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /docs/manifest.json` - Get document manifest
- `GET /docs/:category/:filename` - Download PDF

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify admin session
- `GET /api/admin/documents` - List all documents
- `POST /api/admin/documents` - Upload new document
- `DELETE /api/admin/documents/:id` - Delete document

## Database Integration (Phase 2)

### Set Up PostgreSQL

1. Create database:
```sql
CREATE DATABASE eritrea_readiness;
```

2. Run schema:
```bash
psql -U your_username -d eritrea_readiness -f database/schema.sql
```

3. Update backend to use PostgreSQL:
   - Install `pg` package: `npm install pg`
   - Add database connection logic
   - Modify endpoints to use database instead of manifest.json

### Database Schema

The schema includes:
- `documents` table - Document metadata
- `admin_users` table - Admin credentials
- `document_audit_log` table - Audit trail

See `database/schema.sql` for complete schema.

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
JWT_SECRET=your-secret-key-here
NODE_ENV=production
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

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
- Change `PORT` in backend/.env
- Or stop the process using port 3000

### PDF Upload Fails
- Check file size (max 50MB)
- Ensure it's a valid PDF
- Check disk permissions

### Manifest.json Issues
- Backend auto-creates manifest.json on first run
- If corrupted, delete it and restart server

## Support

For issues or questions:
- Contact: Ministry of Land, Water and Environment, Asmara, Eritrea
- Email: info@readiness-eritrea.er

## License

© 2024 Readiness Eritrea - National Designated Authority. All rights reserved.
