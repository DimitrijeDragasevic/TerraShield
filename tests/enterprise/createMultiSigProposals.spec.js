import dotenv from "dotenv";
import {
  createTokenDAO,
  createMultiSigDao,
  createNftDAO,
} from "../../enterprise/createDao";
import { connectWallet } from "../../helpers/connectWalletProcedure";
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

test("Creating and Approving a Simple Proposal", async ({ page, homePage }) => {

  test.slow();
  await connectWallet(page, homePage);
  await page.pause();

  // create a dao, or search for one 
});
