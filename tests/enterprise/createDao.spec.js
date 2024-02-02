import dotenv from "dotenv";
import {
  createTokenDAO,
  createMultiSigDao,
  createNftDAO,
} from "../../enterprise/createDao";
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

/**
 * Test: Create a Token DAO
 *
 * Purpose:
 * This test automates the process of creating a Token DAO on a web application.
 * It simulates user interactions from connecting a wallet to finalizing the creation of a DAO.
 *
 * Test Flow:
 * 1. Set the test to run at a slower pace for better handling of network and rendering delays.
 * 2. Navigate to the home page of the application.
 * 3. Locate and click the button to connect a wallet, specifically targeting the 'Station Wallet'.
 * 4. Use the `homePage` object's method to handle the wallet connection process.
 * 5. Bring the main testing page back to the front if it loses focus.
 * 6. Generate a unique DAO name using the current ISO date and time to ensure uniqueness.
 * 7. Call the function `createTokenDAO` to initiate and complete the DAO creation process.
 * 8. Approve the transaction related to DAO creation.
 * 9. Wait for a specific timeout to account for transaction processing.
 * 10. Verify the successful creation of the DAO by checking for a heading with the unique DAO name, with an extended timeout to ensure the page has loaded completely.
 *
 * This test ensures that the DAO creation feature works as expected and handles the wallet connection and transaction approval processes correctly.
 */
test("Create a Token DAO", async ({ page, homePage }) => {
  test.slow();
  await page.bringToFront();
  await page.goto("/");
  await page
    .locator("div")
    .filter({ hasText: /^DashboardConnect wallet$/ })
    .getByRole("button")
    .click();

  await page.getByRole("button", { name: "Station Wallet" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  const now = new Date();
  const isoDate = now.toISOString();

  const daoName = `Dimi's TokenDao ${isoDate}`;
  await createTokenDAO(page, daoName);

  await homePage.approveTransaction();

  await page.bringToFront();

  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 100000,
  });

  console.log(`This is the url of the created token DAO: ${page.url()}`);
});

/**
 * Test: Create a NFT DAO
 *
 * Purpose:
 * This test automates the process of creating a NFT DAO in a web application.
 * It handles the user journey from the initial wallet connection to the final creation step of a NFT DAO.
 *
 * Test Flow:
 * 1. Navigate to the home page of the application.
 * 2. Locate and click the button to connect a wallet, targeting 'Station Wallet'.
 * 3. Utilize the `homePage` object's method to facilitate the wallet connection.
 * 4. Bring the main testing page to focus.
 * 5. Generate a unique NFT DAO name using the current date and time.
 * 6. Execute the `createNftDAO` function to carry out the DAO creation process.
 * 7. Approve the transaction necessary for the DAO creation.
 * 8. Wait for the necessary time to allow for transaction processing.
 * 9. Confirm the DAO's successful creation by checking for a heading with the unique DAO name.
 *
 * This test ensures the correct functionality of the NFT DAO creation process, including wallet connection and transaction approval.
 */
test("Create a NFT DAO", async ({ page, homePage }) => {
  test.slow();

  await page.goto("/");
  await page
    .locator("div")
    .filter({ hasText: /^DashboardConnect wallet$/ })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Station Wallet" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  const now = new Date();
  const isoDate = now.toISOString();

  const daoName = `Dimi's NftDao ${isoDate}`;
  const NFT =
    "terra1nh9m74gyhkjfvxhzyp426s8vfem2q8sy2d662xplwvarxdwnuj6ql4ecch";

  await createNftDAO(page, daoName, false, NFT);

  await homePage.approveTransaction();
  await page.bringToFront();

  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 100000,
  });

  console.log(`This is the url of the created DAO: ${page.url()}`);
});

/**
 * Test: Create a MultiSig DAO
 *
 * Purpose:
 * This test is designed to automate the creation of a MultiSig DAO in the application.
 * It encompasses the steps involved in connecting a wallet and completing the MultiSig DAO setup.
 *
 * Test Flow:
 * 1. Start by visiting the home page of the application.
 * 2. Identify and activate the wallet connection button, focusing on 'Station Wallet'.
 * 3. Leverage the `homePage` object to manage the wallet connection.
 * 4. Refocus on the primary testing page.
 * 5. Formulate a unique MultiSig DAO name with the current ISO date and time.
 * 6. Invoke `createMultiSigDao` function to initialize and finish the DAO setup.
 * 7. Validate the transaction essential for establishing the DAO.
 * 8. Allow a pause to ensure the processing of the transaction.
 * 9. Validate the successful establishment of the DAO by verifying the presence of a heading with the DAO's name.
 *
 * This test validates the effective operation of the MultiSig DAO creation feature, including the processes of wallet connection and transaction confirmation.
 */
test("Create a MultiSig DAO", async ({ page, homePage }) => {
  test.slow();
  const now = new Date();
  const isoDate = now.toISOString();

  const daoName = `Dimi's MultisigDao ${isoDate}`;

  await page.goto("/");
  await page
    .locator("div")
    .filter({ hasText: /^DashboardConnect wallet$/ })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Station Wallet" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  await createMultiSigDao(page, daoName);

  await homePage.approveTransaction();

  await page.bringToFront();

  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 100000,
  });

  console.log(`This is the url of the created multisig DAO: ${page.url()}`);
});
