import dotenv from "dotenv";
const { test, expect } = require("../../playwright.config");
const randomstring = require("randomstring");
dotenv.config();

test.beforeEach(async ({ seedPage, homePage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
  const TESTNET = process.env.IS_TESTNET === "true";
  if (TESTNET) {
    await homePage.switchNetwork("Testnet");
  }
});

test("Create a text proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Text proposal").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page.getByPlaceholder("Enter proposal title").click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Test text proposal");
  await page.getByPlaceholder("Enter proposal description").click();
  await page
    .getByPlaceholder("Enter proposal description")
    .fill("Test text proposal");
  await page.getByRole("button", { name: "Create" }).click();

  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(
    page.getByRole("heading", { name: "Test text proposal" })
  ).toBeVisible();
  await expect(page.getByText("Proposed by:")).toBeVisible();
  await expect(
    page.locator("p").filter({ hasText: /^Test text proposal$/ })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Yes" })).toBeVisible();
  await expect(page.getByRole("button", { name: "No" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Veto" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Abstain" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Votes" })).toBeVisible();
});

test("Create an Update DAO information proposal", async ({
  page,
  homePage,
}) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Update DAO information").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Test Update metadata proposal");
  await page.getByPlaceholder("Enter proposal description").fill("test 123");
  await page.getByPlaceholder("Enter Twitter username").fill("test123");
  await page.locator("form").click();
  await page.getByRole("button", { name: "Create" }).click();

  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(page.getByText("null")).toBeVisible();
  await expect(page.getByText("test123")).toBeVisible();
  await expect(page.getByText("Twitter:")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "DAO Metadata" })
  ).toBeVisible();
  await expect(page.getByText("in progress")).toBeVisible();
  await expect(page.getByText("metadata", { exact: true })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^Yes$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^No$/ })).toBeVisible();
  await expect(page.getByText("Abstain")).toBeVisible();
  await expect(page.getByText("No with Veto")).toBeVisible();
  await expect(page.getByText("Quorum 30%")).toBeVisible();
});

test("Create an Update Dao settings proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^Update DAO settings$/ })
    .click();
  await page.getByRole("link", { name: "Next" }).click();

  await page.locator(".sc-ade02c7d-1").first().click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Test update dao settings");
  await page
    .getByPlaceholder("Enter proposal description")
    .fill("Testing the update of settings");
  await page.getByRole("button", { name: "Create" }).click();

  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await page.getByText("7 days").click();
  // this is the arrow between the two updated days (Like what changed)
  await page
    .locator("div")
    .filter({ hasText: /^7 days30 days$/ })
    .getByRole("img")
    .click();
  await page.getByText("30 days").click();
});

test("Create a spend trasury proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  // this needs to be working on the front end side for us to start working on this
});

test("Delegate luna proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  // this needs to be working on the front end side for us to start working on this
});

test("Undelegate luna proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  // this needs to be working on the front end side for us to start working on this
});

test("Redelegate luna proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
});

test("Update minimum weight for rewards proposal", async ({
  page,
  homePage,
}) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Update minimum weight for rewards").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page.getByPlaceholder("Enter proposal title").click();
  await page.getByPlaceholder("Enter proposal title").fill("Update rewards");
  await page.getByPlaceholder("Enter proposal description").click();
  await page.getByPlaceholder("Enter proposal description").fill("test");
  await page.getByRole("button", { name: "Create" }).click();
  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(
    page.getByRole("heading", { name: "Update rewards" })
  ).toBeVisible();
  await expect(
    page.getByText("Update the minimum weight for rewards to 10")
  ).toBeVisible();
});

test("Deploy cross-chain tresulty proposal JUNO", async ({
  page,
  homePage,
}) => {
  if (process.env.IS_TESTNET === "true") {
    test.slow();
    await createMultiSigDao(page, homePage);
    await page.getByText("Proposals", { exact: true }).click();
    await page.getByRole("link", { name: "New Proposal" }).click();
    await page.getByText("Deploy cross-chain treasury").click();
    await page.getByRole("link", { name: "Next" }).click();
    await page.getByPlaceholder("Enter proposal title").click();
    await page
      .getByRole("heading", { name: "Deploy cross-chain treasury" })
      .click();
    await page
      .getByPlaceholder("Enter proposal title")
      .fill("Deploy cross-chain treasury JUNO");
    await page
      .locator("div")
      .filter({ hasText: /^Whitelist assetsAdd$/ })
      .getByRole("button")
      .click();
    await page
      .getByRole("button", { name: "Asset icon Test Juno ujunox" })
      .click();
    await page.getByPlaceholder("Enter proposal description").fill("test");
    await page.getByRole("button", { name: "Create" }).click();
    await homePage.approveTransaction();

    await page.bringToFront();
    await page.waitForTimeout(10000);

    await expect(
      page.getByRole("heading", { name: "Deploy cross-chain treasury JUNO" })
    ).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Deploy cross-chain treasury on Juno\.$/ })
    ).toBeVisible();
    await expect(
      page.getByText("Deploy cross-chain treasury on Juno.")
    ).toBeVisible();
  } else {
    test.skip();
  }
});

