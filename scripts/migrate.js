#!/usr/bin/env node

/**
 * Database Migration Script for Supabase
 * 
 * This script handles database migrations for the CalcBuilder Pro application.
 * Since we're using Supabase, we don't have traditional migrations like other ORMs,
 * but we can manage schema changes and data migrations.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConnection() {
  try {
    console.log('🔌 Checking database connection...');
    const { data, error } = await supabase.from('companies').select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function runSqlFile(filePath) {
  try {
    console.log(`📁 Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🚀 Executing SQL migration...`);
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ SQL migration executed successfully');
    return true;
  } catch (error) {
    console.error('❌ SQL migration failed:', error.message);
    return false;
  }
}

async function createMigrationTable() {
  console.log('📋 Creating migrations table...');
  
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSql });
    if (error) throw error;
    console.log('✅ Migrations table ready');
    return true;
  } catch (error) {
    console.error('❌ Failed to create migrations table:', error.message);
    return false;
  }
}

async function getExecutedMigrations() {
  try {
    const { data, error } = await supabase
      .from('_migrations')
      .select('filename')
      .order('executed_at');
    
    if (error) throw error;
    return data.map(row => row.filename);
  } catch (error) {
    console.error('❌ Failed to get executed migrations:', error.message);
    return [];
  }
}

async function markMigrationAsExecuted(filename) {
  try {
    const { error } = await supabase
      .from('_migrations')
      .insert({ filename });
    
    if (error) throw error;
    console.log(`✅ Marked migration as executed: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to mark migration as executed: ${filename}`, error.message);
  }
}

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 No migrations directory found, creating one...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    console.log('✅ Migrations directory created');
    return;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.log('📄 No migration files found');
    return;
  }
  
  const executedMigrations = await getExecutedMigrations();
  const pendingMigrations = migrationFiles.filter(file => !executedMigrations.includes(file));
  
  if (pendingMigrations.length === 0) {
    console.log('✅ All migrations are up to date');
    return;
  }
  
  console.log(`📦 Found ${pendingMigrations.length} pending migration(s)`);
  
  for (const filename of pendingMigrations) {
    console.log(`\n🔄 Running migration: ${filename}`);
    const filePath = path.join(migrationsDir, filename);
    
    const success = await runSqlFile(filePath);
    if (success) {
      await markMigrationAsExecuted(filename);
    } else {
      console.error(`❌ Migration failed, stopping: ${filename}`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All migrations completed successfully!');
}

async function main() {
  console.log('🚀 Starting database migration process...\n');
  
  // Check database connection
  const connected = await checkConnection();
  if (!connected) {
    process.exit(1);
  }
  
  // Create migration tracking table
  const tableCreated = await createMigrationTable();
  if (!tableCreated) {
    process.exit(1);
  }
  
  // Run pending migrations
  await runMigrations();
  
  console.log('\n✅ Migration process completed!');
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'up':
  case 'migrate':
    main().catch(error => {
      console.error('❌ Migration process failed:', error);
      process.exit(1);
    });
    break;
  
  case 'status':
    checkConnection().then(connected => {
      if (connected) {
        getExecutedMigrations().then(migrations => {
          console.log('📋 Executed migrations:');
          migrations.forEach(migration => console.log(`   ✅ ${migration}`));
        });
      }
    });
    break;
  
  default:
    console.log('Usage: node scripts/migrate.js [command]');
    console.log('Commands:');
    console.log('  up, migrate  Run pending migrations');
    console.log('  status       Show migration status');
    break;
}