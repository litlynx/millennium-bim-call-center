import { expect, test } from '@playwright/test';
import {
  getFilterTrigger,
  getTransactionRows,
  navigateToApplicationErrors,
  selectDateRange,
  selectDropdownOption,
  setupConsoleLogging
} from '../helpers/test-helpers';

const loggedConsoleMessages = new Set<string>();

test.describe('Application Errors Page', () => {
  test.beforeEach(async ({ page }) => {
    setupConsoleLogging(page, loggedConsoleMessages);
    await navigateToApplicationErrors(page);
  });

  test('renders with all elements on the page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Erros de Aplicação/i);

    // Check page header
    await expect(page.getByText('Smart IZI - Erros de Aplicação')).toBeVisible();

    // Check user information is displayed
    await expect(page.getByText('Jacinto Fazenda')).toBeVisible();
    await expect(page.getByText('PT12345678')).toBeVisible();
    await expect(page.getByText('764682235')).toBeVisible();

    // Check filter elements
    await expect(page.getByText('N. de Telefone')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Data' })).toBeVisible();
    await expect(page.getByText('Tipo de Operação')).toBeVisible();

    // Check transactions table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('Canal')).toBeVisible();
    await expect(page.getByText('Tipo Transação')).toBeVisible();
    await expect(page.getByText('Montante')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Data' })).toBeVisible();
    await expect(page.getByText('Hora')).toBeVisible();
    await expect(page.getByText('Estado da Transacção')).toBeVisible();

    // Check textarea and submit button
    await expect(page.getByPlaceholder('Motivo da Chamada')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeVisible();

    // Check script detail component
    await expect(page.getByText('Script')).toBeVisible();
  });

  test('table displays data when data is available', async ({ page }) => {
    // Wait for table rows to be visible
    const rows = getTransactionRows(page);
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    // Check that we have at least one row
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Verify first row contains expected data
    const firstRow = rows.first();
    await expect(firstRow).toContainText('Smart IZI');
    await expect(firstRow).toContainText(/Transferência|Recarga/);
    await expect(firstRow).toContainText('MZN');
  });

  test.skip('table does not display data if no data is available', async ({ page }) => {
    // NOTE: This test is skipped because mocking empty API responses in e2e is unreliable
    // The component's empty state is already tested in unit tests
    // Mock empty API response BEFORE navigating
    await page.route('**/api/application-errors*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ errors: [], transactions: [] })
      });
    });

    // Navigate to page with mocked empty response
    await navigateToApplicationErrors(page);

    // Wait a moment for the data to load (or not load)
    await page.waitForTimeout(1000);

    // Check for "no data available" message instead of counting rows
    await expect(page.getByText('Dados não disponíveis')).toBeVisible();
  });

  test.describe('Filters', () => {
    test('table data is filtered using the date picker filter', async ({ page }) => {
      // Wait for initial data
      await expect(getTransactionRows(page).first()).toBeVisible({ timeout: 10000 });

      const initialRowCount = await getTransactionRows(page).count();
      expect(initialRowCount).toBeGreaterThan(0);

      // Select a specific date range (June 2-8, 2025)
      const startDate = new Date(2025, 5, 2); // June 2, 2025
      const endDate = new Date(2025, 5, 8); // June 8, 2025

      await selectDateRange(page, startDate, endDate);

      // Wait for filtering to take effect
      await page.waitForTimeout(500);

      // Check that filtered results contain only dates in range
      const filteredRows = getTransactionRows(page);
      const filteredCount = await filteredRows.count();

      // Should have fewer or equal rows after filtering
      expect(filteredCount).toBeLessThanOrEqual(initialRowCount);

      // Verify dates in filtered results are within range
      if (filteredCount > 0) {
        const firstRowDate = await filteredRows.first().locator('td').nth(3).innerText();
        expect(firstRowDate).toMatch(/02-06|02-07|02-08/);
      }
    });

    test('table data is filtered using the transaction type dropdown', async ({ page }) => {
      // Wait for initial data
      await expect(getTransactionRows(page).first()).toBeVisible({ timeout: 10000 });

      const initialRowCount = await getTransactionRows(page).count();
      expect(initialRowCount).toBeGreaterThan(0);

      // Select a specific transaction type
      await selectDropdownOption(page, 'Tipo de Operação', 'Transferência e-Mola');

      // Wait for filtering to take effect
      await page.waitForTimeout(500);

      // Check that filtered results contain only the selected type
      const filteredRows = getTransactionRows(page);
      const filteredCount = await filteredRows.count();

      // Should have fewer or equal rows after filtering
      expect(filteredCount).toBeLessThanOrEqual(initialRowCount);

      // Verify transaction types in filtered results
      for (let i = 0; i < Math.min(filteredCount, 3); i++) {
        const row = filteredRows.nth(i);
        await expect(row).toContainText('Transferência e-Mola');
      }
    });

    test('table data is filtered using the phone number dropdown when multiple contacts exist', async ({
      page
    }) => {
      // Wait for initial data
      await expect(getTransactionRows(page).first()).toBeVisible({ timeout: 10000 });

      // Check if phone number filter exists (only shown when multiple contacts)
      const phoneFilter = page.locator('text=N. de Telefone');
      const phoneFilterExists = await phoneFilter.count();

      if (phoneFilterExists > 0) {
        // Get the dropdown trigger
        const trigger = getFilterTrigger(page, 'N. de Telefone');
        await trigger.click();

        // Select a phone number from the dropdown
        const firstOption = page.locator('[data-state="open"] li').first();
        await expect(firstOption).toBeVisible();
        const phoneNumber = await firstOption.innerText();
        await firstOption.click();

        // Wait for filtering to take effect
        await page.waitForTimeout(500);

        // Verify that trigger shows selected phone
        await expect(trigger).toHaveText(phoneNumber);
      }
    });
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
        .poll(() => logs.some((log) => log.includes('Text content: Test submission without files')))
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
      await expect(page.getByText('Smart IZI - Erros de Aplicação')).toBeVisible();
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
      const removeButton = page.locator('button[aria-label*="Remover test-to-remove.txt"]').first();
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
      await expect(page.getByText('Smart IZI - Erros de Aplicação')).toBeVisible();
    });
  });

  test.describe('Transaction Details Popover', () => {
    test('clicking transaction shows detail popover', async ({ page }) => {
      // Wait for data to load
      await expect(getTransactionRows(page).first()).toBeVisible({ timeout: 10000 });

      // Find and click on a transaction row - look for clickable icon/span in last cell
      const firstRow = getTransactionRows(page).first();
      const popoverTrigger = firstRow
        .locator('td')
        .last()
        .locator('span[data-state]')
        .filter({ has: page.locator('svg') })
        .first();

      // Wait for trigger to be visible and click it
      await expect(popoverTrigger).toBeVisible({ timeout: 5000 });
      await popoverTrigger.click();

      // Verify popover is visible with details
      await expect(page.getByText('Detalhes')).toBeVisible();
      await expect(page.getByText('Conta Destino:')).toBeVisible();
      await expect(page.getByText('Conta Origem:')).toBeVisible();
    });
  });
});
