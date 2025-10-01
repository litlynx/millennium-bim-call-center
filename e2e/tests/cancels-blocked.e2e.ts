import { expect, type Page, test } from '@playwright/test';

const loggedConsoleMessages = new Set<string>();

const navigateToCancelsBlocked = async (page: Page) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    window.history.pushState({}, '', '/records/digital-channels/mobile-banking/cancels-blocked');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await page.waitForLoadState('networkidle');

  await page.waitForSelector('text=Smart IZI - Cancelamento/Bloqueio', { timeout: 20000 });
};

const getTransactionsPanel = (page: Page) =>
  page.getByRole('tabpanel', { name: 'Histórico de Transacções' });

const getTransactionRows = (page: Page) => getTransactionsPanel(page).locator('table tbody tr');

const getFilterTrigger = (page: Page, label: string) =>
  page.locator(`xpath=//p[normalize-space()="${label}"]/following-sibling::*//button`).first();

const selectDropdownOption = async (page: Page, label: string, optionText: string) => {
  const trigger = getFilterTrigger(page, label);
  await trigger.click();

  const dropdownOption = page.locator('[data-state="open"] li', { hasText: optionText }).first();
  await expect(dropdownOption).toBeVisible();
  await dropdownOption.click();

  await expect(trigger).toHaveText(new RegExp(optionText.replace(/\s+/g, '\\s*'), 'i'));
};

const MONTH_NAME_TO_INDEX: Record<string, number> = {
  january: 0,
  jan: 0,
  janeiro: 0,
  february: 1,
  feb: 1,
  fevereiro: 1,
  march: 2,
  mar: 2,
  março: 2,
  marco: 2,
  abril: 3,
  april: 3,
  apr: 3,
  may: 4,
  maio: 4,
  june: 5,
  jun: 5,
  junho: 5,
  july: 6,
  jul: 6,
  julho: 6,
  august: 7,
  aug: 7,
  agosto: 7,
  september: 8,
  sep: 8,
  sept: 8,
  setembro: 8,
  outubro: 9,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  novembro: 10,
  december: 11,
  dec: 11,
  dezembro: 11
};

const parseCalendarCaption = (caption: string): Date => {
  const sanitized = caption.trim().replace(/\s+/g, ' ').toLowerCase().replace(/[.]/g, '');
  const tokens = sanitized.split(' ').filter((token) => token.length > 0 && token !== 'de');

  if (tokens.length >= 2) {
    const [monthToken, yearToken] = tokens;
    const monthIndex = MONTH_NAME_TO_INDEX[monthToken];
    const year = Number(yearToken);

    if (monthIndex !== undefined && !Number.isNaN(year)) {
      return new Date(year, monthIndex, 1);
    }
  }

  const fallback = Date.parse(`${caption} 1`);
  if (!Number.isNaN(fallback)) {
    return new Date(fallback);
  }

  throw new Error(`Unable to parse calendar caption: ${caption}`);
};

const getVisibleMonthStart = async (page: Page) => {
  const caption = await page
    .locator('[data-slot="calendar"] .rdp-caption_label')
    .first()
    .innerText();
  return parseCalendarCaption(caption);
};

const monthDiff = (from: Date, to: Date) =>
  (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

const navigateToMonth = async (page: Page, target: Date) => {
  const current = await getVisibleMonthStart(page);
  const diff = monthDiff(current, target);
  if (diff === 0) {
    return;
  }

  const button = diff > 0 ? /next month/i : /previous month/i;
  const navButton = page.getByRole('button', { name: button });
  for (let i = 0; i < Math.abs(diff); i++) {
    await navButton.click();
  }
};

const dataDayFormatter = new Intl.DateTimeFormat(undefined);
const displayFormatter = new Intl.DateTimeFormat('pt-BR');

const formatDataDayValue = (date: Date) => dataDayFormatter.format(date);

const selectCalendarDay = async (page: Page, date: Date) => {
  const dayLocator = page.locator(`[data-day="${formatDataDayValue(date)}"]`).first();
  await expect(dayLocator).toBeVisible();
  await dayLocator.click();
};

const selectDateRange = async (page: Page, start: Date, end: Date) => {
  const trigger = getFilterTrigger(page, 'Data');
  await trigger.click();

  await navigateToMonth(page, start);
  await selectCalendarDay(page, start);

  await navigateToMonth(page, end);
  await selectCalendarDay(page, end);

  await page.keyboard.press('Escape');

  const startDisplay = displayFormatter.format(start).replace(/\//g, '-');
  const endDisplay = displayFormatter.format(end).replace(/\//g, '-');
  await expect(trigger).toHaveText(`${startDisplay} - ${endDisplay}`);
};

test.describe('Cancels Blocked Page', () => {
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
    await expect(rows).toHaveCount(2);

    await selectDropdownOption(page, 'Contacto', '845 816 811');

    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Transferência BIM');
  });

  test('applies the operation type filter per contact', async ({ page }) => {
    const rows = getTransactionRows(page);

    await selectDropdownOption(page, 'Tipo de Operação', 'Transferência BIM');
    await expect(rows).toHaveCount(0);

    await selectDropdownOption(page, 'Contacto', '845 816 811');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Transferência BIM');

    await selectDropdownOption(page, 'Tipo de Operação', 'Todas');
    await expect(rows).toHaveCount(1);
  });

  test('filters transactions by date range', async ({ page }) => {
    const rows = getTransactionRows(page);
    await expect(rows).toHaveCount(2);

    const june2 = new Date(2025, 5, 2);
    const june30 = new Date(2025, 5, 30);
    await selectDateRange(page, june2, june30);

    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('02-06-2025');

    const august2 = new Date(2025, 7, 2);
    await selectDateRange(page, june2, august2);

    await expect(rows).toHaveCount(2);
  });

  test('shows transaction details in popover', async ({ page }) => {
    const rows = getTransactionRows(page);
    await expect(rows).toHaveCount(2);

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
    await expect(popover).toContainText('Conta Destino: 1226144894');
    await expect(popover).toContainText('Conta Origem: 764682235');
    await expect(popover).toContainText(
      'Erro: O sistema levou muito tempo a processar o seu pedido. Por favor tente mais tarde. Gratos pela preferência'
    );

    const closeButton = popover.getByRole('button', { name: 'Fechar' });
    await closeButton.click();

    await expect(popover).not.toBeVisible();
  });
});
