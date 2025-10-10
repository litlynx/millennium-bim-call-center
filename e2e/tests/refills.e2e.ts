import { expect, test } from '@playwright/test';
import { formatDisplayDate, navigateToRefills, setupConsoleLogging } from '../helpers/test-helpers';

const loggedConsoleMessages = new Set<string>();

test.describe('Page Refills', () => {
  test.beforeEach(async ({ page }) => {
    setupConsoleLogging(page, loggedConsoleMessages);
    await navigateToRefills(page);
  });

  test('renders with all elements on the page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Recargas/i);

    // Check page header
    await expect(page.getByText('Smart IZI - Recargas')).toBeVisible();

    // Check user information is displayed
    await expect(page.getByText('Jacinto Fazenda')).toBeVisible();
    await expect(page.getByText('PT12345678')).toBeVisible();
    await expect(page.getByText('764682235')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Recargas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Credelec' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pacotes de TV' })).toBeVisible();

    // Check textarea and submit button
    await expect(page.getByPlaceholder('Motivo da Chamada')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeVisible();

    // Check script detail component
    await expect(page.getByText('Script')).toBeVisible();
  });

  test.describe('Left Content Sections', () => {
    test('switches between tabs and shows the correct filters', async ({ page }) => {
      const rechargeFilters = page.getByTestId('recharge-filters-refills');
      const credelectFilters = page.getByTestId('credelec-filters-refills');
      const tvFilters = page.getByTestId('tv-filters-refills');

      // Recargas
      await page.getByRole('button', { name: 'Recargas' }).click();
      await expect(rechargeFilters.getByText('Todas Operadoras')).toBeVisible();
      await expect(rechargeFilters.getByText('Telemóvel do Mobile')).toBeVisible();
      await expect(rechargeFilters.getByText('Número de Destino')).toBeVisible();
      await expect(rechargeFilters.getByText('Data')).toBeVisible();

      // Credelec
      await page.getByRole('button', { name: 'Credelec' }).click();
      await expect(credelectFilters.getByText('Telemóvel do Mobile')).toBeVisible();
      await expect(credelectFilters.getByText('Data')).toBeVisible();

      // Pacotes de TV
      await page.getByRole('button', { name: 'Pacotes de TV' }).click();
      await expect(tvFilters.getByText('Operadora')).toBeVisible();
      await expect(tvFilters.getByText('Telemóvel do Mobile')).toBeVisible();
      await expect(tvFilters.getByText('Data')).toBeVisible();
    });

    test('clicking Encaminhar shows success modal and redirects after delay', async ({ page }) => {
      const textarea = page.getByPlaceholder('Motivo da Chamada');
      await textarea.fill('Test submission without files');

      await page.getByRole('button', { name: 'Encaminhar' }).click();

      await expect(page.getByText('Encaminhado com sucesso')).toBeVisible();

      await page.waitForTimeout(2500);
      await expect(page).toHaveURL(/vision-360/i);
    });

    test('check if all date filters initialize with last 7 days range', async ({ page }) => {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      const expected = `${formatDisplayDate(sevenDaysAgo)} - ${formatDisplayDate(today)}`;

      // Aba Recargas
      await page.getByRole('button', { name: 'Recargas' }).click();
      await expect(page.getByText(expected)).toBeVisible();

      // Aba Credelec
      await page.getByRole('button', { name: 'Credelec' }).click();
      await expect(page.getByText(expected)).toBeVisible();

      // Aba Pacotes de TV
      await page.getByRole('button', { name: 'Pacotes de TV' }).click();
      await expect(page.getByText(expected)).toBeVisible();
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
        await expect(page.getByText('Smart IZI - Recargas')).toBeVisible();
      });
    });
  });
});
