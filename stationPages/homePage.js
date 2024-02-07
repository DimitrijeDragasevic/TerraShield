import { errors } from "@playwright/test";

const expect = require("@playwright/test").expect;

/**
 * Represents the HomePage, which serves as the main landing page for users.
 * It provides functionalities to initialize, assign, and interact with the home page.
 */
export class HomePage {
  constructor(browserContext) {
    this.browserContext = browserContext;
    this.homePage = null;
    this.mainContainer = "main-container";
    this.tabsContainer = "tabs-container";
    this.listContainer = "list-container";
    this.submitButton = '[type="submit"]';
    this.inputPassword = '[type="password"]';
    this.sendButton = "wallet-action-button-0";
    this.swapButton = "wallet-action-button-1";
    this.receiveButton = "wallet-action-button-2";
    this.buyButton = "wallet-action-button-3";
    this.manageWalletButton = "manage-wallets-button";
    this.addWalletButton = "add-wallet-button";
    this.assetListFilterButton = "assetlist-filter-icon";
    this.assetListFilterInputButton = "assetlist-filter-input";
    this.assetListClearFilterButton = "assetlist-clear-filter-button";
    this.settingsButton = "settings-button";
    this.closeButton = "close-button";
    this.dashboardButton = "dashboard-button";
    this.newWalletButton = "button-item-0";
    this.importWalletButton = "button-item-1";
    this.newMultiSigWalletButon = "button-item-2";
    this.acceswithLedgerButton = "button-item-3";
    this.mainNet = "radio-list-item-0";
    this.testNet = "radio-list-item-1";
    this.terraClassic = "radio-list-item-2";
    this.localTerra = "radio-list-item-3";
  }

  async initialize() {
    await this.assignStartPage();
  }

  async assignStartPage() {
    const stationExtensionUrl = await this.findStationExtensionUrl();

    if (!this.homePage) {
      this.homePage = await this.createHomePage(stationExtensionUrl);
    } else {
      this.homePage = await this.findExistingHomePage();
    }
  }

  async findStationExtensionUrl() {
    const serviceWorkers = await this.browserContext.serviceWorkers();

    const worker = serviceWorkers.find((w) =>
      w._initializer.url.includes("background.js")
    );
    if (worker) {
      return worker._initializer.url.replace("background.js", "index.html#/");
    }

    throw new Error("Unable to find station extension URL.");
  }

  async findExistingHomePage() {
    const pages = await this.browserContext.pages();
    let firstFoundPage = null;

    for (const page of pages) {
      if (page.url().endsWith("index.html")) {
        if (firstFoundPage === null) {
          // Keep the first page that matches.
          firstFoundPage = page;
        } else {
          // Close other pages that also match.
          await page.close();
        }
      }
    }
    return firstFoundPage; // This will be null if no matching pages were found
  }

  async createHomePage(stationExtensionUrl) {
    const blankPage = await this.browserContext.newPage();
    await blankPage.goto(stationExtensionUrl);
    return blankPage;
  }

  async getPageWithUrlPart(urlPart) {
    return new Promise((resolve) => {
      const handler = (newPage) => {
        if (newPage.url().includes(urlPart)) {
          this.browserContext.off("page", handler); // Remove listener after page is found
          resolve(newPage);
        }
      };
      this.browserContext.on("page", handler);
    });
  }

  async verifyElementsManageWalletsForm() {
    await this.homePage.getByTestId(this.addWalletButton).click();
    await expect(
      await this.homePage.getByTestId(this.newWalletButton)
    ).toBeVisible();
    await expect(
      await this.homePage.getByTestId(this.importWalletButton)
    ).toBeVisible();
    await expect(
      await this.homePage.getByTestId(this.newMultiSigWalletButon)
    ).toBeVisible();
    await expect(
      await this.homePage.getByTestId(this.acceswithLedgerButton)
    ).toBeVisible();
  }

