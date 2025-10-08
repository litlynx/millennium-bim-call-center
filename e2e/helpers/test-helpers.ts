/**
 * E2E Test Helpers
 * Shared utility functions for Playwright e2e tests
 */

import { expect, type Page } from '@playwright/test';

// ============================================================================
// Console and Error Logging
// ============================================================================

/**
 * Set up console message logging for a page
 * Logs errors, warnings, and page errors to help with debugging
 *
 * @param page - Playwright Page instance
 * @param loggedMessages - Set to track already logged messages (prevents duplicates)
 */
export function setupConsoleLogging(page: Page, loggedMessages: Set<string> = new Set()): void {
  page.on('console', (message) => {
    const type = message.type();
    if (type !== 'error' && type !== 'warning') {
      return;
    }

    const key = `${type}|${message.text()}`;
    if (loggedMessages.has(key)) {
      return;
    }
    loggedMessages.add(key);

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
}

/**
 * Capture console log messages for testing
 * Useful for verifying that certain actions log expected messages
 *
 * @param page - Playwright Page instance
 * @returns Array that will be populated with log messages
 */
export function captureConsoleLogs(page: Page): string[] {
  const logs: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'log') {
      logs.push(msg.text());
    }
  });
  return logs;
}

// ============================================================================
// Navigation Helpers
// ============================================================================

/**
 * Navigate to a route using client-side routing (SPA style)
 * This uses pushState instead of full page reload
 *
 * @param page - Playwright Page instance
 * @param path - Path to navigate to (e.g., '/records/digital-channels/mobile-banking/accesses')
 * @param waitForSelector - Optional selector to wait for after navigation
 * @param timeout - Timeout for waiting (default: 20000ms)
 */
