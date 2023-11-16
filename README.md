# TerraShield README

## Project Overview
TerraShield is an automation testing framework specifically crafted for end-to-end (e2e) testing of Terra applications.

### Supported Apps
- Station Web App
- Station Extension
- Enterprise DAO V2

### Supported Wallets
- Station wallet

## Configuration
Create an `.env` file in the root directory with these variables:
- `SEED_PHRASE`: "Seed phrase of the QA periodic vesting wallet"
- `PRIVATE_KEY`: "Private key of periodic vesting wallet"
- `PRIVATE_KEY_TWO`: "Private key of second QA wallet"
- `BASE_URL`: "Enterprise V2 URL"

## Building a Custom Station Extension
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