  async verifyElements(walletName = null) {
    await expect(this.homePage.getByTestId(this.sendButton)).toBeVisible();
    await expect(this.homePage.getByTestId(this.swapButton)).toBeVisible();
    await expect(this.homePage.getByTestId(this.receiveButton)).toBeVisible();
    await expect(this.homePage.getByTestId(this.buyButton)).toBeVisible();
    await expect(
      this.homePage.getByTestId(this.manageWalletButton)
    ).toBeVisible();

    if (walletName) {
      const name = await this.homePage
        .locator(`[data-testid="${this.manageWalletButton}"]`)
        .textContent();
      if (walletName !== name.trim()) {
        throw new Error(
          `Wallet name does not match the assigned, \ntest wallet name : "${walletName}"\nname:"${name}" `
        );
      }
    }
    await expect(
      this.homePage.getByTestId(this.assetListFilterButton)
    ).toBeVisible();

    await expect(this.homePage.getByTestId(this.listContainer)).toBeVisible();
    await expect(this.homePage.getByTestId(this.mainContainer)).toBeVisible();
    await expect(this.homePage.getByTestId(this.tabsContainer)).toBeVisible();
    await expect(this.homePage.getByTestId(this.settingsButton)).toBeVisible();
    await expect(
      this.homePage.getByTestId(this.dashboardButton).first()
    ).toBeVisible();
  }

  async verifyWallet(walletName) {
    await this.homePage.bringToFront();
    await this.homePage.getByTestId(this.manageWalletButton).click();
    await expect(
      this.homePage.getByRole("heading", { name: walletName })
    ).toBeVisible();
    await this.homePage.getByRole("heading", { name: walletName }).click();
  }

  async enterPassword(password = "Testtest123!") {
    await this.homePage.reload();
    await this.homePage.bringToFront();
    await this.homePage.fill(this.inputPassword, password);
    await this.homePage.click(this.submitButton);
  }

  async connectWallet() {
    await this.homePage.reload();
    await this.homePage.bringToFront();
    await this.homePage.getByRole("button", { name: "Connect" }).click();
  }
  
  async approveTransaction(password = "Testtest123!") {
    await this.homePage.bringToFront();
  
    let postButton;
    while (!postButton) {
      await this.homePage.reload();
      // Use a short wait to allow the page to load
      await this.homePage.waitForTimeout(1000); 
      try {
        postButton = await this.homePage.getByRole("button", { name: "Post" });
      } catch (e) {
        // If the button is not found, postButton remains undefined
        // and the loop will continue
      }
    }
  
    // Click the button once it's found
    if (postButton) {
      await postButton.click();
    }
  }
  
  
  

