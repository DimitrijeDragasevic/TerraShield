import dotenv from 'dotenv';
dotenv.config();
const { test, expect } = require('../../playwright.config.js');

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm('Test wallet 1', 'Testtest123!',);
  await seedPage.verifyFirstWalletAdded();
});
// THESE NEED TO ADAPTED
// test('Evaluate main page', async ({homePage}) => {
//     await homePage.evaluateMainPage()
// });

// test('Evaluate settings functionality', async ({homePage}) => {
//     await homePage.evaluateSettings()
// });

// test('Evaluate manage assets functionality', async ({homePage}) => {
//     await homePage.evaluateManageAssets()
// });

// test('Evaluate manage wallet functionality', async ({homePage}) => {
//     await homePage.evaluateManageWallet()
// });