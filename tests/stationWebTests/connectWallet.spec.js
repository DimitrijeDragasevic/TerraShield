const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ entryPage, homePage }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements("Test wallet 1");
});

test("Test the connect a wallet function", async ({ page, homePage }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await page.bringToFront();
  await homePage.connectWallet();
});