export async function navigateToRoute(
  page: Page,
  path: string,
  waitForSelector?: string,
  timeout = 20000
): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.evaluate((routePath) => {
    window.history.pushState({}, '', routePath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);

  await page.waitForLoadState('networkidle');

  if (waitForSelector) {
    await page.waitForSelector(waitForSelector, { timeout });
  }
}

/**
 * Navigate to the Transaction Limits page
 *
 * @param page - Playwright Page instance
 */
export async function navigateToTransactionalLimits(page: Page): Promise<void> {
  await navigateToRoute(
    page,
    '/records/digital-channels/mobile-banking/transactional-limits',
    'text=Smart IZI - Limites Transaccionais',
    20000
  );
}

/**
 * Navigate to the Application Errors page
 *
 * @param page - Playwright Page instance
 */
export async function navigateToApplicationErrors(page: Page): Promise<void> {
  await navigateToRoute(
    page,
    '/records/digital-channels/mobile-banking/application-errors',
    'text=Smart IZI - Erros de Aplicação',
    20000
  );
}

/**
 * Navigate to the Cancels/Blocked page
 *
 * @param page - Playwright Page instance
 */
export async function navigateToCancelsBlocked(page: Page): Promise<void> {
  await navigateToRoute(
    page,
    '/records/digital-channels/mobile-banking/cancels-blocked',
    'text=Smart IZI - Cancelamento/Bloqueio',
    20000
  );
}

/**
 * Navigate to the Accesses page
 *
 * @param page - Playwright Page instance
 */
export async function navigateToAccesses(page: Page): Promise<void> {
  await navigateToRoute(
    page,
    '/records/digital-channels/mobile-banking/accesses',
    '[data-testid="accesses-page-data"]',
    15000
  );
}

// ============================================================================
// Dropdown / Select Helpers
// ============================================================================

/**
 * Get the trigger button for a filter by its label
 * Useful for filters that have a label followed by a button
 *
 * @param page - Playwright Page instance
 * @param label - The label text of the filter
 * @returns Locator for the filter trigger button
 */
export function getFilterTrigger(page: Page, label: string) {
  return page
    .locator(`xpath=//p[normalize-space()="${label}"]/following-sibling::*//button`)
    .first();
}

/**
 * Select an option from a dropdown filter
 * Opens the dropdown, selects the option, and verifies it's selected
 *
 * @param page - Playwright Page instance
 * @param label - The label of the filter/dropdown
 * @param optionText - The text of the option to select
 */
export async function selectDropdownOption(
  page: Page,
  label: string,
  optionText: string
): Promise<void> {
  const trigger = getFilterTrigger(page, label);
  await trigger.click();

  const dropdownOption = page.locator('[data-state="open"] li', { hasText: optionText }).first();
  await expect(dropdownOption).toBeVisible();
  await dropdownOption.click();

  await expect(trigger).toHaveText(new RegExp(optionText.replace(/\s+/g, '\\s*'), 'i'));
}

// ============================================================================
// Date Picker Helpers
// ============================================================================

/**
 * Mapping of month names (PT/EN) to month index (0-11)
 */
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

/**
 * Parse calendar caption text to Date
 * Handles both Portuguese and English month names
 *
 * @param caption - Calendar caption text (e.g., "Janeiro 2025")
 * @returns Date object representing the first day of that month
 */
export function parseCalendarCaption(caption: string): Date {
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
}

/**
 * Get the currently visible month in the calendar
 *
 * @param page - Playwright Page instance
 * @returns Date representing the first day of the visible month
 */
export async function getVisibleMonthStart(page: Page): Promise<Date> {
  const caption = await page
    .locator('[data-slot="calendar"] .rdp-caption_label')
    .first()
    .innerText();
  return parseCalendarCaption(caption);
}

/**
 * Calculate the difference in months between two dates
 *
 * @param from - Start date
 * @param to - End date
 * @returns Number of months difference (positive if to > from)
 */
export function monthDiff(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/**
 * Navigate the calendar to a specific month
 * Clicks next/previous month buttons as needed
 *
 * @param page - Playwright Page instance
 * @param target - Target month to navigate to
 */
export async function navigateToMonth(page: Page, target: Date): Promise<void> {
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
}

const dataDayFormatter = new Intl.DateTimeFormat(undefined);
const displayFormatter = new Intl.DateTimeFormat('pt-BR');

/**
 * Format a date for the data-day attribute value
 *
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDataDayValue(date: Date): string {
  return dataDayFormatter.format(date);
}

/**
 * Format a date for display (Portuguese format)
 *
 * @param date - Date to format
 * @returns Formatted date string (e.g., "02-06-2025")
 */
export function formatDisplayDate(date: Date): string {
  return displayFormatter.format(date).replace(/\//g, '-');
}

/**
 * Select a specific day in the calendar
 *
 * @param page - Playwright Page instance
 * @param date - Date to select
 */
export async function selectCalendarDay(page: Page, date: Date): Promise<void> {
  const dayLocator = page.locator(`[data-day="${formatDataDayValue(date)}"]`).first();
  await expect(dayLocator).toBeVisible();
  await dayLocator.click();
}

/**
 * Select a date range in the calendar
 * Opens the date picker, selects start and end dates, and verifies the selection
 *
 * @param page - Playwright Page instance
 * @param start - Start date
 * @param end - End date
 * @param filterLabel - Label of the date filter (default: 'Data')
 */
export async function selectDateRange(
  page: Page,
  start: Date,
  end: Date,
  filterLabel = 'Data'
): Promise<void> {
  const trigger = getFilterTrigger(page, filterLabel);
  await trigger.click();

  await navigateToMonth(page, start);
  await selectCalendarDay(page, start);

  await navigateToMonth(page, end);
  await selectCalendarDay(page, end);

  await page.keyboard.press('Escape');

  const startDisplay = formatDisplayDate(start);
  const endDisplay = formatDisplayDate(end);
  await expect(trigger).toHaveText(`${startDisplay} - ${endDisplay}`);
}

// ============================================================================
// Table Helpers
// ============================================================================

/**
 * Get all transaction rows from a table
 *
 * @param page - Playwright Page instance
 * @returns Locator for table body rows
 */
export function getTransactionRows(page: Page) {
  return page.locator('table tbody tr');
}

/**
 * Get transaction rows from a specific panel/tab
 *
 * @param page - Playwright Page instance
 * @param panelName - Name of the panel/tab
 * @returns Locator for table body rows within that panel
 */
export function getTransactionRowsFromPanel(page: Page, panelName: string) {
  return page.getByRole('tabpanel', { name: panelName }).locator('table tbody tr');
}

// ============================================================================
// Form Helpers
// ============================================================================

/**
 * Fill a textarea and verify character count
 *
 * @param page - Playwright Page instance
 * @param placeholder - Placeholder text of the textarea
 * @param text - Text to fill in
 * @param maxLength - Maximum length to verify against (optional)
 */
export async function fillTextarea(
  page: Page,
  placeholder: string,
  text: string,
  maxLength?: number
): Promise<void> {
  const textarea = page.getByPlaceholder(placeholder);
  await textarea.fill(text);
  await expect(textarea).toHaveValue(text);

  if (maxLength !== undefined) {
    const charCount = page.locator(`text=/${text.length}\\/${maxLength}/`);
    await expect(charCount).toBeVisible();
  }
}

/**
 * Clear a textarea using the clear button
 *
 * @param page - Playwright Page instance
 * @param placeholder - Placeholder text of the textarea
 */
export async function clearTextarea(page: Page, placeholder: string): Promise<void> {
  const textarea = page.getByPlaceholder(placeholder);
  const clearButton = page.locator('textarea+span svg').first();
  await clearButton.click();
  await expect(textarea).toHaveValue('');
}

// ============================================================================
// File Upload Helpers
// ============================================================================

/**
 * Upload a file to a file input
 *
 * @param page - Playwright Page instance
 * @param fileName - Name of the file
 * @param mimeType - MIME type of the file
 * @param content - File content as string or buffer
 */
export async function uploadFile(
  page: Page,
  fileName: string,
  mimeType: string,
  content: string | Buffer
): Promise<void> {
  const fileInput = page.locator('input[type="file"]');
  const buffer = typeof content === 'string' ? Buffer.from(content) : content;

  await fileInput.setInputFiles([
    {
      name: fileName,
      mimeType,
      buffer
    }
  ]);

  // Wait for file to appear in the list
  await expect(page.getByText(fileName)).toBeVisible({ timeout: 5000 });
}

/**
 * Wait for file upload to complete (progress bar reaches 100%)
 *
 * @param page - Playwright Page instance
 * @param timeout - Maximum time to wait (default: 5000ms)
 */
export async function waitForUploadComplete(page: Page, timeout = 5000): Promise<void> {
  const progressBar = page.locator('[role="progressbar"]');
  await expect(progressBar).toHaveAttribute('aria-valuenow', '100', { timeout });
}

/**
 * Remove an uploaded file
 *
 * @param page - Playwright Page instance
 * @param fileName - Name of the file to remove
 */
export async function removeUploadedFile(page: Page, fileName: string): Promise<void> {
  const removeButton = page.locator(`button[aria-label*="Remover ${fileName}"]`).first();
  await removeButton.click();
  await expect(page.getByText(fileName)).not.toBeVisible();
}

// ============================================================================
// Wait and Polling Helpers
// ============================================================================

/**
 * Poll for a condition with a custom checker function
 * Useful for waiting for async operations to complete
 *
 * @param checkFn - Function that returns true when condition is met
 * @param timeout - Maximum time to wait (default: 5000ms)
 * @param interval - Check interval (default: 100ms)
 */
export async function waitFor(
  checkFn: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await checkFn()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Wait for a console log message to appear
 *
 * @param logs - Array of captured logs (from captureConsoleLogs)
 * @param message - Message text or regex to match
 * @param timeout - Maximum time to wait (default: 5000ms)
 */
export async function waitForConsoleLog(
  logs: string[],
  message: string | RegExp,
  timeout = 5000
): Promise<void> {
  const matcher =
    typeof message === 'string'
      ? (log: string) => log.includes(message)
      : (log: string) => message.test(log);

  await waitFor(() => logs.some(matcher), timeout);
}
