# CalcBuilder Database Setup

This directory contains database migrations and setup files for the CalcBuilder project.

## Quick Start

### 1. Apply the Initial Schema

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your "CalcBuilder" project
3. Navigate to the SQL Editor
4. Copy and paste the contents of `migrations/001_initial_schema.sql`
5. Click "Run" to execute the migration

**Option B: Using Supabase CLI**
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project (you'll need your project reference)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

### 2. Verify the Setup

After running the migration, you should see these tables in your database:
- `companies` - Multi-tenant company data
- `users` - Company members and authentication
- `calculators` - Calculator configurations
- `form_sections` - Form structure organization
- `form_fields` - Individual form fields and validation
- `shortcodes` - Reusable formulas and content
- `visual_elements` - Images, modals, tooltips
- `email_templates` - Email configurations
- `leads` - Captured lead data

### 3. Test the Schema

You can test the schema by running some sample queries:

```sql
-- Check if all tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Test the sample data
SELECT * FROM companies WHERE slug = 'demo';
SELECT * FROM users WHERE email = 'demo@calcbuilder.com';
```

## Schema Overview

### Core Tables

1. **companies** - Root table for multi-tenancy
   - Each company has its own isolated data
   - Includes branding settings and subscription info

2. **users** - Company members with role-based access
   - Linked to companies for data isolation
   - Supports admin, member, viewer roles

3. **calculators** - Main calculator configurations
   - Company-scoped calculator definitions
   - Includes settings, themes, and metadata

4. **form_sections** - Organizes calculator forms into sections
   - Supports multi-step forms
   - Conditional display logic

5. **form_fields** - Individual form inputs
   - Various field types (number, text, select, etc.)
   - Validation rules and conditional logic

6. **shortcodes** - Reusable formulas and content
   - Mathematical expressions
   - Dynamic content placeholders

7. **visual_elements** - Rich UI components
   - Images, modals, tooltips
   - Conditional display triggers

8. **email_templates** - Email automation
   - Lead notifications
   - User result delivery

9. **leads** - Captured user data
   - Form responses and calculated results
   - Lead management and tracking

### Security Features

- **Row Level Security (RLS)** - All tables have RLS enabled
- **Multi-tenant isolation** - Companies can only access their own data
- **Role-based permissions** - Admin, member, viewer access levels
- **Secure functions** - Database functions with proper security context

### Performance Optimizations

- **Strategic indexes** - Optimized for common query patterns
- **Foreign key constraints** - Data integrity and referential consistency
- **JSONB fields** - Flexible schema for settings and configurations
- **Trigger-based timestamps** - Automatic updated_at maintenance

## Environment Variables

After setting up the database, you'll need these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Connection (if needed for direct access)
DATABASE_URL=postgresql://postgres:thCD8B9Df-Saj%k@db.your-project.supabase.co:5432/postgres
```

## Next Steps

After the database is set up:

1. **Configure Authentication** - Set up Supabase Auth providers
2. **Test RLS Policies** - Verify data isolation works correctly
3. **Create Sample Data** - Add test companies and calculators
4. **Set up API Layer** - Connect your application to the database
5. **Implement Frontend** - Build the calculator builder interface

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Make sure RLS policies are correctly configured
   - Verify user authentication is working

2. **Foreign Key Constraint Violations**
   - Check that parent records exist before creating child records
   - Ensure proper company_id context

3. **Migration Fails**
   - Check for syntax errors in the SQL
   - Verify extensions are available in your Supabase project

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the SQL migration file for detailed comments
- Test individual table creation if the full migration fails
