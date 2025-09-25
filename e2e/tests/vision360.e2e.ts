import { expect, type Page, test } from '@playwright/test';

const loggedConsoleMessages = new Set<string>();

const navigateToVision360 = async (page: Page) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    window.history.pushState({}, '', '/vision-360');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="personal-data-card"]', { timeout: 15000 });
};

test.describe('Page Vision360', () => {
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

  test('page displays all cards', async ({ page }) => {
    await navigateToVision360(page);
    await expect(page.getByTestId('personal-data-card')).toBeVisible();
    await expect(page.getByTestId('estate-and-products-card')).toBeVisible();
    await expect(page.getByTestId('channels-and-services-card')).toBeVisible();
    await expect(page.getByTestId('last-contact-card')).toBeVisible();
    await expect(page.getByTestId('complains-and-incidents-card')).toBeVisible();
  });
  /* -------------------------------------------------------------------------- */
  test.describe('Content Sections', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToVision360(page);
    });
    test('personalData displays all content', async ({ page }) => {
      await expect(page.getByTestId('personal-data-header')).toBeVisible();
      await expect(page.getByTestId('personal-data-header').locator('svg')).toBeVisible();
      await expect(page.getByTestId('personal-data-title')).toBeVisible();
      await expect(page.getByTestId('personal-data-content')).toBeVisible();
      await expect(page.locator('[data-testid^="personal-data-item-"]')).toHaveCount(9);
    });

    test('EstateAndProducts displays all content', async ({ page }) => {
      await expect(page.getByTestId('estate-and-products-header')).toBeVisible();
      await expect(page.getByTestId('estate-and-products-header').locator('svg')).toBeVisible();
      await expect(page.getByTestId('estate-and-products-title')).toBeVisible();
      await expect(page.getByTestId('estate-and-products-content')).toBeVisible();
      await expect(page.locator('[data-testid^="estate-and-products-assets-item-"]')).toHaveCount(
        3
      );
      await expect(
        page.locator('[data-testid^="estate-and-products-liabilities-item-"]')
      ).toHaveCount(3);
      await expect(page.getByTestId('estate-and-products-liabilities-item-2')).toBeVisible();
    });

    test('ChannelsAndServices displays all content', async ({ page }) => {
      await expect(page.getByTestId('channels-and-services-header')).toBeVisible();
      await expect(page.getByTestId('channels-and-services-header').locator('svg')).toBeVisible();
      await expect(page.getByTestId('channels-and-services-title')).toBeVisible();
      await expect(page.getByTestId('channels-and-services-content')).toBeVisible();
      await expect(
        page.locator('[data-testid^="channels-and-services-digitalChannels-item-"]')
      ).toHaveCount(3);
      await expect(
        page.locator('[data-testid^="channels-and-services-services-item-"]')
      ).toHaveCount(3);
      await expect(page.getByTestId('channels-and-services-services-item-2')).toBeVisible();
    });

    test('LastContact displays all content', async ({ page }) => {
      await expect(page.getByTestId('last-contact-header')).toBeVisible();
      await expect(page.getByTestId('last-contact-header').locator('svg')).toBeVisible();
      await expect(page.getByTestId('last-contact-title')).toBeVisible();
      await expect(page.getByTestId('last-contact-content')).toBeVisible();
      await expect(page.getByTestId('last-contact-tab-calls')).toBeVisible();
      await expect(page.getByTestId('last-contact-tab-messages')).toBeVisible();
      const hasCallItems = await page
        .getByTestId('last-contact-call-item-0')
        .isVisible()
        .catch(() => false);
      if (hasCallItems) {
        await expect(page.getByTestId('last-contact-call-item-0')).toBeVisible();
      }
      const hasMessageItems = await page
        .getByTestId('last-contact-message-item-0')
        .isVisible()
        .catch(() => false);
      if (hasMessageItems) {
        await expect(page.getByTestId('last-contact-message-item-0')).toBeVisible();
      }
    });

    test('ComplaintsAndIncidents displays all content', async ({ page }) => {
      await expect(page.getByTestId('complains-and-incidents-header')).toBeVisible();
      await expect(page.getByTestId('complains-and-incidents-header').locator('svg')).toBeVisible();
      await expect(page.getByTestId('complains-and-incidents-title')).toBeVisible();
      await expect(page.getByTestId('complains-and-incidents-content')).toBeVisible();
      await expect(page.getByTestId('complains-and-incidents-tab-claims')).toBeVisible();
      await expect(page.getByTestId('complains-and-incidents-tab-incidents')).toBeVisible();
      const hasCallItems = await page
        .getByTestId('complains-and-incidents-claims-item-0')
        .isVisible()
        .catch(() => false);
      if (hasCallItems) {
        await expect(page.getByTestId('complains-and-incidents-claims-item-0')).toBeVisible();
      }
      const hasMessageItems = await page
        .getByTestId('complains-and-incidents-incidents-item-0')
        .isVisible()
        .catch(() => false);
      if (hasMessageItems) {
        await expect(page.getByTestId('complains-and-incidents-incidents-item-0')).toBeVisible();
      }
    });
  });
  /* -------------------------------------------------------------------------- */
  test.describe('Card tabs', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToVision360(page);
    });

    test('ComplaintsAndIncidents tabs working', async ({ page }) => {
      await expect(page.getByTestId('complains-and-incidents-tab-claims')).toHaveAttribute(
        'data-state',
        'active'
      );
      await page.getByTestId('complains-and-incidents-tab-incidents').click();
      await expect(page.getByTestId('complains-and-incidents-tab-incidents')).toHaveAttribute(
        'data-state',
        'active'
      );
      await page.getByTestId('complains-and-incidents-tab-claims').click();
      await expect(page.getByTestId('complains-and-incidents-tab-claims')).toHaveAttribute(
        'data-state',
        'active'
      );
    });

    test('LastContact tabs working', async ({ page }) => {
      await expect(page.getByTestId('last-contact-tab-calls')).toHaveAttribute(
        'data-state',
        'active'
      );
      await page.getByTestId('last-contact-tab-messages').click();
      await expect(page.getByTestId('last-contact-tab-messages')).toHaveAttribute(
        'data-state',
        'active'
      );
      await page.getByTestId('last-contact-tab-calls').click();
      await expect(page.getByTestId('last-contact-tab-calls')).toHaveAttribute(
        'data-state',
        'active'
      );
    });
  });

  /* -------------------------------------------------------------------------- */
  test.describe('Header Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToVision360(page);
    });

    test('cards allows header navigation', async ({ page }) => {
      await page.getByTestId('personal-data-header').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/personal-data?details=true');
    });

    test('EstateAndProducts header navigation', async ({ page }) => {
      await page.getByTestId('estate-and-products-header').locator('button').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/estate-and-products?details=true');
    });

    test('ChannelsAndServices header navigation', async ({ page }) => {
      await page.getByTestId('channels-and-services-header').locator('button').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/channels-and-services?details=true');
    });

    test('LastContact header navigation', async ({ page }) => {
      await page.getByTestId('last-contact-header').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/history-interactions?details=true&component=calls');
    });

    test('ComplainsAndIncidents header navigation', async ({ page }) => {
      await page.getByTestId('complains-and-incidents-header').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/complains-and-incidents?details=true');
    });
  });

  /* -------------------------------------------------------------------------- */
});
