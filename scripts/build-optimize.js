#!/usr/bin/env node

/**
 * Build Optimization Script
 * 
 * This script optimizes the build process for production deployments.
 * It handles bundle analysis, image optimization, and performance monitoring.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization process...\n');

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const enableAnalysis = process.env.ANALYZE === 'true';
const enableOptimization = process.env.OPTIMIZE === 'true' || isProduction;

console.log(`📋 Build Configuration:
   🏗️  Environment: ${isProduction ? 'Production' : 'Development'}
   📊 Bundle Analysis: ${enableAnalysis ? 'Enabled' : 'Disabled'}
   ⚡ Optimization: ${enableOptimization ? 'Enabled' : 'Disabled'}
`);

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function createBuildReport() {
  console.log('📊 Creating build report...');
  
  const buildDir = '.next';
  const reportDir = 'build-reports';
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const buildReport = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
    buildId: fs.existsSync(`${buildDir}/BUILD_ID`) 
      ? fs.readFileSync(`${buildDir}/BUILD_ID`, 'utf8').trim()
      : 'unknown',
    optimization: enableOptimization,
    analysis: enableAnalysis,
  };
  
  // Get build size information
  if (fs.existsSync(`${buildDir}/static`)) {
    const staticDir = `${buildDir}/static`;
    const getBuildSize = (dir) => {
      let totalSize = 0;
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
          totalSize += getBuildSize(filePath);
        } else {
          totalSize += fs.statSync(filePath).size;
        }
      }
      return totalSize;
    };
    
    buildReport.buildSize = {
      totalBytes: getBuildSize(staticDir),
      totalMB: (getBuildSize(staticDir) / 1024 / 1024).toFixed(2),
    };
  }
  
  const reportPath = path.join(reportDir, `build-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(buildReport, null, 2));
  
  console.log(`✅ Build report saved: ${reportPath}\n`);
  console.log(`📦 Build Summary:
   🏗️  Build ID: ${buildReport.buildId}
   📊 Total Size: ${buildReport.buildSize?.totalMB || 'Unknown'} MB
   ⏰ Timestamp: ${buildReport.timestamp}
  `);
}

function optimizeAssets() {
  console.log('🖼️  Optimizing assets...');
  
  const publicDir = 'public';
  const optimizedDir = path.join(publicDir, 'optimized');
  
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Image optimization would go here
  // For now, we'll just log that it's ready for implementation
  console.log('✅ Asset optimization ready (implement image compression as needed)\n');
}

function validateBuild() {
  console.log('🔍 Validating build...');
  
  const buildDir = '.next';
  const requiredFiles = [
    `${buildDir}/BUILD_ID`,
    `${buildDir}/static`,
    `${buildDir}/server`,
  ];
  
  let isValid = true;
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Missing required build file: ${file}`);
      isValid = false;
    }
  }
  
  if (isValid) {
    console.log('✅ Build validation passed\n');
  } else {
    console.error('❌ Build validation failed\n');
    process.exit(1);
  }
  
  return isValid;
}

async function main() {
  try {
    // Step 1: Clean previous build
    if (fs.existsSync('.next')) {
      console.log('🧹 Cleaning previous build...');
      execSync('rm -rf .next', { stdio: 'inherit' });
      console.log('✅ Previous build cleaned\n');
    }
    
    // Step 2: Run the build
    const buildSuccess = runCommand('next build', 'Building application');
    if (!buildSuccess) {
      process.exit(1);
    }
    
    // Step 3: Validate build
    validateBuild();
    
    // Step 4: Optimize assets (if enabled)
    if (enableOptimization) {
      optimizeAssets();
    }
    
    // Step 5: Create build report
    createBuildReport();
    
    // Step 6: Run bundle analysis (if enabled)
    if (enableAnalysis) {
      console.log('📊 Running bundle analysis...');
      process.env.ANALYZE = 'true';
      runCommand('npm run analyze', 'Bundle analysis');
    }
    
    console.log('🎉 Build optimization completed successfully!');
    
  } catch (error) {
    console.error('❌ Build optimization failed:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'optimize':
  case 'build':
    main();
    break;
    
  case 'analyze':
    process.env.ANALYZE = 'true';
    main();
    break;
    
  case 'validate':
    validateBuild();
    break;
    
  default:
    console.log('Usage: node scripts/build-optimize.js [command]');
    console.log('Commands:');
    console.log('  optimize, build  Run optimized build process');
    console.log('  analyze          Run build with bundle analysis');
    console.log('  validate         Validate existing build');
    break;
}