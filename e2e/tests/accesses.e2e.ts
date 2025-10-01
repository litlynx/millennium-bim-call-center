import { expect, type Page, test } from '@playwright/test';
import { useUserStore } from '../../packages/shared/src/stores/user';

const loggedConsoleMessages = new Set<string>();

const navigateToAccesses = async (page: Page) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    window.history.pushState({}, '', '/records/digital-channels/mobile-banking/accesses');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="accesses-page-data"]', { timeout: 15000 });
};

test.describe('Page Accesses', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (message) => {
      const type = message.type();
      if (type !== 'error' && type !== 'warning') {
        return;
      }

      const key = `${type}|${message.text()}`;
      if (loggedConsoleMessages.has(key)) {
        return;
      }
      loggedConsoleMessages.add(key);

      const location = message.location();
      const locationInfo = location.url
        ? ` @ ${location.url}:${location.lineNumber}:${location.columnNumber}`
        : '';
      console.log(`[console:${type}] ${message.text()}${locationInfo}`);
    });

    page.on('pageerror', (error) => {
      console.error(`[pageerror] ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      console.error(
        `[requestfailed] ${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? 'unknown error'}`
      );
    });
  });

  test('user store initializes with MOCK_USER', () => {
    const state = useUserStore.getState();
    expect(state.getCustomerName()).toBe('Jacinto Fazenda');
    expect(state.getCif()).toBe('PT12345678');
    expect(state.getAccountNumber()).toBe('764682235');
  });

  test('page displays all components', async ({ page }) => {
    await navigateToAccesses(page);
    await expect(page.getByTestId('page-header-component')).toBeVisible();
    await expect(page.getByTestId('primary-table-component')).toBeVisible();
    await expect(page.getByTestId('accesses-footer-section')).toBeVisible();
    await expect(page.getByTestId('script-detail-component')).toBeVisible();
  });
  /* -------------------------------------------------------------------------- */
  test.describe('Left Content Sections', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToAccesses(page);
    });

    test('pageHeader displays all content', async ({ page }) => {
      const pageHeaderLeft = page.getByTestId('page-header-left');
      const pageHeaderRight = page.getByTestId('page-header-right');

      await expect(pageHeaderLeft).toBeVisible();
      await expect(pageHeaderLeft).toContainText('Smart IZI - Acessos');

      await expect(pageHeaderRight).toBeVisible();
      await expect(pageHeaderRight).toContainText('Jacinto Fazenda');
      await expect(pageHeaderRight).toContainText('PT12345678');
      await expect(pageHeaderRight).toContainText('764682235');
    });

    test('primaryTable displays all data', async ({ page }) => {
      const primaryTable = page.getByTestId('primary-table-component');

      await expect(primaryTable.getByText('Operadora')).toBeVisible();
      await expect(primaryTable.getByText('N.º Telefone')).toBeVisible();
      await expect(primaryTable.getByText('Tipo')).toBeVisible();
      await expect(primaryTable.getByText('Estado SIM Swap')).toBeVisible();
      await expect(primaryTable.getByText('Estado Contracto')).toBeVisible();

      const rows = primaryTable.getByRole('row');
      await expect(rows.nth(1)).toContainText('TMcel');
      await expect(rows.nth(1)).toContainText('825 816 811');
      await expect(rows.nth(1)).toContainText('Principal');
      await expect(rows.nth(1)).toContainText('Activo');
    });

    test('form textarea submit closes with success', async ({ page }) => {
      const footer = page.getByTestId('accesses-footer-section');

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          logs.push(msg.text());
        }
      });

      await footer.getByRole('textbox').fill('Teste de motivo da chamada');
      await footer.getByRole('button', { name: 'Fechar' }).click();

      await expect.poll(() => logs.includes('Form submitted successfully!')).toBeTruthy();
    });

    test('button clear textarea text', async ({ page }) => {
      const footer = page.getByTestId('accesses-footer-section');
      const textArea = footer.getByRole('textbox');

      await textArea.fill('Texto de teste');
      await expect(textArea).toHaveValue('Texto de teste');

      const clearButton = footer.locator('textarea+span svg');
      await clearButton.click();

      await expect(textArea).toHaveValue('');
    });

    test('form textarea forward with success', async ({ page }) => {
      const footer = page.getByTestId('accesses-footer-section');

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          logs.push(msg.text());
        }
      });

      await footer.getByRole('textbox').fill('Teste de motivo da chamada');
      await footer.getByRole('button', { name: 'Encaminhar' }).click();

      await expect
        .poll(() =>
          logs.includes('Sending email to bocanaisremotos@bim.co.mz Teste de motivo da chamada')
        )
        .toBeTruthy();
    });

    test('form textarea submit error', async ({ page }) => {
      const footer = page.getByTestId('accesses-footer-section');

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          logs.push(msg.text());
        }
      });

      await footer.getByRole('button', { name: 'Encaminhar' }).click();

      await expect.poll(() => logs.includes('Cannot send email: Text area is empty.')).toBeTruthy();
    });
  });
});
