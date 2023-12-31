const expect = require('@playwright/test').expect;

/**
 * Represents the HomePage, which serves as the main landing page for users.
 * It provides functionalities to initialize, assign, and interact with the home page.
 */
class HomePage {
  constructor(browserContext) {
    this.browserContext = browserContext;
    this.homePage = null;
    
  }

  async initialize() {
    await this.assignStartPage();
  }

  async assignStartPage() {
    const stationExtensionUrl = await this.findStationExtensionUrl();
    
    this.homePage = await this.findExistingHomePage(stationExtensionUrl);
    
    if (!this.homePage) {
      this.homePage = await this.createHomePage(stationExtensionUrl);
    }
  }

  async findStationExtensionUrl() {
    const serviceWorkers = await this.browserContext.serviceWorkers();
    
    const worker = serviceWorkers.find(w => w._initializer.url.includes('background.js'));
    if (worker) {
      return worker._initializer.url.replace('background.js', 'index.html#/');
    }

    throw new Error('Unable to find station extension URL.');
  }

  async findExistingHomePage(stationExtensionUrl) {
    const pages = await this.browserContext.pages();

    const existingPage = pages.find(page => page.url().includes('index.html'));
    if (existingPage) {
      return existingPage;
    }
    
    return null;
  }

  async createHomePage(stationExtensionUrl) {
    const blankPage = await this.browserContext.newPage();
    await blankPage.goto(stationExtensionUrl);
    return blankPage;
  }

  async getPageWithUrlPart(urlPart) {
    return new Promise(resolve => {
      const handler = newPage => {
        if (newPage.url().includes(urlPart)) {
          this.browserContext.off('page', handler); // Remove listener after page is found
          resolve(newPage);
        }
      };
      this.browserContext.on('page', handler);
    });
  }

  async getButtonByText(page, text) {
    return await page.getByRole('button', { name: text, exact: true });
  }

  async verifyElementsManageWalletsForm() {
    await expect(await this.homePage.getByText('Manage Wallets')).toBeVisible();
    await expect(
      await this.getButtonByText(this.homePage, 'New wallet'),
    ).toBeVisible();
    await expect(
      await this.getButtonByText(this.homePage, 'Import from seed phrase'),
    ).toBeVisible();
    await expect(
      await this.getButtonByText(this.homePage, 'Import from private key'),
    ).toBeVisible();
    await expect(
      await this.getButtonByText(this.homePage, 'New multisig wallet'),
    ).toBeVisible();
    await expect(
      await this.getButtonByText(this.homePage, 'Access with ledger'),
    ).toBeVisible();
  }

  async connectWallet(){
    await this.homePage.reload()
    await this.homePage.bringToFront();
    await this.homePage.getByRole('button', { name: 'Connect' }).click();
  }
  async approveTransaction(password = 'Testtest123!') {
    await this.homePage.reload();
    await this.homePage.bringToFront();
    await this.homePage.getByRole('textbox').fill(password);
    await this.homePage.getByRole('button', { name: 'Post' }).click();
  }

