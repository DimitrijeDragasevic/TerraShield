const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ seedPage, homePage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements();
});

test("Create wallet", async ({ newWalletPage, homePage }) => {
  await newWalletPage.createWallet("Test wallet 3");
  await homePage.verifyWallet("Test wallet 3");
  await homePage.verifyElements("Test wallet 3");
});
