import { HomePage, manageWalletButton } from "./homePage";

const expect = require("@playwright/test").expect;
const inputName = '[name="name"]';
const inputPassword = '[name="password"]';
const inputconfirmPassword = '[name="confirm"]';
const mnemonicText = '[class="TextArea_textarea__2a4Ez"]';
const checkBox = '[class="Checkbox-module__track___6PRR3"]';
const submitButton = '[type="submit"]';
const mnemonicNumber = '[class="Form_label__bOv6h"]';

/**
 * NewWalletPage extends HomePage and represents operations specific to the "New Wallet" page.
 */

export class NewWalletPage extends HomePage {
  constructor(browserContext) {
    super(browserContext);
    this.page = null;
  }

  async initialize() {
    await this.assignStartPage();
    await this.createPage();
  }

  /**
   * Navigates to the "New Wallet" page and sets up a page instance for it
   */
  async createPage() {
    const pagePromise = this.getPageWithUrlPart("auth/new");
    await this.homePage.getByTestId(this.manageWalletButton).click();
    await this.homePage.getByTestId(this.addWalletButton).click();
    await this.homePage.getByTestId(this.newWalletButton).click();
    this.page = await pagePromise;
    this.page.waitForURL();
    this.page.reload();
  }

  /**
   * Fills out the create wallet form and progresses through wallet creation process
   *
   * @param {string} walletName - Name for the new wallet
   * @param {string} password - Password for the new wallet (defaults to 'Testtest123!')
   */
  async createWallet(walletName, password = "Testtest123!") {
    await this.page.fill(createWalletElements.inputName, walletName);
    const mnemonicText = await this.page.textContent(
      createWalletElements.mnemonicText
    );
    const arrayMnemonic = mnemonicText.split(" ");
    await this.page.check(createWalletElements.checkBox);
    await this.page.click(createWalletElements.submitButton);

    await this.page.waitForURL("**/new#2");
    const firtNumberString = await this.page
      .getByText(/\b([1-9]|1[0-9]|2[0-4])\w{0,2} word\b/)
      .first()
      .textContent();
    const secondNumberString = await this.page
      .getByText(/\b([1-9]|1[0-9]|2[0-4])\w{0,2} word\b/)
      .last()
      .textContent();

    const firstNumber = this.getNFromNthWord(firtNumberString);
    const secondNumber = this.getNFromNthWord(secondNumberString);

    await this.page
      .getByRole("button", { name: arrayMnemonic[firstNumber - 1] })
      .first()
      .click();
    await this.page
      .getByRole("button", { name: arrayMnemonic[secondNumber - 1] })
      .last()
      .click();
    await this.page.click(createWalletElements.submitButton);

    await this.page.waitForURL("**/new#4");
    await expect(
      this.page.getByRole("button", {
        name: "Done",
        exact: true,
      })
    ).toBeVisible();
    await this.page.getByRole("button", { name: "Done", exact: true }).click();
  }
  /**
   * Extracts a number from an input string of format "Nth word"
   *
   * @param {string} inputString - The input string containing the number to be extracted
   * @returns {number|null} - Returns the extracted number, or null if not found
   */
  getNFromNthWord(inputString) {
    const match = inputString.match(/(\d+)\w{0,2} word/);
    return match ? parseInt(match[1]) : null;
  }
}

const createWalletElements = {
  inputName,
  inputPassword,
  inputconfirmPassword,
  mnemonicText,
  checkBox,
  submitButton,
  mnemonicNumber,
};

module.exports = {
  NewWalletPage,
  createWalletElements,
};
