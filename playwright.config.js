// @ts-check
import dotenv from "dotenv";
import { defineConfig, devices, expect, chromium, test as baseTest } from "@playwright/test";
import { PageFactory } from "./stationPages/pageFactory";

dotenv.config();

const pathToExtension = process.env.STATION_PATH;
const defaultViewport = { width: 1280, height: 1024 };
const mobileViewport =  { width: 414, height: 896 }; // Requested Iphone XR size


const test = baseTest.extend({
  context: async ({}, use) => {

    const isMobile = process.env.IS_MOBILE === 'true';
    const viewport = isMobile ? mobileViewport : defaultViewport;
    
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--headless=new`,
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      viewport: viewport,
      baseURL: process.env.BASE_URL,
    });
    await context.waitForEvent("serviceworker");
    await use(context);
    await context.close();
  },
  pageFactory: async ({ context }, use) => {
    const pageFactory = new PageFactory(context);
    await use(pageFactory);
  },
  authPage: async ({ pageFactory }, use) => {
    const authPage = await pageFactory.createPage("auth");
    await use(authPage);
  },
  entryPage: async ({ pageFactory }, use) => {
    const entryPage = await pageFactory.createPage("entry");
    await use(entryPage);
  },
  newWalletPage: async ({ pageFactory }, use) => {
    const newWalletPage = await pageFactory.createPage("newWallet");
    await use(newWalletPage);
  },
  multisigPage: async ({ pageFactory }, use) => {
    const multisigPage = await pageFactory.createPage("multi");
    await use(multisigPage);
  },
  ledgerPage: async ({ pageFactory }, use) => {
    const ledgerPage = await pageFactory.createPage("ledger");
    await use(ledgerPage);
  },
  homePage: async ({ pageFactory }, use) => {
    const homePage = await pageFactory.createPage("home");
    await use(homePage);
  },
});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // timeout: 5 * 60 * 1000,
  use: {
    trace: "on-first-retry",
  },
});

export {
  test,
  expect
};
