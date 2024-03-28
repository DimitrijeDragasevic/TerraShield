export async function connectWallet(page, homePage) {
  await page.bringToFront();
  await page.goto("/");

  // Check if the 'DashboardConnect wallet' button is visible
  const isConnectWalletVisible = await page
      .locator("div")
      .filter({ hasText: /^DashboardConnect wallet$/ })
      .locator('role=button') // Corrected to use 'locator' to chain finding the button role.
      .isVisible();

  // If the 'DashboardConnect wallet' button is not visible, return early.
  if (!isConnectWalletVisible) {
      console.log('The wallet is already connected.');
      return 'The wallet is already connected.';
  }

  // If the button is visible, continue with the wallet connection process.
  await page
      .locator("div")
      .filter({ hasText: /^DashboardConnect wallet$/ })
      .locator('role=button') // Corrected to use 'locator' to chain finding the button role.
      .click();
  await page.getByRole("button", { name: "Station Wallet" }).click();
  await homePage.connectWallet();
  await page.bringToFront();
}
