import dotenv from "dotenv";
import {createTokenDAO, createMultiSigDao} from "../../enterpise/createDao";
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
  await page.waitForTimeout(10000);

  // Verify the creation was successful
  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 100000,
  });

  console.log(`This is the url of the created token DAO: ${page.url()}`);
});

test("Create a NFT DAO", async ({ page, homePage }) => {
  const randomString = randomstring.generate(5) + "NFT_QA_test";

  await page.goto("/");
  await page
    .locator("div")
    .filter({ hasText: /^DashboardConnect wallet$/ })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Station Wallet" }).click();
  await homePage.connectWallet();
  await page.bringToFront();
  await page.getByRole("link", { name: "Create DAO" }).click();

  // Fill out the DAO creation form
  await page.getByText("NFT DAO").click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter a name for your DAO").fill(randomString);
  await page
    .getByPlaceholder("Enter the URL of your DAO's logo")
    .fill(
      "https://www.madness-toys.store/cdn/shop/files/LOGO_FOR_STORE-removebg-preview.png?v=1683580793&width=80"
    );
  await page
    .getByPlaceholder("Describe your DAO in 280 characters or less.")
    .fill("test");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter the name of your NFT").fill("test");
  await page.getByPlaceholder("Enter the symbol of your NFT").fill("test");
  await page
    .getByPlaceholder("Terra contract address")
    .fill("terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter minimum weight").fill("10");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await homePage.approveTransaction();
  await page.bringToFront();

  //Wait for the dao page to load
  await page.waitForTimeout(10000);
  await expect(page.getByRole("heading", { name: randomString })).toBeVisible({
    timeout: 10000,
  });

  console.log(`This is the url of the created DAO: ${page.url()}`);
});

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

  await createMultiSigDao(page, daoName)
  
  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);


  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 100000,
  });

  console.log(`This is the url of the created multisig DAO: ${page.url()}`);
});
