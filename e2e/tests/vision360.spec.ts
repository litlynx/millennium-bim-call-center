import { test } from '@playwright/test';

test('vision360', async ({ page }) => {
  // Recording...
  await page.goto('/vision-360');
  await page.getByRole('button', { name: 'Reclamações / Incidentes' }).click();
  await page.goto('/vision-360');
  await page.getByRole('button', { name: 'Últimos contactos' }).click();
  await page.goto('/vision-360');
  await page.getByRole('button', { name: 'Património e produtos' }).click();
  await page.goto('/vision-360');
  await page.getByRole('button', { name: 'Canais e serviços' }).click();
  await page.goto('/vision-360');
  await page.getByRole('button', { name: 'Dados Pessoais' }).click();
  await page.goto('/vision-360');
  await page.getByRole('tab', { name: 'Mensagens' }).click();
  await page.getByRole('tab', { name: 'Chamadas' }).click();
  await page.getByRole('tab', { name: 'Incidentes' }).click();
  await page.getByRole('tab', { name: 'Reclamações' }).click();
});
