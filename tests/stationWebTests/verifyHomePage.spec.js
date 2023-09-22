const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Verify home page elements", async ({ page, homePage }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  // Verify heading elements
  await expect(
    page
      .locator("article")
      .filter({
        hasText:
          "SwapPowered by TFMSelect a chain to perform swaps onTerraLeave coins to pay fees",
      })
      .getByRole("article")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Select a chain to perform swaps on" })
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button").first()
  ).toBeVisible();
  await expect(
    page.getByRole("banner").getByRole("button").nth(1)
  ).toBeVisible();

  await expect(
    page.getByRole("banner").getByRole("button").nth(2)
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Test wallet 1" })
  ).toBeVisible();

  // Middle elements
  await expect(
    page.getByRole("button", { name: "LUNA", exact: true })
  ).toBeVisible();
  await expect(page.getByPlaceholder("0.000000")).toBeVisible();
  await expect(page.getByText("Slippage tolerance%")).toBeVisible();
  await expect(
    page.locator("div").filter({ hasText: /^Submit$/ })
  ).toBeVisible();

  // Right elements
  await expect(page.getByText("AssetsManage")).toBeVisible();
  await expect(page.getByRole("button", { name: "Manage" })).toBeVisible();

  // Left elements
  await expect(page.getByText("SendReceiveBuy")).toBeVisible();
  await expect(
    page.getByText("StationSwapHistoryStakeGovernance")
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Swap" })).toBeVisible();
  await expect(page.getByRole("link", { name: "History" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Stake" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Governance" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Documentation" })).toBeVisible();

  // Social media icons plus GitHub
  await expect(page.locator(".Contacts_icon__3Hz7i").first()).toBeVisible();
  await expect(
    page.locator(".Flex_flex__3Fp2P > a:nth-child(2)")
  ).toBeVisible();
  await expect(
    page.locator(".Flex_flex__3Fp2P > a:nth-child(3)")
  ).toBeVisible();
  await expect(
    page.locator(".Flex_flex__3Fp2P > a:nth-child(4)")
  ).toBeVisible();
});
