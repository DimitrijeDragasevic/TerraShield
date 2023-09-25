const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Verify governance page", async ({ page, homePage }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  await page.goto("/gov#PROPOSAL_STATUS_VOTING_PERIOD");

  //Verify elements on page
  await expect(page.getByRole("link", { name: "New proposal" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Governance", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voting", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Deposit" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Passed" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Rejected" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "All", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Terra Terra" })).toBeVisible();

  await expect(page.locator(".ChainFilter_content__1zO9M")).toBeVisible();
});

test("Test create text proposal", async ({ page, homePage }) => {
  await createTextProposal(page, homePage);
});


async function createTextProposal(page, homePage) {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();

  // Switching to testnet
  await homePage.homePage.bringToFront();
  await homePage.selectSettings("Network Mainnet");
  await homePage.selectSettings("Testnets", false);
  await homePage.expectText("TESTNET");

  // Creating new proposal
  await page.goto("/gov#PROPOSAL_STATUS_VOTING_PERIOD");
  await page.bringToFront();
  await page.getByRole("link", { name: "New proposal" }).click();

  const proposalName = "text proposal test test";
  await page.fill('[name="title"]', proposalName);
  await page
    .getByPlaceholder(
      "We're proposing to spend 100,000 LUNA from the Community Pool to fund the creation of public goods for the Terra ecosystem"
    )
    .fill("text proposal test");
  await page.locator('[name="input"]').fill("0");
  await page.getByRole("button", { name: "Submit" }).click();

  // Approving the transaction
  await homePage.approveTransaction();
  await page.bringToFront();

  // Waiting for broadcast to complete
  await page.waitForTimeout(10000);

  // Verifying success and confirmation
  await expect(page.getByRole("heading", { name: "Success!" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm" }).click();

  // Verifying proposal name in the list after creation
  await page.goto("/gov#PROPOSAL_STATUS_VOTING_PERIOD");
  const textToVerify = await page.textContent(
    '[class="ProposalHeader_title__EeQ2d"]'
  );
  expect(proposalName).toEqual(textToVerify);
}