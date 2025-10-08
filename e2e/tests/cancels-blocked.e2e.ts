import { expect, type Page, test } from '@playwright/test';
import {
  navigateToCancelsBlocked,
  selectDateRange,
  selectDropdownOption,
  setupConsoleLogging
} from '../helpers/test-helpers';

const loggedConsoleMessages = new Set<string>();

const getTransactionsPanel = (page: Page) =>
  page.getByRole('tabpanel', { name: 'Histórico de Transacções' });

const getTransactionRows = (page: Page) => getTransactionsPanel(page).locator('table tbody tr');

test.describe('Cancels Blocked Page', () => {
  test.beforeEach(async ({ page }) => {
    setupConsoleLogging(page, loggedConsoleMessages);
    await navigateToCancelsBlocked(page);
  });

  test('renders the core sections with initial data', async ({ page }) => {
    await expect(page).toHaveTitle(/Cancelamento\/Bloqueio/i);
    await expect(page.getByText('Smart IZI - Cancelamento/Bloqueio')).toBeVisible();

    const primaryRow = page.getByRole('row', { name: /TMcel/ });
    await expect(primaryRow).toBeVisible();
    await expect(primaryRow).toContainText('Principal');
    await expect(primaryRow).toContainText('Activo');

    await expect(page.getByText('Histórico de Transacções')).toBeVisible();
    await expect(page.getByPlaceholder('Motivo da Chamada')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeVisible();
  });

  test('allows blocking the principal contract', async ({ page }) => {
    const primaryRow = page.getByRole('row', { name: /TMcel/ });
    const blockButton = primaryRow.getByRole('button').first();

    await blockButton.click();

    const confirmModal = page.getByRole('dialog', { name: 'Bloqueio Mobile Banking' });
    await expect(confirmModal).toBeVisible();
    await expect(confirmModal).toContainText('Pretende mesmo bloquear o contracto mobile?');

    await confirmModal.getByRole('button', { name: 'Confirmar' }).click();

    const successMessage = page.getByText('Contracto bloqueado com sucesso');
    await expect(successMessage).toBeVisible();

    await expect(primaryRow).toContainText('Inativo');

    // Success modal auto closes after 2 seconds; ensure it eventually disappears
    await page.waitForTimeout(2200);
    await expect(successMessage).not.toBeVisible({ timeout: 5000 });
  });

  test('allows cancelling a contract after fraud confirmation', async ({ page }) => {
    const primaryRow = page.getByRole('row', { name: /TMcel/ });
    const actionButtons = primaryRow.getByRole('button');

    await actionButtons.nth(1).click();

    const confirmModal = page.getByRole('dialog', { name: 'Cancelamento Mobile Banking' });
    await expect(confirmModal).toBeVisible();
    await expect(confirmModal).toContainText('Pretende mesmo eliminar o contracto mobile?');

    await confirmModal.getByRole('button', { name: 'Confirmar' }).click();

    await expect(page.getByText('Pretende cancelar por fraude?')).toBeVisible();
    await page.getByRole('button', { name: 'Sim' }).click();

    const successMessage = page.getByText('Contracto cancelado com sucesso');
    await expect(successMessage).toBeVisible();

    await expect(page.getByRole('row', { name: /TMcel/ })).toHaveCount(0);

    await page.waitForTimeout(2200);
    await expect(successMessage).not.toBeVisible({ timeout: 5000 });
  });

  test('keeps the contract active when cancelling the block action', async ({ page }) => {
    const primaryRow = page.getByRole('row', { name: /TMcel/ });
    await primaryRow.getByRole('button').first().click();

    const confirmModal = page.getByRole('dialog', { name: 'Bloqueio Mobile Banking' });
    await expect(confirmModal).toBeVisible();

    await confirmModal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(confirmModal).not.toBeVisible();

    await expect(primaryRow).toContainText('Activo');
    await expect(page.locator('text=Contracto bloqueado com sucesso')).toHaveCount(0);
  });

  test('filters transactions by selecting a different contact', async ({ page }) => {
    const rows = getTransactionRows(page);
    // Wait for initial data to load
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const initialCount = await rows.count();
    expect(initialCount).toBeGreaterThan(0);

    await selectDropdownOption(page, 'Contacto', '845 816 811');

    // After filtering, should have fewer or different rows
    await page.waitForTimeout(500);
    await expect(rows.first()).toContainText('Transferência BIM');
  });

  test('applies the operation type filter per contact', async ({ page }) => {
    const rows = getTransactionRows(page);
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    await selectDropdownOption(page, 'Tipo de Operação', 'Transferência BIM');
    await page.waitForTimeout(500);

    await selectDropdownOption(page, 'Contacto', '845 816 811');
    await page.waitForTimeout(500);
    await expect(rows.first()).toContainText('Transferência BIM');

    await selectDropdownOption(page, 'Tipo de Operação', 'Todas');
    await page.waitForTimeout(500);
    const finalCount = await rows.count();
    expect(finalCount).toBeGreaterThan(0);
  });

  test('filters transactions by date range', async ({ page }) => {
    const rows = getTransactionRows(page);
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const june2 = new Date(2025, 5, 2);
    const june30 = new Date(2025, 5, 30);
    await selectDateRange(page, june2, june30);

    await page.waitForTimeout(500);
    await expect(rows.first()).toContainText('02-06-2025');

    const august2 = new Date(2025, 7, 2);
    await selectDateRange(page, june2, august2);

    await page.waitForTimeout(500);
    const finalCount = await rows.count();
    expect(finalCount).toBeGreaterThanOrEqual(1);
  });

  test('shows transaction details in popover', async ({ page }) => {
    const rows = getTransactionRows(page);
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const firstRow = rows.first();
    const detailsTrigger = firstRow
      .locator('td')
      .last()
      .locator('span[data-state]')
      .filter({ has: page.locator('svg') })
      .first();
    await expect(detailsTrigger).toBeVisible();
    await detailsTrigger.click();

    const popover = page.locator('[role="dialog"]', { hasText: 'Detalhes' }).first();
    await expect(popover).toBeVisible();
    // Check for content that exists in the popover (data may vary)
    await expect(popover).toContainText('Conta Destino:');
    await expect(popover).toContainText('Conta Origem:');
    await expect(popover).toContainText('Erro:');

    const closeButton = popover.getByRole('button', { name: 'Fechar' });
    await closeButton.click();

    await expect(popover).not.toBeVisible();
  });
});
