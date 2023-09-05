import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://station.terra.money/');
  await page.getByRole('button', { name: 'Connect' }).click();
  await page.getByRole('button', { name: 'Station (Extension)' }).click();
});