# TerraShield README 🛡️

## Project Overview 🌐

TerraShield is a cutting-edge automation testing framework designed exclusively for comprehensive end-to-end (e2e) testing of Terra applications. Our mission is to ensure the highest quality and reliability of Terra apps through meticulous testing processes.

### Supported Applications 📱💻

- **Station Web App**: A cornerstone for Terra's web-based interactions.
- **Station Extension**: Enhancing your browser with Terra's financial capabilities.
- **Enterprise DAO V2**: A new era for decentralized autonomous organizations on Terra.

### Supported Wallets 🏦

- **Station Wallet**: Fully supported for approving transactions and providing a complete suite of tests.

## Configuration Setup 🔧

To tailor TerraShield to your project's needs, create an `.env` file in the root directory and populate it with the following configurations:

```plaintext
SEED_PHRASE = "Seed phrase"
PRIVATE_KEY = "Private key"
PRIVATE_KEY_TWO = "Private key two"
BASE_URL = "https://dao.enterprise.money/" or "https://station.money/" # Choose based on your project's requirements or if you want to test something else (terra apps have tests premade)
IS_TESTNET = false || true
STATION_PATH = "path to station extension build folder"
PW_TEST_HTML_REPORT_OPEN = "always"
IS_MOBILE = false || true
```

## Building Station Extension

From the [Station Extension Repository](https://github.com/terra-money/station-extension):

1. **Clone Repository**
2. **Prepare for Build**: Remove `node_modules` and `build` folder.
3. **Install Dependencies**: `npm install`
4. **Edit Browser-Polyfill.js**: Comment out lines 25 to 27.
5. **Build Extension**: `npm run build`
6. **Place Built Extension**: Copy the `build` folder to TerraShield's root folder.

## Running Tests

After setup:

- **Playwright Commands**: Use Playwright commands to run specific tests. Example: `npx playwright test path/to/spec.js`.
- **Visual Studio Code Extension**: Utilize the Playwright Test for Visual Studio Code extension for an integrated testing experience.

## Contributing, License, and Contact

Refer to the project's guidelines for contributions, license details, and contact information.
