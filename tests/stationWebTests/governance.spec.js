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
  
  await homePage.homePage.bringToFront();
  await homePage.selectSettings('Network Mainnet')
  await homePage.selectSettings('Testnets', false);
  await homePage.expectText('TESTNET');

  await page.pause()
});

test("Test create text proposal", async ({ page, homePage }) => { 
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();
  await homePage.homePage.bringToFront();
  await homePage.selectSettings('Network Mainnet')
  await homePage.selectSettings('Testnets', false);
  await homePage.expectText('TESTNET');

  await page.goto("/gov#PROPOSAL_STATUS_VOTING_PERIOD");
  await page.bringToFront()
  await page.getByRole("link", { name: "New proposal" }).click()
  await page.pause()

});

test("Test vote yes", async ({ page, homePage }) => { 

});

test("Test vote no", async ({ page, homePage }) => { 

});

test("Test vote abstain", async ({ page, homePage }) => { 

});

test("Test vote no with veto", async ({ page, homePage }) => { 

});

