const { test, expect } = require("../../playwright.config");

test.beforeEach(async ({ authPage }) => {
  await authPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await authPage.verifyFirstWalletAdded();
});

test("Swap 1 LUNA to AXLUSDT successfully", async ({ page, homePage }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Connect" }).click();
  await page.getByRole("button", { name: "Station (Extension)" }).click();
  await homePage.connectWallet();
  await page.bringToFront();

  // 1. Verify elements on the swap page
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


  // 2. Set swap details

  // Click on the dropdown button to expand the options.
  await page.click('button.SelectToken_toggle__2XoPn');
  // Wait for the LUNA option to be visible and then click on it.
  await page.click('div.TokenCard_main__1SRGp h1');

  await page.fill('input[name="input"]', "1");
  await page.getByRole("button", { name: "Select a coin" }).click();
  await page.locator("button").filter({ hasText: "axlUSDT" }).click(); // Example: Set 1 LUNA to swap

  // Wait for any 'input.muted' element to be detached (i.e., no longer present in the DOM).
  await page.waitForSelector("input.muted", { state: "detached" });

  // Alternatively, if it's not specifically an input, or to be more precise:
  await page.waitForFunction(() => {
    // Fetch all elements with the class 'muted' from the DOM.
    const mutedElements = document.querySelectorAll(".muted");

    // Loop through each muted element.
    for (let element of mutedElements) {
      // If any of these elements contains the text "Simulating...", we're not ready yet.
      if (element.textContent.includes("Simulating...")) {
        return false; // Keep waiting since we found "Simulating...".
      }
    }
    // If the loop completes and we haven't found "Simulating...", we're good to proceed.
    return true;
  });

  // 3. Verify Pre-swap Details

  const conversionRateSelector = "span > .Read_component__2DP8V:nth-child(2)";

  const axlUSDTSpan = page
    .locator("span.Read_component__2DP8V > .Read_small__37DWT")
    .nth(2);

  // Extract the axlUSDT value
  const axlUSDTValueText = await axlUSDTSpan.textContent();
  const axlUSDTValue = parseFloat("0" + axlUSDTValueText);

  // Ensure you found the axlUSDT value
  if (!axlUSDTValue) {
    throw new Error("Unable to extract axlUSDT value from the span.");
  }

  // Extract the conversion rate (LUNA rate for 1 axlUSDT)
  const conversionRateText = await page.textContent(conversionRateSelector);
  const conversionRateMatch = conversionRateText.match(/(\d+\.\d+) LUNA/);
  if (!conversionRateMatch || !conversionRateMatch[1]) {
    throw new Error("Unable to extract conversion rate from the span");
  }
  const conversionRate = parseFloat(conversionRateMatch[1]);

  // Calculate the expected conversion rate based on the extracted axlUSDT value (since 1 LUNA)
  const expectedConversionRate = 1 / axlUSDTValue;
  // Assert that the calculated conversion rate is approximately equal to the extracted conversion rate from the span
  expect(conversionRate).toBeCloseTo(expectedConversionRate, 0.1); // assuming ±1 variance

  // Check minimum recived value
  const test = page
    .locator("span.Read_component__2DP8V > .Read_small__37DWT")
    .nth(7);
  const minRecivedvalue = parseFloat(await test.textContent());
  expect(minRecivedvalue).toBeCloseTo(axlUSDTValue, 0.2);

  // This code to enabled when test id's are introduced

  // const currentBalancePrefix = page.locator('[class="Read_component__2DP8V"]');
  // console.log(await currentBalancePrefix.textContent())
  // // Current Balance
  // const currentBalanceText = page.locator('span.Read_component__2DP8V > .Read_small__37DWT').first();
  // console.log(await currentBalanceText.textContent())
  // await page.pause()
  // // const actualCurrentBalance = parseFloat(currentBalanceText.replace(' LUNA', '').trim());
  // // expect(actualCurrentBalance).toBeCloseTo(564.908932, 1);

  // // 4. Initiate the Swap
  // await page.click('YOUR_SWAP_BUTTON_SELECTOR');

  // // 5. Post-Swap verification
  // // Wait for the swap to complete (this might include waiting for some confirmation or success message, etc.)
  // await page.waitForSelector('YOUR_SUCCESS_MESSAGE_SELECTOR');

  // // Check new balance
  // const postSwapBalanceText = await page.textContent('YOUR_CURRENT_BALANCE_SELECTOR');
  // const postSwapBalance = parseFloat(postSwapBalanceText.replace(' LUNA', '').trim());
  // expect(postSwapBalance).toBeCloseTo(563.905935, 1);
});
