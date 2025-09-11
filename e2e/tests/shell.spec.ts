import { test } from '@playwright/test';

const teste1 = 'teste';

test('test', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(teste1);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await page.getByRole('link', { name: 'Active' }).click();
  await page.getByRole('link', { name: 'Completed' }).click();
  await page.getByRole('link', { name: 'Active' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('teste 2');
  await page.getByRole('link', { name: 'All' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
});
