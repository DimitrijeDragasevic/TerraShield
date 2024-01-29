import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ entryPage, homePage }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements();
});

test("Go to the menage wallet screen from home screen and verify its form and elements", async ({
  homePage,
}) => {
  await homePage.goToManageWalletsMenu();
  await homePage.verifyElementsManageWalletsForm();
});
