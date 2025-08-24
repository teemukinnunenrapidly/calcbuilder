# CI/CD Pipeline Setup Guide

This document outlines the complete CI/CD pipeline setup for CalcBuilder Pro, including automated testing, deployment to Vercel, and database migrations with Supabase.

## 🎯 Overview

Our CI/CD pipeline provides:

- ✅ **Automated Testing** - Unit tests, E2E tests, accessibility, and performance
- 🚀 **Deployment Automation** - Preview and production deployments to Vercel
- 🗄️ **Database Migrations** - Automated Supabase schema management
- 🔒 **Security Scanning** - Dependency audits and vulnerability checks
- 📊 **Performance Monitoring** - Lighthouse CI and bundle analysis
- ♿ **Accessibility Testing** - Automated a11y compliance checks

## 🛠️ Setup Instructions

### 1. GitHub Repository Setup

Ensure your repository has the following structure:
```
.github/
  workflows/
    ci.yml                 # Main CI/CD pipeline
tests/
  e2e/                     # Playwright E2E tests
  unit/                    # Unit tests
scripts/
  build-optimize.js        # Build optimization
  deploy.js               # Deployment automation
  migrate.js              # Database migrations
database/
  migrations/             # SQL migration files
```

### 2. Environment Variables

#### GitHub Secrets
Configure these secrets in your GitHub repository:

**Vercel Configuration:**
```
VERCEL_TOKEN              # Vercel CLI token
VERCEL_ORG_ID            # Vercel organization ID
VERCEL_PROJECT_ID        # Vercel project ID
```

**Supabase Configuration:**
```
NEXT_PUBLIC_SUPABASE_URL     # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY    # Supabase service role key
```

**Authentication:**
```
NEXTAUTH_SECRET              # NextAuth.js secret
NEXTAUTH_URL                 # Production URL
```

**Optional Services:**
```
LHCI_GITHUB_APP_TOKEN       # Lighthouse CI GitHub token
PRODUCTION_URL              # Production URL for health checks
```

#### Vercel Environment Variables
In your Vercel dashboard, configure the same environment variables for your deployments.

### 3. Vercel Project Setup

1. **Link Repository**: Connect your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Build Command: `npm run build:optimize`
   - Output Directory: `.next`
   - Install Command: `npm ci`

3. **Environment Configuration**: Add all environment variables in Vercel dashboard

### 4. Supabase Setup

1. **Create Project**: Set up your Supabase project
2. **Database Schema**: Run initial migrations using the migration script
3. **RLS Policies**: Ensure Row Level Security is properly configured

## 🔄 Pipeline Workflows

### Pull Request Workflow

When you create a pull request:

1. **Code Quality Checks**
   - ESLint linting
   - Prettier formatting check
   - TypeScript type checking

2. **Testing Suite**
   - Unit tests with Jest
   - E2E tests with Playwright
   - Coverage reporting

3. **Build Validation**
   - Production build test
   - Bundle size analysis

4. **Security Scanning**
   - Dependency audit
   - Vulnerability scanning

5. **Preview Deployment**
   - Automatic Vercel preview deployment
   - Health check verification

### Main Branch Workflow

When you merge to main:

1. **Full Test Suite**
   - All PR checks
   - Extended E2E test matrix
   - Performance testing

2. **Production Deployment**
   - Vercel production deployment
   - Database migration execution
   - Health check verification

3. **Post-Deployment**
   - Performance monitoring
   - Accessibility validation
   - Success notifications

## 📊 Available Commands

### Testing Commands
```bash
npm run test                 # Unit tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
npm run test:e2e           # E2E tests
npm run test:e2e:ui        # E2E with UI
npm run test:ci            # Full CI test suite
```

### Build Commands
```bash
npm run build              # Standard build
npm run build:optimize     # Optimized build
npm run build:analyze      # Build with analysis
npm run build:validate     # Validate build
npm run analyze            # Bundle analysis
```

### Deployment Commands
```bash
npm run deploy:check       # Pre-deployment checks
npm run deploy:preview     # Deploy to preview
npm run deploy:production  # Deploy to production
npm run deploy:health      # Health check
```

