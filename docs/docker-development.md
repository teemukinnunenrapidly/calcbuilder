# Docker Development Guide

This guide explains how to use Docker for local development of CalcBuilder Pro.

## 🚀 Quick Start

### 1. Start all services (production mode)

```bash
docker-compose up -d
```

### 2. Start with local development services

```bash
docker-compose --profile local-dev up -d
```

### 3. View logs

```bash
docker-compose logs -f
```

### 4. Stop all services

```bash
docker-compose down
```

## 🐳 Services Overview

### Core Services (Always Running)

| Service      | Port    | Description                            |
| ------------ | ------- | -------------------------------------- |
| **frontend** | 3000    | Next.js application with hot-reloading |
| **nginx**    | 80, 443 | Reverse proxy with SSL termination     |

### Optional Services (local-dev profile)

| Service            | Port       | Description                   |
| ------------------ | ---------- | ----------------------------- |
| **supabase-local** | 5432       | Local PostgreSQL database     |
| **redis**          | 6379       | Redis cache                   |
| **mailhog**        | 1025, 8025 | Email testing (SMTP + Web UI) |

## 🔧 Development Workflow

### 1. Code Changes

The frontend container uses volume mounting for hot-reloading:

```yaml
volumes:
  - .:/app # Mount current directory
  - /app/node_modules # Preserve node_modules
  - /app/.next # Preserve Next.js cache
```

**Code changes are automatically reflected** without rebuilding containers.

### 2. Dependencies

To install new dependencies:

```bash
# Option 1: Install in container
docker-compose exec frontend npm install <package>

# Option 2: Install locally and rebuild
npm install <package>
docker-compose build frontend
```

### 3. Database Changes

For local development with Supabase:

```bash
# Start local database
docker-compose --profile local-dev up -d supabase-local

# Run migrations
docker-compose exec supabase-local psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migration.sql
```

## 🌐 Access Points

### Frontend Application

- **Local**: http://localhost:3000
- **Via Nginx**: http://localhost (HTTP) / https://localhost (HTTPS)

### Development Tools

- **Mailhog Web UI**: http://localhost:8025
- **Redis CLI**: `docker-compose exec redis redis-cli`

### Database

- **PostgreSQL**: `localhost:5432`
- **Connection**: `postgresql://postgres:postgres@localhost:5432/postgres`

## 🔒 SSL Configuration

### Development Certificates

Self-signed certificates are generated for local development:

```bash
# Generate new certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/localhost.key \
  -out nginx/ssl/localhost.crt \
  -subj "/C=FI/ST=Helsinki/L=Helsinki/O=CalcBuilder Pro/OU=Development/CN=localhost"
```

**Note**: Accept the security warning in your browser for localhost.

### Production Certificates

Replace the development certificates with real ones:

1. Place your certificates in `nginx/ssl/`
2. Update `nginx/conf.d/default.conf`
3. Restart nginx: `docker-compose restart nginx`

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports
docker-compose up -d -p 3001:3000
```

#### 2. Container Won't Start

```bash
# Check logs
docker-compose logs frontend

# Check container status
docker-compose ps

# Rebuild container
docker-compose build --no-cache frontend
```

#### 3. Health Check Failures

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect calcbuilder-frontend | grep -A 10 Health
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## 📊 Monitoring

### Container Status

```bash
# View all containers
docker-compose ps

# View resource usage
docker stats

# View logs for specific service
docker-compose logs -f frontend
```

### Health Checks

All services include health checks:

- **Frontend**: HTTP endpoint `/api/health`
- **Nginx**: Configuration validation
- **PostgreSQL**: Database connectivity
- **Redis**: Cache connectivity
- **Mailhog**: Web UI accessibility

## 🔄 Environment Variables

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (for local development)
SUPABASE_LOCAL_DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### Optional Variables

```env
# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
```

## 🚀 Production Deployment

### Build Production Image

```bash
# Build production image
docker build --target runner -t calcbuilder-pro:latest .

# Run production container
docker run -p 3000:3000 calcbuilder-pro:latest
```

### Production Docker Compose

```bash
# Use production profile
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec frontend npm run build

# View container logs
docker-compose logs -f frontend

# Restart specific service
docker-compose restart frontend

# Scale services
docker-compose up -d --scale frontend=3

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## 🔗 Related Documentation

- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
