// @ts-check
import dotenv from "dotenv";
import { defineConfig, devices, expect, chromium, test as baseTest } from "@playwright/test";
import { PageFactory } from "./stationPages/pageFactory";

dotenv.config();

const test = baseTest.extend({
  context: async ({}, use) => {
    const pathToExtension = process.env.STATION_PATH;
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      viewport: { width: 1280, height: 1024 },
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
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" }, // or 'chrome-beta'
    },
    
  ],
});

export {
  test,
  expect
};
