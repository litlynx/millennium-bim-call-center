import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração base do Playwright para todos os MFEs
 * Esta configuração pode ser estendida por cada MFE individual
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Global setup hook - runs before all tests
  globalSetup: './global-setup.ts',

  // Diretório onde os testes estão localizados (será sobrescrito pelos MFEs)
  testDir: './tests',

  // Padrão de arquivos de teste - apenas arquivos *.e2e.*
  testMatch: '**/*.e2e.*',

  // Execução paralela total - melhora performance
  fullyParallel: true,

  // Impede execução de testes marcados com .only() em CI
  forbidOnly: !!process.env.CI,

  // Retries: 2x em CI para lidar com flakiness, 0 em dev para feedback rápido
  retries: process.env.CI ? 2 : 0,

  // Workers: 1 em CI para estabilidade, undefined em dev para usar todos os cores
  workers: process.env.CI ? 1 : undefined,

  // Timeout por teste (30s padrão)
  timeout: 30 * 1000,

  // Timeout para esperas (5s padrão)
  expect: {
    timeout: 5 * 1000
  },

  // Configuração de relatórios
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  // Configurações globais de uso
  use: {
    // URL base (será sobrescrita pelos MFEs)
    baseURL: process.env.BASE_URL || 'http://localhost:8080',

    // Trace apenas em retry para economizar espaço
    trace: 'on-first-retry',

    // Screenshot apenas em falhas
    screenshot: 'only-on-failure',

    // Video apenas em retry
    video: 'retain-on-failure',

    // Configurações de viewport padrão
    viewport: { width: 1920, height: 1080 },

    // Ignorar certificados HTTPS inválidos (comum em dev)
    ignoreHTTPSErrors: true
  },

  // Projetos de teste - diferentes browsers/devices
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  // Configuração do web server para testes
  webServer: {
    // Comando para iniciar os serviços (usa o script preview do projeto)
    // Nota: Requer que o build já tenha sido feito previamente
    command: 'cd .. && bun run preview:serve',

    // Verificar múltiplas URLs para garantir que todos os serviços estão prontos
    url: 'http://localhost:8080/',

    // Reutilizar servidor em desenvolvimento
    reuseExistingServer: !process.env.CI,

    // Timeout para o servidor iniciar (reduzido pois não fazemos build)
    timeout: 60 * 1000,

    // Variáveis de ambiente necessárias para o servidor
    env: {
      SHELL_PREVIEW_PORT: '8080',
      SHARED_PREVIEW_PORT: '8081',
      HEADER_PAGES_PREVIEW_PORT: '8082',
      SIDEBAR_PAGES_PREVIEW_PORT: '8083',
      RECORDS_PAGES_PREVIEW_PORT: '8084',
      DOCUMENTATION_PAGES_PREVIEW_PORT: '8085',
      SHARED_HOST_BASE_URL: 'http://localhost:8081/',
      HEADER_PAGES_HOST_BASE_URL: 'http://localhost:8082/',
      SIDEBAR_PAGES_HOST_BASE_URL: 'http://localhost:8083/',
      RECORDS_PAGES_HOST_BASE_URL: 'http://localhost:8084/',
      DOCUMENTATION_PAGES_HOST_BASE_URL: 'http://localhost:8085/'
    }
  },

  // Pastas de output
  outputDir: 'test-results/'
});
