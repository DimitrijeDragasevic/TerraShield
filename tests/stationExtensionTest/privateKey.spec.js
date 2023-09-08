import dotenv from 'dotenv';
dotenv.config();
const { test, expect } = require('../../playwright.config.js');

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm('Test wallet 1', 'Testtest123!',);
  await seedPage.verifyFirstWalletAdded();
});

test('Test import from private key option on station wallet extension', async ({ privateKeyPage }) => {
    await privateKeyPage.fillRecoverWalletFromPrivateKeyForm();
});

test('Test import from private key option on station wallet extension with invalid key', async ({ privateKeyPage}) => {
    await privateKeyPage.fillRecoverWalletFromPrivateKeyForm('123123awe');
    await privateKeyPage.verifyWrongPrivateKeyMessage()
});

test('Test import from private key option on station wallet extension with wrong password', async ({ privateKeyPage}) => {
    await privateKeyPage.fillRecoverWalletFromPrivateKeyForm(process.env.PRIVATE_KEY_TWO, '123qwer');
    await privateKeyPage.verifyWrongPassword()
});