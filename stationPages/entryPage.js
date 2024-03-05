import { HomePage } from "./homePage";
import dotenv from "dotenv";
dotenv.config();
const expect = require("@playwright/test").expect;
/**
 * Represents the Seed Page with functionalities to manage and interact with it.
 * Inherits properties and behaviors from HomePage.
 */

export class EntryPage extends HomePage {
  /**
   * Constructor initializes a new instance of the SeedPage class.
   * @param {Object} browserContext - The browser context in which the page operates.
   */
  constructor(browserContext) {
    super(browserContext);
    this.page = null;
    this.inputName = '[name="name"]';
    this.inputconfirmPassword = '[name="confirm"]';
    this.inputMnemonicSeed = '[name="mnemonic"]';
    this.inputIndex = '[name="index"]';
    this.allDoneIcon = '[data-testid="DoneAllIcon"]';
    this.connectButton = '[type="button"]';
    this.walletOptionBip330 = '[ data-testid="details-section-330"]';
    this.manageWalletsCloseButton = '[class="Modal_close__2_zHW"]';
  }

  async initialize() {
    await this.assignStartPage();
    await this.createPage();
  }

  /**
   * Navigates to the "Import from seed phrase" page and sets up the page instance for it.
   */
  async createPage() {
    const pagePromise = this.getPageWithUrlPart("auth/recover");
    await this.removeDialog();
    await this.homePage
      .getByRole("button", { name: "Import existing wallet" })
      .click();
    this.page = await pagePromise;
  }

  /**
  * This has been added to handle the dialog popup in order for the tests to keep working
  * example: Changes from 28th of February
  */
  async removeDialog() {
    await expect(this.homePage.getByRole('dialog')).toBeVisible();
    await this.homePage.mouse.click(200, 0);
  }

  /**
   * Handles the process of filling in the form to recover a wallet using a seed phrase.
   * Also handles the submission of the form and expects successful confirmation.
   * @param {string} walletName - Name for the new wallet.
   * @param {string} password - Password for the new wallet.
   * @param {string} seed - Seed phrase used to recover the wallet.
   */
  async fillPhraseForm(walletName, password, seed = process.env.SEED_PHRASE) {
    
    await this.page.bringToFront();
    await this.page.waitForLoadState();
    await this.page.reload();
    await this.page.fill(this.inputName, walletName);

    await this.page.fill(this.inputMnemonicSeed, seed);
    await this.page.click(this.submitButton);

    await this.page.click(this.walletOptionBip330);

    await this.page.click(this.submitButton);
    await this.page.fill(this.inputPassword, password);
    await this.page.fill(this.inputconfirmPassword, password);
    await this.page.click(this.submitButton);
    await expect(
      await this.page.getByRole("heading", { name: "Success!" })
    ).toBeVisible();
    await expect(
      await this.page.getByRole("heading", { name: "The wallet was created" })
    ).toBeVisible();
    await expect(
        this.page.getByRole("button", {
        name: "Done",
        exact: true,
      })
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Done", exact: true }).click();
  }

  async fillSeedForm(walletName) {
    await this.page.bringToFront();
    await this.page.waitForLoadState();
    await this.page.fill(inputName, walletName);

    await this.page
      .getByRole("button", { name: "Seed Key", exact: true })
      .click();
    await this.page.fill(
      this.inputMnemonicSeed,
      (process.env.PRIVATE_KEY)
    );
    await this.page.fill(this.inputPassword, password);

    await this.page.locator(this.submitButton).click();

    await expect(
      await this.page.getByRole("heading", { name: "Success!" })
    ).toBeVisible();
    await expect(
      await this.page.getByRole("heading", { name: "The wallet was created" })
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", {
        name: "Done",
        exact: true,
      })
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Done", exact: true }).click();
  }

}

