import dotenv from "dotenv";
import { createTokenDAO } from "../../enterprise/createDao";
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

test("Verify created Token DAO", async ({ page, homePage }) => {
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
  // Verify the creation was successful
  await expect(page.getByRole("heading", { name: daoName })).toBeVisible({
    timeout: 1000000,
  });

  console.log(`This is the url of the created token DAO: ${page.url()}`);

  await expect(
    page.getByRole("heading", { name: "Recent proposals" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Statistics" })).toBeVisible();
  // Verify Statistics
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^0\.00LUNATotal staked$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^1\.16BLUNATotal supply$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^0The number of proposals$/ })
      .first()
  ).toBeVisible();
  // Verify Settings elements
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Governance Settings" })
  ).toBeVisible();
  await expect(page.getByText("Quorum:")).toBeVisible();
  await expect(page.getByText("Threshold:", { exact: true })).toBeVisible();
  await expect(page.getByText("Voting duration:")).toBeVisible();
  await expect(page.getByText("Veto threshold:")).toBeVisible();
  await expect(page.getByText("Unlocking period:")).toBeVisible();
  await expect(page.getByText("Minimum deposit:")).toBeVisible();
  await expect(page.getByRole("heading", { name: "DAO Info" })).toBeVisible();

  await expect(page.getByText("Terra treasury:")).toBeVisible();
  await expect(page.getByText("Juno treasury:")).toBeVisible();
  await expect(page.getByText("Migaloo treasury:")).toBeVisible();
  await expect(page.getByText("Neutron treasury:")).toBeVisible();
  await expect(page.getByText("Osmosis treasury:")).toBeVisible();
  await expect(page.getByText("Stargaze treasury:")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "DAO council" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Social channels" })
  ).toBeVisible();

  await page.getByText("Treasury", { exact: true }).click();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Assets Holdings\$0\.00$/ })
      .first()
  ).toBeVisible({ timeout: 100000 });
  await expect(
    page.getByText("DAO treasury doesn't have any assets")
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^NFT Gallery\$0\.00$/ })
      .first()
  ).toBeVisible();
  await expect(
    page.getByText("DAO treasury doesn't have any NFTs")
  ).toBeVisible();

  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Staking\$0\.00$/ })
      .first()
  ).toBeVisible();
  await expect(
    page.getByText("DAO treasury doesn't have any staking positions")
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Liquidity Pools\$0\.00$/ })
      .first()
  ).toBeVisible();
  await expect(
    page.getByText("DAO treasury doesn't have any liquidity pools")
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Yield Farming\$0\.00$/ })
      .first()
  ).toBeVisible();
  await expect(
    page.getByText("DAO treasury doesn't have any positions")
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Transactions$/ })
      .first()
  ).toBeVisible();
  await expect(page.getByText("Transactions", { exact: true })).toBeVisible();
  await expect(
    page.getByText("DAO treasury doesn't have any transactions")
  ).toBeVisible();
  await page.getByText("Proposals").click();
  await expect(page.getByText('Status')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Proposal' })).toBeVisible();
  await expect(page.getByPlaceholder("Search...")).toBeVisible();

  await page.getByText("Rewards").click();
  await expect(page.getByRole("heading", { name: "Rewards" })).toBeVisible({
    timeout: 100000,
  });
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Nothing to claimRewardsClaim$/ })
      .first()
  ).toBeVisible({ timeout: 100000 });
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
      .filter({ hasText: /^1\.16BLUNATotal supply$/ })
      .first()
  ).toBeVisible({ timeout: 100000 });

  await expect(
    page
      .locator("div")
      .filter({ hasText: /^0\.00LUNATotal staked$/ })
      .first()
  ).toBeVisible({ timeout: 100000 });
  await expect(page.getByText("Your wallet")).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^0\.00LUNAYour total staked$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^Voting power0\.00LUNA0%StakeUnstake$/ })
      .first()
  ).toBeVisible();
  await expect(
    page
      .locator("div")
      .filter({
        hasText:
          /^Claimable tokens0 LUNAUnstaking tokens0 LUNAClaim all tokensView release dates$/,
      })
      .first()
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Stake", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Unstake" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Claim all tokens" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "View release dates" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Refresh DAO" })).toBeVisible();

  console.log(`This is the url of the created DAO: ${page.url()}`);
});
