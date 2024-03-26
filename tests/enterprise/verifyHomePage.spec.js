import dotenv from 'dotenv';
import { connectWallet } from '../../helpers/connectWalletProcedure';
const { test, expect } = require("../../playwright.config");
dotenv.config();

test.beforeEach(async ({ entryPage, homePage }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements("Test wallet 1");

  const TESTNET = process.env.IS_TESTNET === "true";
  if (TESTNET) {
    await homePage.switchNetwork("Testnet");
  }
});

test("Verify elements on the home page", async ({ page, homePage }) => {
  await connectWallet(page, homePage);

  await expect(page.getByText('DashboardCreate DAO')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Create DAO' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Top DAOs by Treasury Holdings' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Last 7 days proposals' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'DAO', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('FAVORITES')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse' })).toBeVisible();

  await page.getByRole('link', { name: 'Browse' }).click()

  await expect(page.getByRole('heading', { name: 'Browse DAOs' })).toBeVisible();
  await expect(page.getByPlaceholder('Search...')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Type$/ }).nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Value$/ })).toBeVisible();
});