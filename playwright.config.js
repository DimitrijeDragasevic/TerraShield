// @ts-check
const path = require('path');
const { defineConfig, devices, expect, chromium } = require('@playwright/test');
const base = require('@playwright/test');
const PageFactory = require('./pages/pageFactory')


const test = base.test.extend({
  context: async ({}, use) => {
    const pathToExtension ='/Users/dimitrijedragasevic/Desktop/projects/station-extension/build';
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
      viewport: { width: 1920, height: 1080 },
      baseURL: "https://station.terra.money/"
    });
    await context.waitForEvent('serviceworker');
    await use(context);
    await context.close();
  },
  pageFactory: async ({ context }, use) => {
    const pageFactory = new PageFactory(context);
    await use(pageFactory);
  },
  seedPage: async ({ pageFactory }, use) => {
    const seedPage =  await pageFactory.createPage('seed')
    await use(seedPage)
  },
  newWalletPage: async ({ pageFactory }, use) => {
    const newWalletPage =  await pageFactory.createPage('newWallet')
    await use(newWalletPage)
  },
  multisigPage: async ({ pageFactory }, use) => {
    const multisigPage =  await pageFactory.createPage('multi')
    await use(multisigPage)
  },
  ledgerPage: async ({pageFactory}, use) => {
    const ledgerPage =  await pageFactory.createPage('ledger')
    await use(ledgerPage)
  },
  homePage: async ({pageFactory}, use) => {
    const homePage =  await pageFactory.createPage('home')
    await use(homePage)
  },
  privateKeyPage: async ({pageFactory}, use) => {
    const privateKeyPage =  await pageFactory.createPage('privateKey')
    await use(privateKeyPage)
  },
});

const config = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // or 'chrome-beta'
    },
    // Add more configurations as needed...
  ],
});

module.exports = {
  test,
  expect,
  config
};
