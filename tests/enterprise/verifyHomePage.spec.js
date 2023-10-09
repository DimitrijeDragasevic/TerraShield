const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Verify elements on the home page", async ({ page, homePage }) => {
  await page.goto("/");
  await page.locator('div').filter({ hasText: /^DashboardConnect wallet$/ }).getByRole('button').click();
  await page.getByRole('button', { name: 'Station Wallet' }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  await expect(page.getByText('DashboardCreate DAO')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create DAO' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Top DAOs by TVL' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recent proposals' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'DAO', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();

  await expect(page.getByText('FAVOURITES')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse' })).toBeVisible();

  await page.getByRole('link', { name: 'Browse' }).click()

  await expect(page.getByRole('heading', { name: 'Browse DAOs' })).toBeVisible();
  await expect(page.getByPlaceholder('Search...')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Type$/ }).nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Value$/ })).toBeVisible();
});