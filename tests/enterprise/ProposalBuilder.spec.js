import dotenv from "dotenv";
import {
  createTokenDAO,
  createMultiSigDao,
  createNftDAO,
} from "../../enterprise/createDao";
import {
  navigateToProposals,
  createSimpleProposal,
  vote,
} from "../../enterprise/proposals";
import { connectWallet } from "../../helpers/connectWalletProcedure";
const { test, expect } = require("../../playwright.config");
dotenv.config();

let daoPage;

test.beforeEach(async ({ entryPage, homePage, page }) => {
  await entryPage.fillPhraseForm("Test wallet 1", "Testtest123!");
  await homePage.enterPassword();
  await homePage.verifyElements("Test wallet 1");

  const TESTNET = process.env.IS_TESTNET === "true";
  if (TESTNET) {
    await homePage.switchNetwork("Testnet");
  }

  if (!daoPage) {
    test.slow();
    await connectWallet(page, homePage);

    const now = new Date();
    const isoDate = now.toISOString();
    const daoName = `Dimis prop dao ${isoDate}`;

    await createMultiSigDao(page, daoName);

    await homePage.approveTransaction();

    await page.bringToFront();

    await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
      timeout: 100000,
    });

    console.log(`This is the url of the created DAO: ${page.url()}`);

    daoPage = page.url();
  }
});

test("Creating and Approving a Simple Proposal", async ({ page, homePage }) => {
  test.slow();

  await connectWallet(page, homePage);
  await page.goto(daoPage);
  await page.bringToFront();

  await navigateToProposals(page);
  await createSimpleProposal(page);

  await homePage.approveTransaction();

  await page.bringToFront();
  await expect(
    page.getByRole("heading", { name: "Test simple proposal" })
  ).toBeVisible({ timeout: 100000 });

  await vote(page, "Yes");
  await homePage.approveTransaction();
  await page.bringToFront();
  expect(page.getByText("🎉 The proposal has passed")).toBeVisible({
    timeout: 100000,
  });
  await page.getByRole("button", { name: "Execute" }).click();
  await homePage.approveTransaction();
  await page.bringToFront();
  expect(page.getByText("tx completed")).toBeVisible({ timeout: 10000 });
  expect(page.getByText("executed")).toBeVisible({ timeout: 10000 });
});