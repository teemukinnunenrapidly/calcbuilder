#!/usr/bin/env node

/**
 * Deployment Script for Vercel
 * 
 * This script handles the deployment process to Vercel with proper
 * environment setup, pre-deployment checks, and post-deployment verification.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

// Configuration
const DEPLOYMENT_ENVIRONMENTS = {
  preview: {
    name: 'Preview',
    branch: 'develop',
    vercelFlag: '',
    healthCheckTimeout: 60000,
  },
  production: {
    name: 'Production',
    branch: 'main',
    vercelFlag: '--prod',
    healthCheckTimeout: 120000,
  },
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    deploy: '🚀',
  }[type] || '🔵';
  
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function runCommand(command, description) {
  log(`Running: ${description}`, 'info');
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`Completed: ${description}`, 'success');
    return { success: true, output: output.trim() };
  } catch (error) {
    log(`Failed: ${description} - ${error.message}`, 'error');
    return { success: false, error: error.message, output: error.stdout };
  }
}

function getCurrentBranch() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    return branch;
  } catch (error) {
    log('Failed to get current git branch', 'error');
    return null;
  }
}

function getCommitHash() {
  try {
    const hash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    return hash.substring(0, 8);
  } catch (error) {
    log('Failed to get commit hash', 'error');
    return 'unknown';
  }
}

function checkEnvironmentVariables() {
  log('Checking required environment variables...', 'info');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    log(`Missing required environment variables: ${missing.join(', ')}`, 'error');
    return false;
  }
  
  log('All required environment variables are present', 'success');
  return true;
}

function preDeploymentChecks() {
  log('Running pre-deployment checks...', 'info');
  
  // Check if working directory is clean
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('Working directory has uncommitted changes', 'warning');
      log('Consider committing changes before deployment', 'warning');
    } else {
      log('Working directory is clean', 'success');
    }
  } catch (error) {
    log('Could not check git status', 'warning');
  }
  
  // Check environment variables
  if (!checkEnvironmentVariables()) {
    return false;
  }
  
  // Run linting
  const lintResult = runCommand('npm run lint', 'ESLint check');
  if (!lintResult.success) {
    log('Linting failed - deployment cancelled', 'error');
    return false;
  }
  
  // Run type checking
  const typeCheckResult = runCommand('npm run type-check', 'TypeScript check');
  if (!typeCheckResult.success) {
    log('Type checking failed - deployment cancelled', 'error');
    return false;
  }
  
  // Run tests
  const testResult = runCommand('npm run test', 'Unit tests');
  if (!testResult.success) {
    log('Tests failed - deployment cancelled', 'error');
    return false;
  }
  
  log('All pre-deployment checks passed', 'success');
  return true;
}

function healthCheck(url, timeout = 60000) {
  return new Promise((resolve) => {
    log(`Performing health check: ${url}`, 'info');
    
    const timer = setTimeout(() => {
      log('Health check timed out', 'error');
      resolve(false);
    }, timeout);
    
    const request = https.get(`${url}/api/health`, (response) => {
      clearTimeout(timer);
      
      if (response.statusCode === 200) {
        log('Health check passed', 'success');
        resolve(true);
      } else {
        log(`Health check failed with status: ${response.statusCode}`, 'error');
        resolve(false);
      }
    });
    
    request.on('error', (error) => {
      clearTimeout(timer);
      log(`Health check failed: ${error.message}`, 'error');
      resolve(false);
    });
    
    request.setTimeout(timeout);
  });
}

async function deployToVercel(environment) {
  const config = DEPLOYMENT_ENVIRONMENTS[environment];
  const currentBranch = getCurrentBranch();
  const commitHash = getCommitHash();
  
  log(`Starting ${config.name} deployment...`, 'deploy');
  log(`Branch: ${currentBranch}`, 'info');
  log(`Commit: ${commitHash}`, 'info');
  
  // Check if we're on the correct branch for production
  if (environment === 'production' && currentBranch !== config.branch) {
    log(`Production deployments should be from ${config.branch} branch, currently on ${currentBranch}`, 'warning');
    
    if (process.env.FORCE_DEPLOY !== 'true') {
      log('Use FORCE_DEPLOY=true to override this check', 'info');
      return false;
    }
  }
  
  // Build the deployment command
  let deployCommand = 'vercel deploy';
  if (config.vercelFlag) {
    deployCommand += ` ${config.vercelFlag}`;
  }
  
  // Run the deployment
  const deployResult = runCommand(deployCommand, `Vercel ${config.name} deployment`);
  
  if (!deployResult.success) {
    log('Deployment failed', 'error');
    return false;
  }
  
  // Extract deployment URL from output
  const deploymentUrl = deployResult.output.split('\n').find(line => line.includes('https://'));
  
  if (deploymentUrl) {
    log(`Deployment URL: ${deploymentUrl}`, 'success');
    
    // Perform health check
    const healthCheckPassed = await healthCheck(deploymentUrl, config.healthCheckTimeout);
    
    if (healthCheckPassed) {
      log(`${config.name} deployment completed successfully!`, 'success');
      return { success: true, url: deploymentUrl };
    } else {
      log(`${config.name} deployment completed but health check failed`, 'warning');
      return { success: false, url: deploymentUrl };
    }
  } else {
    log('Could not extract deployment URL from Vercel output', 'warning');
    return { success: true, url: null };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'preview';
  
  if (!DEPLOYMENT_ENVIRONMENTS[environment]) {
    log(`Invalid environment: ${environment}`, 'error');
    log(`Valid environments: ${Object.keys(DEPLOYMENT_ENVIRONMENTS).join(', ')}`, 'info');
    process.exit(1);
  }
  
  log(`🚀 Starting deployment process for ${environment} environment...`, 'deploy');
  
  // Run pre-deployment checks
  if (!preDeploymentChecks()) {
    log('Pre-deployment checks failed - deployment cancelled', 'error');
    process.exit(1);
  }
  
  // Deploy to Vercel
  const deploymentResult = await deployToVercel(environment);
  
  if (deploymentResult && deploymentResult.success) {
    log('🎉 Deployment process completed successfully!', 'success');
    
    if (deploymentResult.url) {
      log(`🌐 Live URL: ${deploymentResult.url}`, 'info');
    }
    
    process.exit(0);
  } else {
    log('💥 Deployment process failed!', 'error');
    process.exit(1);
  }
}

// Handle different commands
const command = process.argv[2];

switch (command) {
  case 'preview':
  case 'staging':
    main();
    break;
    
  case 'production':
  case 'prod':
    main();
    break;
    
  case 'check':
    if (preDeploymentChecks()) {
      log('All checks passed - ready for deployment', 'success');
      process.exit(0);
    } else {
      log('Some checks failed - not ready for deployment', 'error');
      process.exit(1);
    }
    break;
    
  case 'health':
    const url = process.argv[3];
    if (!url) {
      log('Please provide URL for health check', 'error');
      process.exit(1);
    }
    
    healthCheck(url).then(passed => {
      process.exit(passed ? 0 : 1);
    });
    break;
    
  default:
    console.log('Usage: node scripts/deploy.js [command]');
    console.log('Commands:');
    console.log('  preview     Deploy to preview environment');
    console.log('  production  Deploy to production environment');
    console.log('  check       Run pre-deployment checks only');
    console.log('  health      Run health check on URL');
    break;
}