### Database Commands
```bash
npm run db:migrate         # Run migrations
npm run db:migrate:status  # Migration status
npm run db:reset          # Reset database
npm run db:seed           # Seed data
```

### Quality & Performance
```bash
npm run lint              # ESLint check
npm run format:check      # Prettier check
npm run type-check        # TypeScript check
npm run security:audit    # Security audit
npm run perf:lighthouse   # Performance test
npm run a11y:test        # Accessibility test
```

## 🗄️ Database Migrations

### Migration System

We use a custom migration system for Supabase:

1. **Migration Files**: Store SQL files in `database/migrations/`
2. **Naming Convention**: `XXX_description.sql` (e.g., `001_create_users.sql`)
3. **Tracking**: Automatically tracked in `_migrations` table

### Creating Migrations

1. Create a new SQL file in `database/migrations/`
2. Use incremental numbering (001, 002, 003, etc.)
3. Include descriptive comments and rollback instructions

Example migration:
```sql
-- Migration: 002_add_user_preferences
-- Description: Add user preferences table
-- Date: 2025-01-21

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);
```

### Running Migrations

```bash
# Check migration status
npm run db:migrate:status

# Run pending migrations
npm run db:migrate

# Run migrations manually
node scripts/migrate.js migrate
```

## 🚀 Deployment Process

### Automatic Deployments

- **Preview**: Triggered on pull requests
- **Production**: Triggered on main branch pushes

### Manual Deployments

```bash
# Deploy to preview
npm run deploy:preview

# Deploy to production (with checks)
npm run deploy:production

# Check deployment readiness
npm run deploy:check
```

### Deployment Verification

Each deployment includes:

1. **Pre-deployment checks**
   - Code quality validation
   - Test suite execution
   - Environment verification

2. **Deployment execution**
   - Build optimization
   - Asset upload to Vercel
   - Environment configuration

3. **Post-deployment verification**
   - Health check endpoints
   - Smoke tests
   - Performance validation

## 📈 Monitoring & Reporting

### Performance Monitoring

- **Lighthouse CI**: Automated performance audits
- **Bundle Analysis**: Bundle size tracking
- **Vercel Analytics**: Real-time performance metrics

### Test Reporting

- **Coverage Reports**: Automated coverage tracking
- **E2E Reports**: Playwright test results
- **Accessibility Reports**: a11y compliance checks

### Security Monitoring

- **Dependency Audits**: Automated vulnerability scanning
- **Security Headers**: OWASP compliance validation
- **Code Analysis**: Static security analysis

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build locally
npm run build:validate

# Run with analysis
npm run build:analyze
```

#### Test Failures
```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=specific-test.test.ts
```

#### Deployment Issues
```bash
# Check deployment prerequisites
npm run deploy:check

# Verify environment variables
node scripts/deploy.js check

# Check health endpoint
npm run deploy:health https://your-app.vercel.app
```

#### Migration Problems
```bash
# Check migration status
npm run db:migrate:status

# Verify database connection
node scripts/migrate.js status
```

### Getting Help

1. **Check Logs**: Review GitHub Actions logs for detailed error information
2. **Vercel Dashboard**: Check Vercel deployment logs and analytics
3. **Supabase Dashboard**: Monitor database performance and logs
4. **Local Testing**: Reproduce issues locally using the same commands

## 🎯 Best Practices

### Code Quality

- Always run `npm run lint` before committing
- Maintain test coverage above 70%
- Use TypeScript strict mode
- Follow the established coding standards

### Deployment Safety

- Never deploy directly to production without testing
- Always review preview deployments
- Monitor health checks after deployment
- Keep environment variables secure

### Database Management

- Always test migrations locally first
- Include rollback instructions in migration files
- Monitor migration execution times
- Backup data before major schema changes

### Performance

- Monitor bundle size with each change
- Run Lighthouse audits regularly
- Optimize images and assets
- Use Next.js performance features

This CI/CD setup ensures reliable, automated deployments while maintaining high code quality and performance standards.