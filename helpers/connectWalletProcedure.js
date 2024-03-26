export async function connectWallet(page, homePage) {
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
  }
  