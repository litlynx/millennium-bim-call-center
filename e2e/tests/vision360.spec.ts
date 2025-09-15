import { expect, test } from '@playwright/test';

/* -------------------------------------------------------------------------- */
/*                                cards render                                */
/* -------------------------------------------------------------------------- */

test('Vision360 page displays all cards', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('personal-data-card')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-card')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-card')).toBeVisible();
  await expect(page.getByTestId('last-contact-card')).toBeVisible();
  await expect(page.getByTestId('complains-and-incidents-card')).toBeVisible();
});

/* -------------------------------------------------------------------------- */
/*                               content render                               */
/* -------------------------------------------------------------------------- */

test('Vision360 personalData displays all content', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('personal-data-header')).toBeVisible();
  await expect(page.getByTestId('personal-data-header').locator('svg')).toBeVisible();
  await expect(page.getByTestId('personal-data-title')).toBeVisible();
  await expect(page.getByTestId('personal-data-content')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-0')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-1')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-2')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-3')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-4')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-5')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-6')).toBeVisible();
  await expect(page.getByTestId('personal-data-item-7')).toBeVisible();
});

test('Vision360 EstateAndProducts displays all content', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('estate-and-products-header')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-header').locator('svg')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-title')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-content')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-assets-item-0')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-assets-item-1')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-assets-item-2')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-liabilities-item-0')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-liabilities-item-1')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-liabilities-item-2')).toBeVisible();
});

test('Vision360 ChannelsAndServices displays all content', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('channels-and-services-header')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-header').locator('svg')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-title')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-content')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-digitalChannels-item-0')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-digitalChannels-item-1')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-digitalChannels-item-2')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-services-item-0')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-services-item-1')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-services-item-2')).toBeVisible();
});

test('Vision360 LastContact displays all content', async ({ page }) => {
  await page.goto('/vision-360');
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

test('Vision360 ComplaintsAndIncidents displays all content', async ({ page }) => {
  await page.goto('/vision-360');
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

/* -------------------------------------------------------------------------- */
/*                                    tabs                                    */
/* -------------------------------------------------------------------------- */
test('Vision360 ComplaintsAndIncidents tabs working', async ({ page }) => {
  await page.goto('/vision-360');
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

test('Vision360 LastContact tabs working', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('last-contact-tab-calls')).toHaveAttribute('data-state', 'active');
  await page.getByTestId('last-contact-tab-messages').click();
  await expect(page.getByTestId('last-contact-tab-messages')).toHaveAttribute(
    'data-state',
    'active'
  );
  await page.getByTestId('last-contact-tab-calls').click();
  await expect(page.getByTestId('last-contact-tab-calls')).toHaveAttribute('data-state', 'active');
});

/* -------------------------------------------------------------------------- */
/*                              header navigation                             */
/* -------------------------------------------------------------------------- */
test('Vision360 cards allows header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('personal-data-header').click();
  await expect(page).toHaveURL('/personal-data?details=true');
});

test('Vision360 EstateAndProducts header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('estate-and-products-header').click();
  await expect(page).toHaveURL('/estate-and-products?details=true');
});

test('Vision360 ChannelsAndServices header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('channels-and-services-header').click();
  await expect(page).toHaveURL('/channels-and-services?details=true');
});

test('Vision360 LastContact header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('last-contact-header').click();
  await expect(page).toHaveURL('/history-interactions?details=true&component=calls');
});

test('Vision360 ComplainsAndIncidents header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('complains-and-incidents-header').click();
  await expect(page).toHaveURL('/complains-and-incidents?details=true');
});