  async goToManageWalletsMenuFromHome() {
    await this.homePage.bringToFront();
    await this.homePage.reload();
    await this.expectButton('Test wallet 1', 'name');
    await expect(await this.homePage.getByText('Manage Wallets')).toBeVisible();
    await this.homePage.getByRole('button', { name: 'Add a wallet' }).click();
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
    role = 'button',
    click = true,
    page = this.homePage,
  ) {
    this.homePage.bringToFront();
    // Assign button using buttonText based on type supplied.
    let button;
    if (type === 'name') {
      button = await page.getByRole(role, { name: buttonText });
    } else if (type === 'id') {
      button = await page.getByTestId(buttonText);
    } else if (type === 'element') {
      button = await page
        .locator('div')
        .filter({ hasText: buttonText })
        .getByRole(role);
    } else if (type === 'asset') {
      button = await page
        .getByRole('listitem')
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
  async userInput(text, xpath = '', page = this.homePage) {
    if (xpath) {
      await page.locator(xpath).fill(text);
    } else {
      await page.getByRole('textbox').fill(text);
    }
  }

  /**
   * Mimics a user submitting a transaction.
   *
   * @param {boolean} enabled Whether or not the Submit button is expected
   * to be enabled.
   */
  async userSubmit(enabled = true, page = this.homePage) {
    const submitButton = await page.getByRole('button', {
      name: 'Submit',
    });

    if (enabled) {
      await submitButton.click();
    } else {
      await expect(submitButton).toHaveAttribute('disabled', '');
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
    page = this.homePage,
  ) {
    let textComponent;
    if (heading) {
      textComponent = await page
        .getByRole('heading', {
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
      await this.expectButton('CloseIcon', 'id');
    }
  }

  // Ensures main page is loaded with all relevant elements.
  async evaluateMainPage(page = this.homePage, buttonName = 'Test wallet 1') {
    /* --------------------------------- Buttons -------------------------------- */
    this.homePage.reload();

    const buttons = {
      walletButton: {
        buttonText: buttonName,
        type: 'name',
      },
      settingsButton: {
        buttonText: 'SettingsIcon',
        type: 'id',
      },
      sendButton: {
        buttonText: /^Send$/,
        type: 'element',
      },
      receiveButton: {
        buttonText: /^Receive$/,
        type: 'element',
      },
      buyButton: {
        buttonText: /^Buy$/,
        type: 'element',
      },
      manageButton: {
        buttonText: 'Manage',
        type: 'name',
      },
    };

    for (const button in buttons) {
      const attributes = buttons[button];
      await this.expectButton(
        attributes.buttonText,
        attributes.type,
        'button',
        false,
        page,
      );
    }

    /* ------------------------------ Text Elements ----------------------------- */

    for (const text of [
      'Portfolio value',
      /\$ [\d]{1,5}\.[\d]{2}/,
      'Send',
      'Receive',
      'Buy',
      'Assets',
    ]) {
      await this.expectText(text, false, false, false, page);
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
      await this.expectButton('SettingsIcon', 'id');
    }

    await this.expectButton(buttonText, 'name');

    if (close) {
      await this.expectButton('CloseIcon', 'id');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Settings                                  */
  /* -------------------------------------------------------------------------- */

  // Evaluates settings and ensures proper functionality.
  async evaluateSettings() {
    
    /* ---------------------------- Network Settings ---------------------------- */
    // Ensure the network settings button is visible and click.
    await this.homePage.reload()
    await this.selectSettings('Network Mainnet');

    // Change to Testnet and ensure TESTNET banner is visible.
    await this.selectSettings('Testnets', false);
    await this.expectText('TESTNET');

    // Change to Classic and ensure CLASSIC banner is visible.
    await this.selectSettings('Network Testnet');
    await this.selectSettings('Terra Classic', false);
    await this.expectText('CLASSIC');

    // Change back to Mainnet.
    await this.selectSettings('Network Classic');
    await this.selectSettings('Mainnets', false);
    /* ---------------------------- Language Settings --------------------------- */

    // Ensure the language settings button is visible and click.
    await this.selectSettings('Language English');

    // Change to Spanish and ensure Spanish translated receive text.
    await this.selectSettings('Español', false, true);
    await this.expectText('Reciba');

    // Change to Mandarin and ensure Mandarin translated buy text.
    await this.selectSettings('Idioma Español');
    await this.selectSettings('中文', false, true);
    await this.expectText('购买');

    // Change back to English.
    await this.selectSettings('语言 中文');
    await this.selectSettings('English', false, true);

    /* ---------------------------- Currency Settings --------------------------- */

    // Ensure the currency settings button is visible and click.
    await this.selectSettings('Currency USD');

    // Ensure search and select functionality.
    await this.userInput('JPY');
    await this.selectSettings('¥ - Japanese Yen', false, true);
    await this.expectText('¥ —');

    // Change back to USD.
    await this.selectSettings('Currency JPY');
    await this.userInput('USD');
    await this.selectSettings('$ - United States Dollar', false, true);
    await this.expectText('$ —');

    /* ----------------------------- Theme Settings ----------------------------- */

    // Ensure the theme settings button is visible and click.
    await this.selectSettings('Theme Dark');

    // Attempt to change to all available themes.
    for (const theme of ['Blossom', 'Light', 'Madness', 'Moon', 'Whale']) {
      await this.expectText(theme, true);
    }

    // Change back to Dark theme and close out of settings.
    await this.expectText('Dark', true, true);

    /* ---------------------------- Advanced Settings --------------------------- */

    // Ensure the advanced settings button is visible and click.
    await this.selectSettings('Advanced');

    // Click into the LUNA asset and ensure uluna is available for copy.
    await this.expectText('Developer Mode', true, true);
    await this.expectText(/^LUNA \d+$/, true, false, true);
    await this.expectText('uluna');
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
  async selectManage(linkText, initialize = true, role = 'link') {
    if (initialize) {
      await this.expectButton('Test wallet 1', 'name');
      await this.expectButton(
        'Test wallet 1 terra1...6cw6qmfdnl9un23yxs',
        'name',
      );
    }

    await this.expectButton(linkText, 'name', role);
  }

  // Evaluates manage wallet options and ensures proper functionality.
  async evaluateManageWallet() {
    /* ------------------------------ Export Wallet ----------------------------- */
    await this.homePage.reload()
    // Ensure the Export wallet link is visible and click.
    
    await this.selectManage('Export wallet');

    // Ensure error upon incorrect password entry.
    await this.userInput('wrong password');
    await this.expectText('Incorrect password');

    // Ensure correct password entry results in QR code display.
    await this.userInput('Testtest123!');
    await this.userSubmit();
    await this.expectText('QR code', false, true, true);

    // Evaluate Private key functionality.
    await this.expectText('Private key', true);

    // Ensure correct password entry results in private key display.
    await this.userInput('Testtest123!');
    await this.userSubmit();
    await this.expectText('Private Key', false, true, true);

    /* ----------------------------- Change Password ---------------------------- */

    // Ensure the Change password link is visible and click.
    await this.selectManage('Change password');

    // Ensure incorrect password error if wrong password entered.
    await this.userInput('wrong password', 'input[name="current"]');
    await this.expectText('Incorrect password');

    // Ensure short password error if not longer than 10 chars.
    await this.userInput('new', 'input[name="password"]');
    await this.expectText('Password must be longer than 10 characters');

    // Ensure password match error when new passwords mismatch.
    await this.userInput('newpassword', 'input[name="password"]');
    await this.userInput('newpass', 'input[name="confirm"]');
    await this.expectText('Password does not match');

    // Allow password change if all criteria pass.
    await this.userInput('Testtest123!', 'input[name="current"]');
    await this.userInput('newpassword', 'input[name="password"]');
    await this.userInput('newpassword', 'input[name="confirm"]');
    await this.userSubmit();
    await this.expectButton('Confirm', 'name');

    /* ------------------------------- Lock Wallet ------------------------------ */

    // Ensure the Lock wallet button is visible and click.
    await this.selectManage('Lock', true, 'button');

    // Expect submit to be disabled if user enters wrong password.
    await this.selectManage('Test wallet 1', false);
    await this.userInput('wrong password');
    await this.userSubmit(false);

    // Ensure user can unlock wallet with new password.
    await this.userInput('newpassword');
    await this.userSubmit();

    /* ------------------------------ Delete Wallet ----------------------------- */

    // Ensure the Delete wallet link is visible and click.
    await this.selectManage('Delete wallet');

    // Expect submit to be disabled upon wrong wallet name input.
    await this.userInput('Wrong name 1');
    await this.userSubmit(false);

    // Expect user to be able to delete wallet when correct wallet name inputted.
    await this.userInput('Test wallet 1');
    await this.userSubmit();
    await this.expectButton('Confirm', 'name');
    await this.expectText('Connect to Station');
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
    for (const action of ['check', 'uncheck']) {
      // Open the asset management modal.
      await this.expectButton('Manage', 'name');

      if (
        filter === 'Hide non-whitelisted' &&
        this.homePage.isVisible(`text='${filteredAsset}'`)
      ) {
        // Evaluate if Hide non-whitelisted filter filters specified asset.
        await this.expectText(filter, true, true);
        const nonWhitelistedToken = await this.homePage
          .getByText(filteredAsset)
          .first();
        if (action === 'check') {
          await expect(nonWhitelistedToken).toBeVisible();
        } else {
          await expect(nonWhitelistedToken).not.toBeVisible();
        }
      } else if (
        filter === 'Hide low-balance' &&
        this.homePage.isVisible(`text='${filteredAsset}'`)
      ) {
        // Evaluate if Hide low-balance filter filters specified asset.
        await this.expectText(filter, true, true);
        const lowBalanceToken = await this.homePage
          .getByText(filteredAsset)
          .first();
        if (action === 'check') {
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
    for (const action of ['check', 'uncheck']) {
      // Open the asset management modal.
      await this.expectButton('Manage', 'name');

      // Click asset and close out of asset management modal.
      await this.userInput(asset);
      await this.expectButton(asset, 'asset');
      await this.expectButton('CloseIcon', 'id');

      // Evaluate if asset is properly added or removed from the asset list.
      const assetItem = await this.homePage.getByRole('article').filter({
        hasText: new RegExp(`^${asset}.*?${asset}$`),
      });
      if (action === 'check') {
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
    const unavailableAssets = ['AKT', 'BNB', 'DOT'];
    // Evaluate selection of unavailable assets in manage assets.
    for (const unavailableAsset of unavailableAssets) {
      await this.evaluateAsset(unavailableAsset);
    }

    /* ------------------------------ Apply Filters ----------------------------- */

    // Evaluate the application of asset management filters.
    await this.evaluateFilter('Hide non-whitelisted', 'ATOM-OSMO LP');
    await this.evaluateFilter('Hide low-balance', 'NTRN');
  }

    /**
   * Switches to a specified network.
   *
   * @param {string} network The name of the network to switch to (e.g., 'Mainnet', 'Testnet', 'Classic').
   */
  async switchNetwork(network) {
    switch (network) {
      case 'Mainnet':
        await this.homePage.reload();
        await this.selectSettings('Network Mainnet');
        await this.selectSettings('Mainnets', false);
        break;

      case 'Testnet':
        await this.homePage.reload();
        await this.selectSettings('Network Mainnet');  // Assumes starting from 'Network Mainnet'
        await this.selectSettings('Testnets', false);
        await this.expectText('TESTNET');
        break;

      case 'Classic':
        await this.homePage.reload();
        await this.selectSettings('Network Testnet');  // Assumes transition from 'Network Testnet'
        await this.selectSettings('Terra Classic', false);
        await this.expectText('CLASSIC');
        break;

      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  } 
}

module.exports = HomePage;
