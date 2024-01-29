const expect = require("@playwright/test").expect;

async function createMultisigDAO(page, homePage, name) {
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
  await page.getByPlaceholder("Enter a name for your DAO").fill(name);
  await page
    .getByPlaceholder("Enter the URL of your DAO's logo")
    .fill("https://station.money/static/media/favicon.1e08d51d.svg");

  await page.getByLabel("Description0 / 560").fill("test");

  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("Yes, find my Token").click();
  await page.getByPlaceholder("Search for an asset").fill("LUNA");
  await page
    .locator("div")
    .filter({ hasText: /^LUNATerra Luna$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Next" }).click();

  await daoGovernance(page);

  await councilMembers(page, "terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs");

  await createTreasuryOutposts(
    page,
    "Migaloo",
    "Neutron",
    "Juno",
    "Osmosis",
    "Stargaze"
  );

  await socialMediaLinks("test","test","test","test")
  await page.pause();
  await page.getByRole("button", { name: "Next" }).click();

  //Create Treasury Outposts

  await page.getByRole("button", { name: "Next" }).click();

  //Social media links

  await page.getByRole("button", { name: "Next" }).click();

  // Create Token Dao final page

  await page.getByRole("button", { name: "Next" }).click();

  await expect(page.getByText("Create Token DAO")).toBeVisible();
}

async function daoGovernance(page, minimumDeposit = "10", minimumWeight = "1") {
  await expect(page.getByText("7 days")).toBeVisible();
  await expect(page.getByText("30%")).toBeVisible();
  await expect(page.getByText("51%").first()).toBeVisible();
  await expect(page.getByText("51%").last()).toBeVisible();
  await expect(page.getByText("14 days")).toBeVisible();
  await page
    .getByPlaceholder("Enter a minimum deposit amount")
    .fill(minimumDeposit);
  await page.getByPlaceholder("Enter minimum weight").fill(minimumWeight);
  await page.getByRole("button", { name: "Next" }).click();
}

async function councilMembers(page, walletAddress) {
  await expect(page.getByText("Add council members to your DAO")).toBeVisible();
  await expect(
    page.getByText(
      "(Optional) DAO Council members can create and vote on certain emergency proposal"
    )
  ).toBeVisible();
  await expect(
    page.getByText("Council members", { exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
  await page.getByRole("button", { name: "Add" }).click();

  await expect(
    page.getByPlaceholder("Enter council member's address")
  ).toBeVisible();
  await page
    .getByPlaceholder("Enter council member's address")
    .fill(walletAddress);

  await page
    .getByPlaceholder("select a proposal type")
    .fill("Update DAO information");
  await page.getByText("Update DAO information").click();
  await page
    .getByPlaceholder("select a proposal type")
    .fill("Update asset whitelist");
  await page.getByText("Update asset whitelist").click();
  await expect(page.getByText("No options left")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
}

//'Migaloo', 'Neutron', 'Juno', 'Osmosis', 'Stargaze'
async function createTreasuryOutposts(page, ...treasury) {
  for (const chain of treasury) {
    await page.getByText(chain).click();
  }
  await page.getByRole("button", { name: "Next" }).click();
}

async function socialMediaLinks(twitter, github, discord, telegram) {
  await page.getByPlaceholder("Enter Twitter username").fill(twitter);
  await page.getByPlaceholder("Enter GitHub username").fill(github);
  await page.getByPlaceholder("Enter Discord username").fill(discord);
  await page.getByPlaceholder("Enter Telegram username").fill(telegram);
  await page.getByRole("button", { name: "Next" }).click();
}

async function createTokenDaoSummary() {}

export default createMultisigDAO;
