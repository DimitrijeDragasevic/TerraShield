import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Go to the menage wallet screen from home screen and verify its form and elements", async ({
  homePage,
}) => {
  await homePage.goToManageWalletsMenuFromHome();
  await homePage.verifyElementsManageWalletsForm();
});
