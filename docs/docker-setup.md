# CalcBuilder Pro - Docker Development Setup

This document explains how to set up and use the Docker development environment for CalcBuilder Pro.

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** (usually included with Docker Desktop)
- **OpenSSL** for generating SSL certificates (macOS: `brew install openssl`)

### 1. Start Development Environment

```bash
# Make the script executable
chmod +x scripts/docker-dev.sh

# Start basic development environment (frontend + nginx)
./scripts/docker-dev.sh start

# Or start full environment (including local services)
./scripts/docker-dev.sh start-full
```

### 2. Access Your Application

- **Frontend**: http://localhost:3000
- **Nginx (HTTP)**: http://localhost (redirects to HTTPS)
- **Nginx (HTTPS)**: https://localhost
- **Health Check**: https://localhost/health

## 🐳 Docker Services Overview

### Core Services

| Service      | Port    | Description                     | Status      |
| ------------ | ------- | ------------------------------- | ----------- |
| **frontend** | 3000    | Next.js application             | ✅ Required |
| **nginx**    | 80, 443 | Reverse proxy & SSL termination | ✅ Required |

### Optional Local Services

| Service            | Port       | Description                   | Profile     |
| ------------------ | ---------- | ----------------------------- | ----------- |
| **supabase-local** | 5432       | Local PostgreSQL database     | `local-dev` |
| **redis**          | 6379       | Caching layer                 | `local-dev` |
| **mailhog**        | 1025, 8025 | Email testing (SMTP + Web UI) | `local-dev` |

## 📁 File Structure

```
├── Dockerfile                 # Next.js application container
├── docker-compose.yml         # Multi-service orchestration
├── nginx/
│   ├── nginx.conf            # Main Nginx configuration
│   ├── conf.d/
│   │   └── default.conf      # Server block configuration
│   ├── ssl/                  # SSL certificates (auto-generated)
│   └── logs/                 # Nginx access/error logs
├── scripts/
│   └── docker-dev.sh         # Development management script
├── env.example               # Environment variables template
└── docs/
    └── docker-setup.md       # This documentation
```

## ⚙️ Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

**Required Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### SSL Certificates

The development script automatically generates self-signed SSL certificates:

- **Certificate**: `nginx/ssl/localhost.crt`
- **Private Key**: `nginx/ssl/localhost.key`

**Note**: Self-signed certificates will show browser warnings in development.

## 🛠️ Development Commands

### Basic Operations

```bash
# Start development environment
./scripts/docker-dev.sh start

# Stop all services
./scripts/docker-dev.sh stop

# Restart services
./scripts/docker-dev.sh restart

# View logs
./scripts/docker-dev.sh logs
./scripts/docker-dev.sh logs frontend
./scripts/docker-dev.sh logs nginx

# Show container status
./scripts/docker-dev.sh status
```

### Advanced Operations

```bash
# Start full environment (including local services)
./scripts/docker-dev.sh start-full

# Rebuild containers
./scripts/docker-dev.sh rebuild

# Clean up everything (containers, volumes, images)
./scripts/docker-dev.sh cleanup
```

## 🔧 Manual Docker Commands

If you prefer using Docker commands directly:

```bash
# Start services
docker-compose up -d

# Start with specific services
docker-compose up -d frontend nginx

# Start with local development profile
docker-compose --profile local-dev up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🌐 Network Configuration

### Container Networking

- **Network**: `calcbuilder-network` (172.20.0.0/16)
- **Frontend**: Accessible via Nginx reverse proxy
- **Nginx**: Handles SSL termination and routing
- **Local Services**: Isolated in `local-dev` profile

### Port Mappings

| Container      | Internal Port | External Port | Purpose                     |
| -------------- | ------------- | ------------- | --------------------------- |
| frontend       | 3000          | 3000          | Direct access (development) |
| nginx          | 80, 443       | 80, 443       | Production access           |
| supabase-local | 5432          | 5432          | Database access             |
| redis          | 6379          | 6379          | Cache access                |
| mailhog        | 1025, 8025    | 1025, 8025    | Email testing               |

## 🔒 Security Features

### Nginx Security

- **Rate Limiting**: API (10 req/s), Login (5 req/min)
- **Security Headers**: HSTS, CSP, XSS Protection
- **SSL/TLS**: TLS 1.2+ with secure ciphers
- **Request Validation**: Client max body size (100MB)

### Container Security

- **Non-root Users**: Next.js runs as `nextjs` user
- **Read-only Volumes**: Nginx configs mounted read-only
- **Network Isolation**: Services communicate via internal network
- **Resource Limits**: Configurable via docker-compose

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :80
lsof -i :443

# Stop conflicting services or change ports in docker-compose.yml
```

#### 2. SSL Certificate Issues

```bash
# Regenerate SSL certificates
rm -rf nginx/ssl/*
./scripts/docker-dev.sh start
```

#### 3. Permission Issues

```bash
# Fix file permissions
chmod +x scripts/docker-dev.sh
chmod 755 nginx/ssl/
```

#### 4. Container Won't Start

```bash
# Check container logs
docker-compose logs frontend
docker-compose logs nginx

# Rebuild containers
./scripts/docker-dev.sh rebuild
```

### Debug Mode

```bash
# Start with detailed logging
docker-compose up

# Check container health
docker-compose ps
docker inspect calcbuilder-frontend
```

## 📊 Monitoring & Logs

### Log Locations

- **Nginx Access**: `nginx/logs/access.log`
- **Nginx Error**: `nginx/logs/error.log`
- **Container Logs**: `docker-compose logs -f [service]`

### Health Checks

- **Application**: https://localhost/health
- **Nginx**: https://localhost/health
- **Container Status**: `docker-compose ps`

## 🔄 Development Workflow

### 1. Daily Development

```bash
# Start environment
./scripts/docker-dev.sh start

# Make code changes (hot-reload enabled)
# View logs if needed
./scripts/docker-dev.sh logs frontend

# Stop when done
./scripts/docker-dev.sh stop
```

### 2. Testing Local Services

```bash
# Start full environment
./scripts/docker-dev.sh start-full

# Test local database
psql -h localhost -U postgres -d postgres

# Test email functionality
# Send email to localhost:1025, view at http://localhost:8025
```

### 3. Production Preparation

```bash
# Test production build
docker-compose build --target runner

# Verify production image
docker run --rm -p 3000:3000 calcbuilder-frontend:latest
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review container logs: `./scripts/docker-dev.sh logs`
3. Verify Docker is running: `docker info`
4. Check port availability: `lsof -i :[PORT]`
5. Rebuild containers: `./scripts/docker-dev.sh rebuild`
