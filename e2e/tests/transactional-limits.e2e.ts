import { expect, test } from '@playwright/test';
import { navigateToTransactionalLimits, setupConsoleLogging } from '../helpers/test-helpers';

const loggedConsoleMessages = new Set<string>();

test.describe('Page TransactionalLimits', () => {
  test.beforeEach(async ({ page }) => {
    setupConsoleLogging(page, loggedConsoleMessages);
    await navigateToTransactionalLimits(page);
  });

  test('renders with all elements on the page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Limites Transaccionais/i);

    // Check page header
    await expect(page.getByText('Smart IZI - Limites Transaccionais')).toBeVisible();

    // Check user information is displayed
    await expect(page.getByText('Jacinto Fazenda')).toBeVisible();
    await expect(page.getByText('PT12345678')).toBeVisible();
    await expect(page.getByText('764682235')).toBeVisible();

    // Check textarea and submit button
    await expect(page.getByPlaceholder('Motivo da Chamada')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeVisible();

    // Check script detail component
    await expect(page.getByText('Script')).toBeVisible();
  });

  test.describe('Left Content Sections', () => {
    test('pageHeader displays all content', async ({ page }) => {
      const pageHeaderLeft = page.getByTestId('page-header-left');
      const pageHeaderRight = page.getByTestId('page-header-right');

      await expect(pageHeaderLeft).toBeVisible();
      await expect(pageHeaderLeft).toContainText('Smart IZI - Limites Transaccionais');

      await expect(pageHeaderRight).toBeVisible();
      await expect(pageHeaderRight).toContainText('Jacinto Fazenda');
      await expect(pageHeaderRight).toContainText('PT12345678');
      await expect(pageHeaderRight).toContainText('764682235');
    });

    test('operatorState div displays all data', async ({ page }) => {
      const operatorStateDiv = page.getByTestId('operator-state-table-component');

      await expect(operatorStateDiv.getByText('Operadora')).toBeVisible();
      await expect(operatorStateDiv.getByText('Estado do Contracto')).toBeVisible();
      await expect(operatorStateDiv.getByText('Estado do PIN2')).toBeVisible();

      await expect(operatorStateDiv.getByText('TMcel')).toBeVisible();
      await expect(operatorStateDiv.getByText('Activo')).toHaveCount(2);
    });

    test('transactionalLimitsTable displays all data', async ({ page }) => {
      const transactionalLimitsTable = page.getByTestId('transactional-limits-table-component');

      await expect(transactionalLimitsTable.getByText('Telefone')).toBeVisible();
      await expect(transactionalLimitsTable.getByText('Limite de Transferências')).toBeVisible();
      await expect(transactionalLimitsTable.getByText('Limite de recargas')).toBeVisible();

      const rows = transactionalLimitsTable.getByRole('row');
      await expect(rows.nth(1)).toContainText('+258 878 640 120');
      await expect(rows.nth(1)).toContainText('MT 5,000.00');
      await expect(rows.nth(1)).toContainText('MT 2,000.00');
    });

    test.describe('Form Submission', () => {
      test('user is able to submit the textarea value without files attached', async ({ page }) => {
        const logs: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'log') {
            logs.push(msg.text());
          }
        });

        // Fill textarea with content
        const textarea = page.getByPlaceholder('Motivo da Chamada');
        await textarea.fill('Test submission without files');

        // Submit form
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Verify successful submission
        await expect
          .poll(() => logs.some((log) => log.includes('Form submitted successfully!')))
          .toBeTruthy();

        await expect
          .poll(() =>
            logs.some((log) => log.includes('Text content: Test submission without files'))
          )
          .toBeTruthy();
      });

      test('user is not able to submit the form if only files are provided', async ({ page }) => {
        const logs: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'log') {
            logs.push(msg.text());
          }
        });

        // Upload file without filling textarea
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([
          {
            name: 'test-document.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test file content')
          }
        ]);

        // Wait for file upload to complete
        await page.waitForTimeout(1000);

        // Leave textarea empty and try to submit
        const textarea = page.getByPlaceholder('Motivo da Chamada');
        await textarea.clear();

        // Submit form
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Wait a moment for validation
        await page.waitForTimeout(500);

        // Verify form validation failed (should not navigate)
        await expect
          .poll(() => logs.some((log) => log.includes('Form validation failed')))
          .toBeTruthy();

        // Should still be on the same page
        await expect(page.getByText('Smart IZI - Limites Transaccionais')).toBeVisible();
      });

      test('user is able to submit form with files and textarea filled', async ({ page }) => {
        const logs: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'log') {
            logs.push(msg.text());
          }
        });

        // Fill textarea
        const textarea = page.getByPlaceholder('Motivo da Chamada');
        await textarea.fill('Test submission with files attached');

        // Upload file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([
          {
            name: 'test-document.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test file content')
          }
        ]);

        // Wait for file upload to complete
        await expect(page.getByText('test-document.txt')).toBeVisible({ timeout: 5000 });

        // Wait for file upload to complete - progress bar might be indeterminate or disappear
        await page.waitForTimeout(2000);

        // Submit form
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Verify successful submission
        await expect
          .poll(() => logs.some((log) => log.includes('Form submitted successfully!')))
          .toBeTruthy();

        await expect
          .poll(() =>
            logs.some((log) => log.includes('Text content: Test submission with files attached'))
          )
          .toBeTruthy();

        await expect.poll(() => logs.some((log) => log.includes('Uploaded files:'))).toBeTruthy();
      });

      test('user is not able to add more documents if it passes the 4MB mark', async ({ page }) => {
        // Upload a file that's close to 4MB
        const largeFile = Buffer.alloc(3 * 1024 * 1024); // 3MB file
        const fileInput = page.locator('input[type="file"]');

        await fileInput.setInputFiles([
          {
            name: 'large-file-1.txt',
            mimeType: 'text/plain',
            buffer: largeFile
          }
        ]);

        // Wait for file upload
        await expect(page.getByText('large-file-1.txt')).toBeVisible({ timeout: 5000 });

        // Try to upload another file that would exceed 4MB total
        const anotherLargeFile = Buffer.alloc(2 * 1024 * 1024); // 2MB file
        await fileInput.setInputFiles([
          {
            name: 'large-file-2.txt',
            mimeType: 'text/plain',
            buffer: anotherLargeFile
          }
        ]);

        // Wait a moment for validation
        await page.waitForTimeout(1000);

        // Check for error message about total size
        const errorMessages = page.locator('text=/tamanho total.*não deve exceder.*4.*MB/i');
        await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
      });

      test('user can remove uploaded files', async ({ page }) => {
        // Upload a file
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles([
          {
            name: 'test-to-remove.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test file to be removed')
          }
        ]);

        // Wait for file to appear
        await expect(page.getByText('test-to-remove.txt')).toBeVisible({ timeout: 5000 });

        // Find and click the remove button
        const removeButton = page
          .locator('button[aria-label*="Remover test-to-remove.txt"]')
          .first();
        await removeButton.click();

        // Verify file is removed
        await expect(page.getByText('test-to-remove.txt')).not.toBeVisible();
      });

      test('textarea character count updates correctly', async ({ page }) => {
        const textarea = page.getByPlaceholder('Motivo da Chamada');

        // Type some text
        const testText = 'This is a test message';
        await textarea.fill(testText);

        // Check character count display
        const charCount = page.locator(`text=/${testText.length}\\/2000/`);
        await expect(charCount).toBeVisible();
      });

      test('textarea clear button works correctly', async ({ page }) => {
        const textarea = page.getByPlaceholder('Motivo da Chamada');

        // Fill textarea
        await textarea.fill('Text to be cleared');
        await expect(textarea).toHaveValue('Text to be cleared');

        // Find and click clear button
        const clearButton = page.locator('textarea+span svg').first();
        await clearButton.click();

        // Verify textarea is empty
        await expect(textarea).toHaveValue('');
      });

      test('form validation prevents submission with empty textarea', async ({ page }) => {
        const logs: string[] = [];
        page.on('console', (msg) => {
          if (msg.type() === 'log') {
            logs.push(msg.text());
          }
        });

        // Leave textarea empty
        const textarea = page.getByPlaceholder('Motivo da Chamada');
        await textarea.clear();

        // Try to submit
        await page.getByRole('button', { name: 'Fechar' }).click();

        // Wait for validation
        await page.waitForTimeout(500);

        // Verify submission failed
        await expect
          .poll(() => logs.some((log) => log.includes('Form validation failed')))
          .toBeTruthy();

        // Should still be on the same page
        await expect(page.getByText('Smart IZI - Limites Transaccionais')).toBeVisible();
      });
    });
  });
});
