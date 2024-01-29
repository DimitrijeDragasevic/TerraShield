import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ entryPage, homePage }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements("Test wallet 1");
});

test("Test import from private key option on station wallet extension", async ({
  authPage,
}) => {
  await authPage.fillSeedForm(process.env.PRIVATE_KEY, "Test wallet 2", "Testtest123!");
  await authPage.veirfySuccess();
});

test("Test import from private key option on station wallet extension with invalid key", async ({
  authPage,
}) => {
  await authPage.fillSeedForm("wrong key", "Test wallet 3", "test", false);
  await authPage.verifyWrongPrivateKeyMessage();
});

test("Test import from private key option on station wallet extension with wrong password", async ({
  authPage,
}) => {
  await authPage.fillSeedForm(
    process.env.PRIVATE_KEY_TWO,"testWallet 2",
    "123qwer"
  );
  await authPage.verifyWrongPassword();
});
