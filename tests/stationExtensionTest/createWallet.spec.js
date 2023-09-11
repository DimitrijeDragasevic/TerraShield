const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Create wallet", async ({ newWalletPage }) => {
  await newWalletPage.fillCreateWalletForm("Test wallet 3");
});
