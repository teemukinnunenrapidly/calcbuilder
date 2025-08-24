import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Global setup started...');
  
  // You can add global setup logic here
  // For example, setting up test database, creating test users, etc.
  
  // Wait for the application to be ready
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Try to access the homepage
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    await page.goto(baseURL, { timeout: 60000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to access application:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup completed');
}

export default globalSetup;