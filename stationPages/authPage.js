import { HomePage } from "./homePage";
import dotenv from "dotenv";
dotenv.config();

const expect = require("@playwright/test").expect;
/**
 * Represents the Seed Page with functionalities to manage and interact with it.
 * Inherits properties and behaviors from HomePage.
 */

export class AuthPage extends HomePage {
  /**
   * Constructor initializes a new instance of the SeedPage class.
   * @param {Object} browserContext - The browser context in which the page operates.
   */
  constructor(browserContext) {
    super(browserContext);
    this.page = null;
    this.inputName = '[name="name"]';
    this.inputPassword = '[name="password"]';
    this.seedPassword = '[name="seedPassword"]';
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

  async createPage() {
    const pagePromise = this.getPageWithUrlPart("auth/recover");
    await this.goToManageWalletsMenu();
    await this.homePage.getByTestId(this.addWalletButton).click();
    await this.homePage.getByTestId(this.importWalletButton).click();
    this.page = await pagePromise;
  }

  /**
   * Handles the process of filling in the form to recover a wallet using a seed phrase.
   * Also handles the submission of the form and expects successful confirmation.
   * @param {string} walletName - Name for the new wallet.
   * @param {string} password - Password for the new wallet.
   * @param {string} seed - Seed phrase used to recover the wallet.
   */
  async fillPhraseForm(
    walletName,
    password,
    seed = process.env.SEED_PHRASE,
    enterPassword = true
  ) {
    await this.page.bringToFront();
    await this.page.reload();
    await this.page.waitForLoadState();
    await this.page.fill(this.inputName, walletName);

    await this.page.fill(this.inputMnemonicSeed, seed);
    await this.page.click(this.submitButton);

    await this.page.click(this.walletOptionBip330);

    await this.page.click(this.submitButton);

    if (enterPassword) {
      await this.page.fill(this.inputPassword, password);
      await this.page.fill(this.inputconfirmPassword, password);
      await this.page.click(this.submitButton);
    }

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

  async fillSeedForm(
    privateKey = process.env.PRIVATE_KEY,
    walletName,
    password = "Testtest123!",
    click = true
  ) {
    await this.page.reload();
    await this.page.bringToFront();
    await this.page.waitForLoadState();
    await this.page.fill(this.inputName, walletName);

    await this.page
      .getByRole("button", { name: "Seed Key", exact: true })
      .click();
    await this.page.fill(this.inputMnemonicSeed, privateKey);

    await this.page.fill(this.seedPassword, password);
    if (click) {
      await this.page.locator(this.submitButton).click();
    }
  }

  async veirfySuccess() {
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

  async verifyWrongPassword() {
    await expect(await this.page.getByText("Invalid password")).toBeVisible();
  }

  async verifyWrongPrivateKeyMessage() {
    await expect(await this.page.getByText("Invalid seed key")).toBeVisible();
  }
}
