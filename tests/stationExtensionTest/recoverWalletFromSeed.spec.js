import dotenv from 'dotenv';
dotenv.config();
const { test, expect } = require('../../playwright.config.js');

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm('Test wallet 1', 'Testtest123!',);
  await seedPage.verifyFirstWalletAdded();
});

test('Test happy flow recover wallet from seed', async ({ seedPage }) => {
    await seedPage.navigateToFillSeedFrom();
    await seedPage.fillSeedForm('Test wallet 2', 'Testtest123!', process.env.SEED_PHRASE_TWO);
});