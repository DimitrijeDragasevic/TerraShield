import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ seedPage, homePage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements();
});

test("Evaluate main page", async ({ homePage }) => {
  await homePage.verifyElements();
});
// this has to wait for the elements to change in station ui
test("Evaluate settings functionality", async ({ homePage }) => {
  await homePage.evaluateSettings();
});

test("Evaluate manage assets functionality", async ({ homePage }) => {
  await homePage.evaluateManageAssets();
});

test("Evaluate manage wallet functionality", async ({ homePage }) => {
  await homePage.evaluateManageWallet();
});
