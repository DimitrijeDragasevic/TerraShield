import dotenv from "dotenv";
import createMultisigDAO from "../../enterpise/createDao";
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

test("Create a Token DAO", async ({ page, homePage }) => {
  test.slow();
  const now = new Date();
  const isoDate = now.toISOString();

  const daoName = `Dimi's TokenDao + "${isoDate}"`;
  await createMultisigDAO(page, homePage, daoName);

  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  // Verify the creation was successful
  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 10000,
  });

  console.log(`This is the url of the created DAO: ${page.url()}`);
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
  const randomString = randomstring.generate(5) + "Multi_QA_test";

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
  await page.getByText("Multisig DAO").click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter a name for your DAO").fill(randomString);
  await page
    .getByPlaceholder("Enter the URL of your DAO's logo")
    .fill(
      "https://www.madness-toys.store/cdn/shop/files/LOGO_FOR_STORE-removebg-preview.png?v=1683580793&width=80"
    );
  await page
    .getByPlaceholder("Describe your DAO in 560 characters or less.")
    .click();
  await page
    .getByPlaceholder("Describe your DAO in 560 characters or less.")
    .fill("test");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.locator('input[name="members\\.1\\.address"]').click();
  await page
    .locator('input[name="members\\.1\\.address"]')
    .fill("terra10detxcnq49r3nnze7zuqprl7yqdh34fulqtakw");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter minimum weight").click();
  await page.getByPlaceholder("Enter minimum weight").fill("10");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);
  // Verify the creation was successful
  await expect(page.getByRole("heading", { name: randomString })).toBeVisible({
    timeout: 10000,
  });

  console.log(`This is the url of the created DAO: ${page.url()}`);
});
