import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ entryPage, homePage }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements("Test wallet 1");
});

test("Test happy flow recover wallet from seed", async ({ authPage }) => {
  await authPage.fillPhraseForm(
    "Test wallet 2",
    "Testtest123!",
    process.env.SEED_PHRASE_TWO,
    false
  );
});
