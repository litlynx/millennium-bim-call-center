import { expect, test } from '@playwright/test';

test('Vision360 page displays all cards', async ({ page }) => {
  await page.goto('/vision-360');
  await expect(page.getByTestId('personal-data-card')).toBeVisible();
  await expect(page.getByTestId('estate-and-products-card')).toBeVisible();
  await expect(page.getByTestId('channels-and-services-card')).toBeVisible();
  await expect(page.getByTestId('last-contact-card')).toBeVisible();
  await expect(page.getByTestId('complains-and-incidents-card')).toBeVisible();
});

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

/* test('Vision360 EstateAndProducts displays all content', async ({ page }) => {
  await page.goto('/vision-360');
});
test('Vision360 ChannelsAndServices displays all content', async ({ page }) => {
  await page.goto('/vision-360');
});
test('Vision360 LastContact displays all content', async ({ page }) => {
  await page.goto('/vision-360');
});
test('Vision360 ComplaintsAndIncidents displays all content', async ({ page }) => {
  await page.goto('/vision-360');
});

test('Vision360 cards allows header navigation', async ({ page }) => {
  await page.goto('/vision-360');
  await page.getByTestId('personal-data-card').locator('button').click();
  await expect(page).toHaveURL('/personal-data?details=true');
});
 */
