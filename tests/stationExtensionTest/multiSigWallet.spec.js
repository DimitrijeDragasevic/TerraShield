import dotenv from "dotenv";
dotenv.config();
const { test, expect } = require("../../playwright.config.js");

test.beforeEach(async ({ seedPage }) => {
  await seedPage.fillSeedForm("Test wallet 1", "Testtest123!");
  await seedPage.verifyFirstWalletAdded();
});

test("Create mutisig wallet on station wallet extension", async ({
  multisigPage,
}) => {
  const addresses = [
    "terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs",
    "terra10detxcnq49r3nnze7zuqprl7yqdh34fulqtakw",
  ];
  await multisigPage.createMutliSigWallet(addresses, "2");
});
