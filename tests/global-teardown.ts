import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Global teardown started...');
  
  // You can add global teardown logic here
  // For example, cleaning up test database, removing test files, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;