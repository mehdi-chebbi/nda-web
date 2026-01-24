# Docker Setup Guide

This guide will help you set up and run the Eritrea Readiness project using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Configure Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

**Important**: Edit `.env` and change `JWT_SECRET` to a secure random string!

### 3. Build and Start All Services

```bash
docker-compose up -d --build
```

This will:
- Build and start PostgreSQL database
- Build and start the backend API server
- Build and start the frontend (React + Nginx)

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## Services

### PostgreSQL Database
- **Image**: postgres:16-alpine
- **Container**: eritrea-readiness-db
- **Port**: 5432
- **Database**: eritrea_readiness
- **User**: postgres
- **Password**: postgres
- **Volume**: postgres_data (persistent storage)

### Backend
- **Container**: eritrea-readiness-backend
- **Port**: 3000
- **Environment**:
  - `NODE_ENV=production`
  - `PORT=3000`
  - `DB_HOST=postgres`
  - `DB_PORT=5432`
  - `DB_NAME=eritrea_readiness`
  - `DB_USER=postgres`
  - `DB_PASSWORD=postgres`
  - `JWT_SECRET` (from .env)
- **Volumes**:
  - backend_uploads (for temporary file uploads)
  - backend_docs (for document storage)
  - backend_news_imgs (for news images)

### Frontend
- **Container**: eritrea-readiness-frontend
- **Port**: 80
- **Nginx**: Serves React app and proxies API requests to backend
- **Features**:
  - SPA routing support
  - API proxy to backend
  - Static file caching
  - Gzip compression
  - Security headers

## Docker Commands

### Start All Services
```bash
docker-compose up -d
```

### Build and Start All Services
```bash
docker-compose up -d --build
```

### Stop All Services
```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ This deletes all data!)
```bash
docker-compose down -v
```

### View Logs

All services:
```bash
docker-compose logs -f
```

Specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild a Single Service
```bash
docker-compose up -d --build backend
```

### Execute Commands in Container

Backend:
```bash
docker-compose exec backend sh
```

PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d eritrea_readiness
```

## Environment Variables

### Required (.env file)

| Variable | Description | Default | Required |
|----------|-------------|-----------|-----------|
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |

### Optional (docker-compose.yml defaults)

| Variable | Description | Default |
|----------|-------------|-----------|
| `NODE_ENV` | Node environment | production |
| `PORT` | Backend server port | 3000 |
| `DB_HOST` | Database host | postgres |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | eritrea_readiness |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data`: PostgreSQL database files
- `backend_uploads`: Temporary upload files
- `backend_docs`: Document files
- `backend_news_imgs`: News images

## Health Checks

All services include health checks:

- **PostgreSQL**: Checks if database accepts connections
- **Backend**: Checks `/api/health` endpoint
- **Frontend**: Checks if nginx is serving

Services will automatically restart if health checks fail.

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**⚠️ IMPORTANT**: Change the default admin password immediately after first login!

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker-compose logs <service-name>
```

### Database Connection Issues

Verify database is healthy:
```bash
docker-compose ps
```

Database container should show "healthy" status.

### Port Already in Use

If port 80, 3000, or 5432 is already in use, modify ports in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change from 80 to 8080

  backend:
    ports:
      - "4000:3000"  # Change from 3000 to 4000

  postgres:
    ports:
      - "5433:5432"  # Change from 5432 to 5433
```

### Reset Everything (Delete All Data)

```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### View Running Processes

```bash
docker-compose top
```

### Inspect Container

```bash
docker-compose exec backend ps aux
```

## Production Deployment

For production deployment:

1. **Change JWT_SECRET** in `.env` to a strong, random value
2. **Change database password** in `docker-compose.yml`
3. **Use HTTPS** - Add a reverse proxy (Traefik, Caddy, Nginx) for SSL/TLS
4. **Set up backups** - Use volume backups for PostgreSQL data
5. **Monitor logs** - Set up log aggregation (ELK, Splunk, etc.)
6. **Resource limits** - Add resource limits in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Development vs Production

### Development Mode
For development with hot-reload, don't use Docker. Instead:
- Backend: `npm run dev` (use nodemon)
- Frontend: `npm run dev` (use Vite dev server)

### Production Mode
Docker setup is optimized for production:
- Multi-stage builds (smaller images)
- Nginx for static files
- Health checks
- Automatic restarts
- Volume persistence

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend  │────▶│   Nginx    │────▶│  Backend    │
│  (React)   │     │   (Proxy)   │     │  (Node.js)  │
│  Port 80   │     │   Port 80   │     │  Port 3000  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │ PostgreSQL   │
                                           │  Port 5432 │
                                           └─────────────┘
```

## File Structure

```
project/
├── docker-compose.yml          # Main Docker Compose configuration
├── .env.example             # Environment variables template
├── .env                    # Your environment variables (create this)
├── backend/
│   ├── Dockerfile          # Backend container image
│   └── .dockerignore      # Files to exclude from build
└── frontend/
    └── react/
        ├── Dockerfile      # Frontend container image
        ├── nginx.conf     # Nginx configuration
        └── .dockerignore  # Files to exclude from build
```

## Security Best Practices

1. ✅ Use strong JWT_SECRET in production
2. ✅ Change default admin password
3. ✅ Use environment variables for secrets
4. ✅ Don't commit `.env` file
5. ✅ Use HTTPS in production
6. ✅ Keep images updated: `docker-compose pull && docker-compose up -d`
7. ✅ Run non-root containers (future enhancement)
8. ✅ Implement rate limiting (future enhancement)

## Support

For issues or questions:
- Check Docker logs: `docker-compose logs -f`
- Verify all services are running: `docker-compose ps`
- Check port conflicts
- Ensure you're using Docker version 20.10+
