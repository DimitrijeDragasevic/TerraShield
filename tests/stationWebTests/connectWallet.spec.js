const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("connect wallet", async ({ page, homePage }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();
  await page.bringToFront();
});