test("Deploy cross-chain tresulty proposal INJ", async ({ page, homePage }) => {
  if (process.env.IS_TESTNET === "true") {
    test.slow();
    await createMultiSigDao(page, homePage);
    await page.getByText("Proposals", { exact: true }).click();
    await page.getByRole("link", { name: "New Proposal" }).click();
    await page.getByText("Deploy cross-chain treasury").click();
    await page.getByRole("link", { name: "Next" }).click();
    await page.getByPlaceholder("Enter proposal title").click();
    await page
      .getByRole("heading", { name: "Deploy cross-chain treasury" })
      .click();
    await page.getByPlaceholder("Enter proposal title").click();
    await page
      .getByPlaceholder("Enter proposal title")
      .fill("Deploy cross-chain treasury Injective");
    await page.getByPlaceholder("Enter proposal description").click();
    await page.getByPlaceholder("Enter proposal description").fill("test");
    await page.getByText("Injective").click();
    await page
      .locator("div")
      .filter({ hasText: /^Whitelist assetsAdd$/ })
      .getByRole("button")
      .click();
    await page
      .getByRole("button", { name: "Asset icon Injective inj" })
      .click();
    await page.getByRole("button", { name: "Create" }).click();
    await homePage.approveTransaction();

    await page.bringToFront();
    await page.waitForTimeout(10000);

    await expect(
      page.getByRole("heading", {
        name: "Deploy cross-chain treasury Injective",
      })
    ).toBeVisible();
    await expect(
      page.getByText("Deploy cross-chain treasury on Injective.")
    ).toBeVisible();
  } else {
    test.skip();
  }
});

test("Deploy cross-chain treasury Migaloo", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Create cross-chain treasury").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Crete corss-chain treasury test Migaloo");
  await page.getByPlaceholder("Enter proposal description").fill("test");
  await page.getByRole("button", { name: "Create" }).click();

  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(
    page.getByText("Deploy cross-chain treasury on Migaloo.")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Crete corss-chain treasury test Migaloo",
    })
  ).toBeVisible();
});

test("Update multisig members proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Update multisig members").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page.getByPlaceholder("Enter proposal title").click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Update multisig members");
  await page.getByPlaceholder("Enter proposal description").click();
  await page.getByPlaceholder("Enter proposal description").fill("test");
  await page.getByRole("button", { name: "Create" }).click();
  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(
    page.getByRole("heading", { name: "Update multisig members" })
  ).toBeVisible();
  await expect(page.getByText("Update members")).toBeVisible();
});

test("Create an update whitelist proposal", async ({ page, homePage }) => {
  test.slow();
  await createMultiSigDao(page, homePage);
  await page.getByText("Proposals", { exact: true }).click();
  await page.getByRole("link", { name: "New Proposal" }).click();
  await page.getByText("Update whitelisted assets").click();
  await page.getByRole("link", { name: "Next" }).click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("add another currency");
  await page.getByPlaceholder("Enter proposal title").click();
  await page.getByPlaceholder("Enter proposal description").click();
  await page.getByPlaceholder("Enter proposal description").fill("test");
  await page.getByRole("button", { name: "Add" }).click();
  await page
    .getByRole("button", {
      name: "Asset icon Alliance Deck factory/terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je/stDeck",
    })
    .click();
  await page.getByRole("button", { name: "Add" }).click();
  await page
    .getByRole("button", {
      name: "Asset icon Alliance Oracle factory/terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je/stOracle",
    })
    .click();
  await page.getByRole("button", { name: "Add" }).click();
  await page
    .getByRole("button", {
      name: "Asset icon Test Mars ibc/A91A7FDF128104F0A49B96E9EC8D8D739F878796B33104F70478CDE60B6401D5",
    })
    .click();
  await page.getByRole("button", { name: "Add" }).click();
  await page
    .getByRole("button", {
      name: "Asset icon Test Sei ibc/E2817356DDE85EB75B5F7D353E89109B2A32AE49EBC84DA1D955F82A0C00A0F6",
    })
    .click();
  await page.getByPlaceholder("Enter proposal description").click({
    clickCount: 3,
  });
  await page.getByRole("button", { name: "Create" }).click();
  await homePage.approveTransaction();

  await page.bringToFront();
  await page.waitForTimeout(10000);

  await expect(
    page.locator("div").filter({ hasText: /^add another currency$/ })
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Alliance Deck$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Alliance Oracle$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Test Mars$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Test Sei$/ })
      .first()
  ).toBeVisible();
});

async function createMultiSigDao(page, homePage) {
  const randomString = randomstring.generate(5) + "_test_proposals";

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
    .getByPlaceholder("Describe your DAO in 280 characters or less.")
    .click();
  await page
    .getByPlaceholder("Describe your DAO in 280 characters or less.")
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
    timeout: 100000,
  });

  console.log(`This is the url of the created DAO: ${page.url()}`);
}
