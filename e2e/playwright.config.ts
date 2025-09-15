import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração base do Playwright para todos os MFEs
 * Esta configuração pode ser estendida por cada MFE individual
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório onde os testes estão localizados (será sobrescrito pelos MFEs)
  testDir: './tests',

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
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ],

  // Configuração do web server para testes
  webServer: {
    // Comando para iniciar os serviços (usa o script preview do projeto)
    command: 'cd .. && bun run build && bun run preview:serve:win',

    url: 'http://localhost:8080/',

    // Reutilizar servidor em desenvolvimento
    reuseExistingServer: !process.env.CI,

    // Timeout para o servidor iniciar
    timeout: 120 * 1000
  },

  // Pastas de output
  outputDir: 'test-results/'
});

//TODO adicionar forma de não fazer build localmente
