const { test, expect } = require("../../playwright.config");
const randomstring = require("randomstring");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Create a Token DAO", async ({ page, homePage }) => {
  const randomString = randomstring.generate(5) + "QAtest";
  await homePage.switchNetwork("Testnet");

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
  await page.getByText("Token DAO").click();
  await page.getByRole("button", { name: "Next" }).click();

  // Fill out the DAO creation form
  await page.getByPlaceholder("Enter a name for your DAO").fill(randomString);
  await page.getByPlaceholder("Enter the URL of your DAO's logo").click();
  await page
    .getByPlaceholder("Enter the URL of your DAO's logo")
    .fill(
      "https://www.madness-toys.store/cdn/shop/files/LOGO_FOR_STORE-removebg-preview.png?v=1683580793&width=80"
    );
  await page.getByLabel("Description0 / 280").click();
  await page.getByLabel("Description0 / 280").fill("test");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("No, create a new Token").click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByPlaceholder("Enter a name for your token").click();
  await page
    .getByPlaceholder("Enter a name for your token")
    .fill("Madnesstoys");
  await page.getByPlaceholder("Enter a symbol for your token").click();
  await page.getByPlaceholder("Enter a symbol for your token").fill("test");
  await page
    .getByPlaceholder('Enter a number of decimals for your token (e.g. "6")')
    .click();
  await page.getByPlaceholder("Enter a logo url").click();
  await page
    .getByPlaceholder("Enter a logo url")
    .fill(
      "https://www.madness-toys.store/cdn/shop/files/LOGO_FOR_STORE-removebg-preview.png?v=1683580793&width=80"
    );
  await page.getByPlaceholder("Enter a description for your token").click();
  await page
    .getByPlaceholder("Enter a description for your token")
    .fill("test");
  await page.getByPlaceholder("Enter a wallet address").click();
  await page
    .getByPlaceholder("Enter a wallet address")
    .fill("terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs");
  await page.getByPlaceholder("Enter your project's URL").click();
  await page
    .getByPlaceholder("Enter your project's URL")
    .fill("https://www.madness-toys.store/");

  // Proceed through the remaining steps
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByPlaceholder("Treasury amount").click();
  await page.getByPlaceholder("Treasury amount").fill("10");
  await page.getByPlaceholder("Enter amount").click();
  await page.getByPlaceholder("Enter amount").fill("10");
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByPlaceholder("Enter a minimum deposit amount").click();
  await page.getByPlaceholder("Enter a minimum deposit amount").fill("10");
  await page.getByPlaceholder("Enter minimum weight").click();
  await page.getByPlaceholder("Enter minimum weight").fill("1");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByPlaceholder("Search for an asset").click();
  await page.getByRole("button", { name: "LUNA uluna" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Create Token DAO")).toBeVisible();
  await homePage.approveTransaction();

  await page.bringToFront();

  // Verify the creation was successful
  await expect(page.getByRole("heading", { name: randomString })).toBeVisible({ timeout: 12000 });

  await expect(
    page.getByRole("heading", { name: "Recent proposals" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recent proposals" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Statistics" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true })
  ).toBeVisible();
  await expect(
    page.locator("div:nth-child(4) > .sc-79c16e5a-0 > div").first()
  ).toBeVisible();
  await expect(
    page.locator("div:nth-child(4) > .sc-79c16e5a-0 > div:nth-child(2)")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Governance Settings" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "DAO Info" })).toBeVisible();

  await page.getByText("Treasury").click();
  await expect(
    page.getByRole("button", { name: "Treasury Holdings $0.00" })
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("button", { name: "NFT Gallery $0.00" })
  ).toBeVisible();
  await expect(page.getByText("Transactions")).toBeVisible();

  await page.getByText("Proposals").click();
  await expect(page.getByPlaceholder("Search...")).toBeVisible();
  await expect(page.getByText("StatusNew Proposal")).toBeVisible();

  await page.getByText("Rewards").click();
  await expect(page.getByRole("heading", { name: "Rewards" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rewards" })).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Nothing to claimRewardsClaim all$/ })
      .first()
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Distribute Rewards to DAO StakersDeposit$/ })
      .first()
  ).toBeVisible();

  await page.getByText("Staking").click();
  await expect(page.getByRole("heading", { name: "Staking" })).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^20\.00Total supply$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^00%Total staked$/ })
      .first()
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^10testYour wallet$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^0Your total staked$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Voting power0\.000%StakeUnstake$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Claim Unstaked Tokens0testClaim all$/ })
      .first()
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Stake", exact: true })
  ).toBeVisible();
});
