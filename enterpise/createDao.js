const expect = require("@playwright/test").expect;

async function daoGovernance(
  page,
  multisig = true,
  minimumDeposit = "10",
  minimumWeight = "1"
) {
  await expect(page.getByText("7 days")).toBeVisible();
  await expect(page.getByText("30%")).toBeVisible();
  await expect(page.getByText("51%").first()).toBeVisible();
  await expect(page.getByText("51%").last()).toBeVisible();

  if (!multisig) {
    await page
      .getByPlaceholder("Enter a minimum deposit amount")
      .fill(minimumDeposit);
    await expect(page.getByText("14 days")).toBeVisible();
  }

  await page.getByPlaceholder("Enter minimum weight").fill(minimumWeight);
  await page.getByRole("button", { name: "Next" }).click();
}

async function councilMembers(page, walletAddress) {
  await expect(page.getByText("Add council members to your DAO")).toBeVisible();
  await expect(
    page.getByText(
      "(Optional) DAO Council members can create and vote on certain emergency proposal"
    )
  ).toBeVisible();
  await expect(
    page.getByText("Council members", { exact: true })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
  await page.getByRole("button", { name: "Add" }).click();

  await expect(
    page.getByPlaceholder("Enter council member's address")
  ).toBeVisible();
  await page
    .getByPlaceholder("Enter council member's address")
    .fill(walletAddress);

  await page
    .getByPlaceholder("select a proposal type")
    .fill("Update DAO information");
  await page.getByText("Update DAO information").click();
  await page
    .getByPlaceholder("select a proposal type")
    .fill("Update asset whitelist");
  await page.getByText("Update asset whitelist").click();
  await expect(page.getByText("No options left")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
}
//'Migaloo', 'Neutron', 'Juno', 'Osmosis', 'Stargaze'
async function createTreasuryOutposts(page, ...treasury) {
  for (const chain of treasury) {
    await page.getByText(chain).click();
  }
  await page.getByRole("button", { name: "Next" }).click();
}

async function socialMediaLinks(page, twitter, github, discord, telegram) {
  await page.getByPlaceholder("Enter Twitter username").fill(twitter);
  await page.getByPlaceholder("Enter GitHub username").fill(github);
  await page.getByPlaceholder("Enter Discord username").fill(discord);
  await page.getByPlaceholder("Enter Telegram username").fill(telegram);
  await page.getByRole("button", { name: "Next" }).click();
}

async function verifyAndCreateTokenDaoSummary(page) {
  //I need to add test ids to to verify the created data 100%
  await expect(page.getByText("Step 8")).toBeVisible();
  await expect(page.getByText("Create Token DAO")).toBeVisible();
  await expect(page.getByText("Review configuration")).toBeVisible();

  await page.getByRole("button", { name: "Next" }).click();
}

async function verifyAndCreateNFTDaoSummary(page) {
  //I need to add test ids to to verify the created data 100%
  await expect(page.getByText("Step 9")).toBeVisible();
  await expect(page.getByText("Create NFT DAO")).toBeVisible();
  await expect(page.getByText("Review configuration")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
}

async function newMultiSig(page, ...address) {
  await page.getByText("No, create a new Multisig").click();
  await page.getByRole("button", { name: "Next" }).click();

  // Check if there is at least one address to process
  if (address.length > 0) {
    // Fill the first address field (index 1) with the first element in the address array
    await page.locator('input[name="members.1.address"]').fill(address[0]);

    // Loop through the rest of the addresses starting from the second element
    for (let i = 1; i < address.length; i++) {
      // Click the "Add" button to create a new address field
      await page.getByRole("button", { name: "Add" }).click();

      // Fill the newly created address field
      // Increment the index by 1 because the form field index starts at 1
      await page
        .locator(`input[name="members.${i + 1}.address"]`)
        .fill(address[i]);
    }
  }
  await page.getByRole("button", { name: "Next" }).click();
}

// Function to create a Token DAO
export async function createTokenDAO(page, name) {
  await navigateToCreateDAO(page, "Token DAO");
  await fillDAOForm(
    page,
    name,
    "https://station.money/static/media/favicon.1e08d51d.svg",
    "test"
  );
  await selectAsset(page, "LUNA", /^LUNATerra Luna$/);
  await completeDAOSetup(
    false,
    page,
    "Migaloo",
    "Neutron",
    "Juno",
    "Osmosis",
    "Stargaze"
  );
  await verifyAndCreateTokenDaoSummary(page);
}

async function verifyAndCreateMultiSigDaoSummary(page) {
  // //I need to add test ids to to verify the created data 100%
  await expect(page.getByText("Step 9")).toBeVisible();
  await expect(page.getByText("Create Multisig DAO")).toBeVisible();
  await expect(page.getByText("Review configuration")).toBeVisible();

  // Navigate to the next step
  await page.getByRole("button", { name: "Next" }).click();
}

export async function createNftDAO(page, daoName, haveNft, CW271address) {
  await navigateToCreateDAO(page, "NFT DAO");
  await fillDAOForm(
    page,
    daoName,
    "https://www.madness-toys.store/logo.png",
    "test"
  );
  await doYouHaveAnExistingNFT(page, haveNft, CW271address);
  await completeDAOSetup(
    true,
    page,
    "Migaloo",
    "Neutron",
    "Juno",
    "Osmosis",
    "Stargaze"
  );
  await verifyAndCreateNFTDaoSummary(page);
}

async function fillNftForm(page) {
  await page.getByPlaceholder("Enter the name of your NFT").fill("test123");
  await page.getByPlaceholder("Enter the symbol of your NFT").fill("test");
  await page.getByRole("button", { name: "Next" }).click();
}

async function doYouHaveAnExistingNFT(page, haveNft, CW271address) {
  if (!haveNft) {
    await page.getByText("No, create a new NFT").click();
    await page.getByRole("button", { name: "Next" }).click();
    await fillNftForm(page);
  } else {
    await page.getByText("Yes, find my NFT").click();
    await page
      .locator("label")
      .filter({ hasText: /^Yes, find my NFT$/ })
      .fill(CW271address);
    await page.getByRole("button", { name: "Next" }).click();
  }
}

// Function to create a Multisig DAO
export async function createMultiSigDao(page, daoName) {
  await navigateToCreateDAO(page, "Multisig DAO");
  await fillDAOForm(
    page,
    daoName,
    "https://www.madness-toys.store/logo.png",
    "test"
  );

  await handleMultiSigSetup(
    page,
    true,
    "terra10detxcnq49r3nnze7zuqprl7yqdh34fulqtakw",
    "terra1puh783ttdt6sxj6u9ckx20f644chn04cygdqgw"
  );

  await completeDAOSetup(
    true,
    page,
    "Migaloo",
    "Neutron",
    "Juno",
    "Osmosis",
    "Stargaze"
  );
  await verifyAndCreateMultiSigDaoSummary(page);
}

// Function to navigate to the Create DAO page and select DAO type
async function navigateToCreateDAO(page, daoType) {
  await page.getByRole("link", { name: "Create DAO" }).click();
  await page.getByText(daoType).click();
  await page.getByRole("button", { name: "Next" }).click();
}

// Function to fill in the DAO creation form
async function fillDAOForm(page, name, logoUrl, description) {
  await page.getByPlaceholder("Enter a name for your DAO").fill(name);
  await page.getByPlaceholder("Enter the URL of your DAO's logo").fill(logoUrl);
  await page.getByLabel("Description0 / 560").fill(description);
  await page.getByRole("button", { name: "Next" }).click();
}

// Function to select an asset
async function selectAsset(page, assetName, assetSelector) {
  await page.getByText("Yes, find my Token").click();
  await page.getByPlaceholder("Search for an asset").fill(assetName);
  await page.locator("div").filter({ hasText: assetSelector }).nth(1).click();
  await page.getByRole("button", { name: "Next" }).click();
}

// Function to complete the setup of DAO
async function completeDAOSetup(multisig, page, ...treasuryOutposts) {
  await daoGovernance(page, multisig);
  await councilMembers(page, "terra1u28fgu0p99eh9xc4623k6cw6qmfdnl9un23yxs");
  await createTreasuryOutposts(page, ...treasuryOutposts);
  await socialMediaLinks(page, "test", "test", "test", "test");
}

// Function to handle Multisig setup
async function handleMultiSigSetup(page, hasMultiSig, ...addresses) {
  await expect(
    page.getByText("Do you have an existing Multisig?")
  ).toBeVisible();
  if (hasMultiSig) {
    await newMultiSig(page, ...addresses);
  } else {
    // Handle the case when there is no existing multisig (BUG)
  }
}
