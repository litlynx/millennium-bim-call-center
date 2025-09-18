import type { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';

/**
 * Global setup executado antes de todos os testes
 * Verifica se os serviços estão disponíveis e configura o ambiente
 */
async function globalSetup(_config: FullConfig) {
  console.log('🚀 Starting global setup for e2e tests...');

  // URLs dos serviços baseadas no ambiente
  const baseURL = process.env.BASE_URL || 'http://localhost:8080';
  const sharedURL = process.env.SHARED_HOST_BASE_URL || 'http://localhost:8081';
  const headerPagesURL = process.env.HEADER_PAGES_HOST_BASE_URL || 'http://localhost:8082';

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Verificar Shell (aplicação principal)
    console.log('⏳ Checking Shell service...');
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    console.log('✅ Shell service is running');

    // Verificar Shared components
    console.log('⏳ Checking Shared service...');
    await page.goto(sharedURL, { waitUntil: 'networkidle' });
    console.log('✅ Shared service is running');

    // Verificar Header Pages MFE
    console.log('⏳ Checking Header Pages service...');
    await page.goto(headerPagesURL, { waitUntil: 'networkidle' });
    console.log('✅ Header Pages service is running');

    console.log('🎉 Global setup completed successfully!');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    console.error('💡 Make sure all services are running with: bun run preview');
    throw new Error(`Services not available. Please run 'bun run preview' first.`);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