  async goToManageWalletsMenu() {
    await this.homePage.reload();
    await this.homePage.bringToFront();
    await this.homePage.getByTestId(this.manageWalletButton).click();
  }
  /**
   * A function to expect and click a button if specified to test functionality.
   *
   * @param {string} buttonText The name, text, asset, or test ID associated with
   * the button.
   * @param {string} type The type of buttonText supplied to the function.
   * @param {string} role The role of the button element (button, link, etc.).
   * @param {boolean} click Whether or not to click the button.
   */
  async expectButton(
    buttonText,
    type,
    role = "button",
    click = true,
    page = this.homePage
  ) {
    this.homePage.bringToFront();
    // Assign button using buttonText based on type supplied.
    let button;
    if (type === "name") {
      button = await page.getByRole(role, { name: buttonText });
    } else if (type === "id") {
      button = await page.getByTestId(buttonText);
    } else if (type === "element") {
      button = await page
        .locator("div")
        .filter({ hasText: buttonText })
        .getByRole(role);
    } else if (type === "asset") {
      button = await page
        .getByRole("listitem")
        .filter({
          hasText: new RegExp(`^${buttonText}`),
        })
        .getByRole(role);
    }
    await expect(button).toBeVisible();

    if (click) {
      await button.click();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Utility Functions                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Mimics a user typing text into a text box.
   *
   * @param {string} text The text to input inside of the desired text box.
   * @param {string} xpath The xpath which corresponds to the desired text box.
   */
  async userInput(text, xpath = "", page = this.homePage) {
    if (xpath) {
      await page.locator(xpath).fill(text);
    } else {
      await page.getByRole("textbox").fill(text);
    }
  }

  /**
   * Mimics a user submitting a transaction.
   *
   * @param {boolean} enabled Whether or not the Submit button is expected
   * to be enabled.
   */
  async userSubmit(enabled = true, page = this.homePage, name = "Submit") {
    const submitButton = await page.getByRole("button", {
      name: name,
    });

    if (enabled) {
      await submitButton.click();
    } else {
      await expect(submitButton).toHaveAttribute("disabled", "");
    }
  }

  /**
   * Ensures text is in document, clicks text option, and closes modal.
   *
   * @param {string} text The text to find in the document.
   * @param {boolean} click Whether or not to click the text option.
   * @param {boolean} close Whether or not to close out of the settings modal.
   * @param {boolean} heading Whether or not the text has a heading role.
   */
  async expectText(
    text,
    click = false,
    close = false,
    heading = false,
    page = this.homePage
  ) {
    let textComponent;
    if (heading) {
      textComponent = await page
        .getByRole("heading", {
          name: text,
        })
        .first();
    } else {
      textComponent = await page
        .getByText(text, {
          exact: true,
        })
        .first();
    }

    await expect(textComponent).toBeVisible();

    if (click) {
      await textComponent.click();
    }

    if (close) {
      await this.expectButton("CloseIcon", "id");
    }
  }

  /**
   * Opens settings, selects desired option, and closes modal.
   *
   * @param {string} buttonText The name or text available on the button to click.
   * @param {boolean} initialize Whether or not to open the settings from the main page.
   * @param {boolean} close Whether or not to close out of the settings modal.
   */
  async selectSettings(buttonText, initialize = true, close = false) {
    if (initialize) {
      await this.expectButton(this.settingsButton, "id");
    }

    await this.expectButton(buttonText, "name");

    if (close) {
      await this.expectButton(this.closeButton, "id");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Settings                                  */
  /* -------------------------------------------------------------------------- */

  // Evaluates settings and ensures proper functionality.
  async evaluateSettings() {
    /* ---------------------------- Network Settings ---------------------------- */
    // Ensure the network settings button is visible and click.
    await this.homePage.reload();
    await this.selectSettings("Network Mainnet");

    // Change to Testnet and ensure TESTNET banner is visible.
    await this.selectSettings(this.testNet, false);
    await this.expectText("Testnets");

    // Change to Classic and ensure CLASSIC banner is visible.
    await this.selectSettings("Network Testnet");
    await this.selectSettings("Terra Classic", false);
    await this.expectText("CLASSIC");

    // Change back to Mainnet.
    await this.selectSettings("Network Classic");
    await this.selectSettings("Mainnets", false);
    /* ---------------------------- Language Settings --------------------------- */

    // Ensure the language settings button is visible and click.
    await this.selectSettings("Language English");

    // Change to Spanish and ensure Spanish translated receive text.
    await this.selectSettings("Español", false, true);
    await this.expectText("Reciba");

    // Change to Mandarin and ensure Mandarin translated buy text.
    await this.selectSettings("Idioma Español");
    await this.selectSettings("中文", false, true);
    await this.expectText("购买");

    // Change back to English.
    await this.selectSettings("语言 中文");
    await this.selectSettings("English", false, true);

    /* ---------------------------- Currency Settings --------------------------- */

    // Ensure the currency settings button is visible and click.
    await this.selectSettings("Currency USD");

    // Ensure search and select functionality.
    await this.userInput("JPY");
    await this.selectSettings("¥ - Japanese Yen", false, true);
    await this.expectText("¥ —");

    // Change back to USD.
    await this.selectSettings("Currency JPY");
    await this.userInput("USD");
    await this.selectSettings("$ - United States Dollar", false, true);
    await this.expectText("$ —");

    /* ----------------------------- Theme Settings ----------------------------- */

    // Ensure the theme settings button is visible and click.
    await this.selectSettings("Theme Dark");

    // Attempt to change to all available themes.
    for (const theme of ["Blossom", "Light", "Madness", "Moon", "Whale"]) {
      await this.expectText(theme, true);
    }

    // Change back to Dark theme and close out of settings.
    await this.expectText("Dark", true, true);

    /* ---------------------------- Advanced Settings --------------------------- */

    // Ensure the advanced settings button is visible and click.
    await this.selectSettings("Advanced");

    // Click into the LUNA asset and ensure uluna is available for copy.
    await this.expectText("Developer Mode", true, true);
    await this.expectText(/^LUNA \d+$/, true, false, true);
    await this.expectText("uluna");
  }

  /* -------------------------------------------------------------------------- */
  /*                                Manage Wallet                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Opens manage wallet settings and selects desired option.
   *
   * @param {string} linkText The name or text available on the manage wallet link
   * to click.
   * @param {boolean} initialize Whether or not to open the manage wallet settings
   * from the main page.
   * @param {string} role The role of the component.
   */
  async selectManage(linkText, initialize = true, role = "link") {
    if (initialize) {
      await this.expectButton("Test wallet 1", "name");
      await this.expectButton(
        "Test wallet 1 terra1...6cw6qmfdnl9un23yxs",
        "name"
      );
    }

    await this.expectButton(linkText, "name", role);
  }

  // Evaluates manage wallet options and ensures proper functionality.
  async evaluateManageWallet() {
    /* ------------------------------ Export Wallet ----------------------------- */
    await this.homePage.reload();
    // Ensure the Export wallet link is visible and click.

    await this.selectManage("Export wallet");

    // Ensure error upon incorrect password entry.
    await this.userInput("wrong password");
    await this.expectText("Incorrect password");

    // Ensure correct password entry results in QR code display.
    await this.userInput("Testtest123!");
    await this.userSubmit();
    await this.expectText("QR code", false, true, true);

    // Evaluate Private key functionality.
    await this.expectText("Private key", true);

    // Ensure correct password entry results in private key display.
    await this.userInput("Testtest123!");
    await this.userSubmit();
    await this.expectText("Private Key", false, true, true);

    /* ----------------------------- Change Password ---------------------------- */

    // Ensure the Change password link is visible and click.
    await this.selectManage("Change password");

    // Ensure incorrect password error if wrong password entered.
    await this.userInput("wrong password", 'input[name="current"]');
    await this.expectText("Incorrect password");

    // Ensure short password error if not longer than 10 chars.
    await this.userInput("new", 'input[name="password"]');
    await this.expectText("Password must be longer than 10 characters");

    // Ensure password match error when new passwords mismatch.
    await this.userInput("newpassword", 'input[name="password"]');
    await this.userInput("newpass", 'input[name="confirm"]');
    await this.expectText("Password does not match");

    // Allow password change if all criteria pass.
    await this.userInput("Testtest123!", 'input[name="current"]');
    await this.userInput("newpassword", 'input[name="password"]');
    await this.userInput("newpassword", 'input[name="confirm"]');
    await this.userSubmit();
    await this.expectButton("Confirm", "name");

    /* ------------------------------- Lock Wallet ------------------------------ */

    // Ensure the Lock wallet button is visible and click.
    await this.selectManage("Lock", true, "button");

    // Expect submit to be disabled if user enters wrong password.
    await this.selectManage("Test wallet 1", false);
    await this.userInput("wrong password");
    await this.userSubmit(false);

    // Ensure user can unlock wallet with new password.
    await this.userInput("newpassword");
    await this.userSubmit();

    /* ------------------------------ Delete Wallet ----------------------------- */

    // Ensure the Delete wallet link is visible and click.
    await this.selectManage("Delete wallet");

    // Expect submit to be disabled upon wrong wallet name input.
    await this.userInput("Wrong name 1");
    await this.userSubmit(false);

    // Expect user to be able to delete wallet when correct wallet name inputted.
    await this.userInput("Test wallet 1");
    await this.userSubmit();
    await this.expectButton("Confirm", "name");
    await this.expectText("Connect to Station");
  }

  /* -------------------------------------------------------------------------- */
  /*                                Manage Assets                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Opens asset management modal, clicks desired filter, and evaluates resulting
   * asset list.
   *
   * @param {string} filter The asset management filter to click.
   * @param {string} filteredAsset The asset which is expected to be filtered out
   * of the asset list after applying the filter.
   */
  async evaluateFilter(filter, filteredAsset) {
    // Evaluate checking and unchecking the filter.
    for (const action of ["check", "uncheck"]) {
      // Open the asset management modal.
      await this.expectButton("Manage", "name");

      if (
        filter === "Hide non-whitelisted" &&
        this.homePage.isVisible(`text='${filteredAsset}'`)
      ) {
        // Evaluate if Hide non-whitelisted filter filters specified asset.
        await this.expectText(filter, true, true);
        const nonWhitelistedToken = await this.homePage
          .getByText(filteredAsset)
          .first();
        if (action === "check") {
          await expect(nonWhitelistedToken).toBeVisible();
        } else {
          await expect(nonWhitelistedToken).not.toBeVisible();
        }
      } else if (
        filter === "Hide low-balance" &&
        this.homePage.isVisible(`text='${filteredAsset}'`)
      ) {
        // Evaluate if Hide low-balance filter filters specified asset.
        await this.expectText(filter, true, true);
        const lowBalanceToken = await this.homePage
          .getByText(filteredAsset)
          .first();
        if (action === "check") {
          await expect(lowBalanceToken).toBeVisible();
        } else {
          await expect(lowBalanceToken).not.toBeVisible();
        }
      }
    }
  }

  /**
   * Opens asset management settings, clicks desired asset, and evaluates
   * resulting asset list.
   *
   * @param {string} asset The symbol of an asset unavailable in the active
   * wallet to include in the asset list.
   */
  async evaluateAsset(asset) {
    // Evaluate checking and unchecking the asset.
    for (const action of ["check", "uncheck"]) {
      // Open the asset management modal.
      await this.expectButton("Manage", "name");

      // Click asset and close out of asset management modal.
      await this.userInput(asset);
      await this.expectButton(asset, "asset");
      await this.expectButton("CloseIcon", "id");

      // Evaluate if asset is properly added or removed from the asset list.
      const assetItem = await this.homePage.getByRole("article").filter({
        hasText: new RegExp(`^${asset}.*?${asset}$`),
      });
      if (action === "check") {
        await expect(assetItem).toBeVisible();
      } else {
        await expect(assetItem).not.toBeVisible();
      }
    }
  }

  // Evaluates manage assets actions and ensures proper functionality.
  async evaluateManageAssets() {
    this.homePage.reload();
    /* --------------------------- Add / Remove Assets -------------------------- */
    const unavailableAssets = ["AKT", "BNB", "DOT"];
    // Evaluate selection of unavailable assets in manage assets.
    for (const unavailableAsset of unavailableAssets) {
      await this.evaluateAsset(unavailableAsset);
    }

    /* ------------------------------ Apply Filters ----------------------------- */

    // Evaluate the application of asset management filters.
    await this.evaluateFilter("Hide non-whitelisted", "ATOM-OSMO LP");
    await this.evaluateFilter("Hide low-balance", "NTRN");
  }

  /**
   * Switches to a specified network.
   *
   * @param {string} network The name of the network to switch to (e.g., 'Mainnet', 'Testnet', 'Classic').
   */
  async switchNetwork(network) {
    switch (network) {
      case "Mainnet":
        await this.homePage.reload();
        await this.selectSettings("Network Mainnet");
        await this.selectSettings("Mainnets", false);
        break;

      case "Testnet":
        await this.homePage.reload();
        await this.selectSettings("Network Mainnet"); // Assumes starting from 'Network Mainnet'
        await this.selectSettings("Testnets", false);
        await this.expectText("TESTNET");
        break;

      case "Classic":
        await this.homePage.reload();
        await this.selectSettings("Network Testnet"); // Assumes transition from 'Network Testnet'
        await this.selectSettings("Terra Classic", false);
        await this.expectText("CLASSIC");
        break;

      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }
}

// module.exports = HomePage;
