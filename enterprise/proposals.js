const { expect } = require("../playwright.config");

export async function navigateToProposals(page) {
  await page.getByText("Proposals", { exact: true }).click();
  await expect(page.getByPlaceholder("Search...")).toBeVisible();
  await expect(page.getByText("Status")).toBeVisible();
  await expect(page.getByRole("link", { name: "New Proposal" })).toBeVisible();
  await page.getByRole("link", { name: "New Proposal" }).click();
}

export async function createSimpleProposal(page) {
  await page.getByRole("button", { name: "Governance", exact: true }).click();
  await page
    .getByRole("button", { name: "Update DAO information Update" })
    .click();
  await page
    .getByPlaceholder("Enter proposal title")
    .fill("Test simple proposal");
  await page
    .getByPlaceholder("Enter proposal description")
    .fill("Test simple proposal");
  await page
    .getByPlaceholder("Describe your DAO in 560")
    .fill("update description");
  await expect(await page.getByRole("button", { name: "Next" })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
}

/**
 * Verifies specific vote outcomes by checking the vote outcome elements on the page.
 * Allows verification of a single vote at a specified index or multiple votes.
 * Refreshes the page to ensure the latest state is reflected.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array<{index: number, expectedOutcome: string}>} votesToVerify - An array of objects, each specifying the index of the vote and its expected outcome.
 */
export async function verifySpecificVotes(page, votesToVerify) {
  let attempts = 0;
  const maxAttempts = 5; // Limit the number of attempts to prevent infinite loops

  while (attempts < maxAttempts) {
    attempts++;
    try {
      // Refresh the page to ensure we have the latest state, increasing wait time in each attempt
      await page.reload({ waitUntil: "networkidle" });
      let allVotesVerified = true; // Flag to track if all votes are verified in this attempt

      for (const { index, expectedOutcome } of votesToVerify) {
        const outcomeSelector = `p[data-testid="vote-outcome-${index}"]`;
        const percentageSelector = `p[data-testid="vote-percentage-${index}"]`;

        // Wait for the vote outcome element to be visible with a dynamic timeout based on the attempt
        const isVisible = await page.isVisible(outcomeSelector, {
          timeout: 1000 * attempts,
        });
        if (!isVisible) {
          allVotesVerified = false;
          console.log(
            `Waiting for vote outcome at index ${index} to become visible.`
          );
          break; // Break the inner loop and retry the page reload if any vote is not verified
        }

        // Extract the displayed vote outcome
        const voteOutcome = await page.textContent(outcomeSelector);

        // Verify that the vote outcome matches the expected outcome
        if (voteOutcome === expectedOutcome) {
          console.log(
            `Vote ${index} verification successful: Expected and found '${expectedOutcome}'.`
          );
        } else {
          console.error(
            `Vote ${index} verification failed: Expected '${expectedOutcome}', but found '${voteOutcome}'.`
          );
          allVotesVerified = false;
          break; // Break the inner loop for immediate retry on failure
        }

        // Optionally, extract and log the vote percentage for additional verification
        const votePercentage = await page.textContent(percentageSelector);
        console.log(`Vote ${index} percentage: ${votePercentage}`);
      }

      if (allVotesVerified) {
        return; // Exit the function once all votes are verified successfully
      }
    } catch (error) {
      console.error(`Error verifying votes on attempt ${attempts}: ${error}`);
    }

    // Wait for a short period before the next attempt, increasing the wait time with each attempt
    await page.waitForTimeout(2000 * attempts);
  }

  console.error("Failed to verify specific votes after several attempts.");
  // Consider throwing an error or handling this case as per your test's needs
}

export async function vote(page, voteType) {
  // Define an object mapping vote types to their respective button names
  const voteOptions = {
    Yes: "Yes",
    No: "No",
    Abstain: "Abstain",
    "No with veto": "No with veto",
  };

  // Check if the provided voteType is valid
  if (!voteOptions[voteType]) {
    console.log(`Invalid vote type: ${voteType}`);
    return;
  }

  // Locate and click the button for the specified vote type
  try {
    await page.getByRole("button", { name: voteOptions[voteType] }).click();
    console.log(`Successfully voted: ${voteType}`);
  } catch (error) {
    console.error(`Error clicking the vote button: ${error}`);
  }
}

/**
 * Processes token-related proposals including reallocation, staking, unstaking, and updating whitelisted assets.
 * Iterates through each proposal and calls the appropriate function based on the proposal type.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array<Object>} proposals - An array of objects, each specifying the type of token proposal and its details.
 */
export async function processTokenProposal(page, proposals) {
  for (const proposal of proposals) {
    switch (proposal.type) {
      case "Reallocate staked DAO treasury assets":
        await reallocateStakedDaoTreasuryAssets(page, proposal.details);
        break;
      case "Stake DAO treasury assets":
        await stakeDAOTreasuryAssets(page, proposal.details);
        break;
      case "Unstake DAO treasury assets":
        await unstakeDaoTreasuryAssets(page, proposal.details);
        break;
      case "Update whitelisted assets":
        await updateWhiteListedAssets(page, proposal.details);
        break;
      default:
        console.error("Unsupported proposal type:", proposal.type);
    }
  }
}

/**
 * Processes proposals related to DAO treasuries such as creating cross-chain treasuries, distributing assets, and more.
 * Each proposal type triggers a specific action aligned with treasury management.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array<Object>} proposals - An array of treasury-related proposals detailing the type and specifics needed to execute.
 */
export async function processTreasuriesProposal(page, proposals) {
  for (const proposal of proposals) {
    switch (proposal.type) {
      case "Create cross-chain treasury":
        await createCrossChainTreasury(page, proposal.details);
        break;
      case "Distribute DAO assets to stakers":
        await distributeDaoAssetsToStakers(page, proposal.details);
        break;
      case "Register contract for fee sharing":
        await registerContractForFeeSharing(page, proposal.details);
        break;
      case "Send treasury assets":
        await sendTreasuryAssets(page, proposal.details);
        break;
      default:
        console.error("Unsupported proposal type:", proposal.type);
    }
  }
}

/**
 * Processes governance proposals, handling changes in council, DAO settings, reward thresholds, and more.
 * The function executes different governance-related tasks depending on the proposal type.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array<Object>} proposals - An array of governance proposals each with specific details and type.
 */
export async function processGovernanceProposal(page, proposals) {
  for (const proposal of proposals) {
    switch (proposal.type) {
      case "Update council":
        await updateCouncil(page, proposal.details);
        break;
      case "Update DAO information":
        await updateDaoInformation(page, proposal.details);
        break;
      case "Update DAO settings":
        await updateDaoSettings(page, proposal.details);
        break;
      case "Update minimum weight for rewards":
        await updateMinimumWeightForRewards(page, proposal.details);
        break;
      case "Update multisig members":
        await updateMultisigMembers(page, proposal.details);
        break;
      case "Update participation rewards proposals number":
        await updateParticipationRewardsProposalsNumber(page, proposal.details);
        break;
      case "Upgrade":
        await upgradeDAO(page, proposal.details);
        break;
      default:
        console.error("Unsupported governance proposal type:", proposal.type);
    }
  }
}

/**
 * Processes advanced proposals specifically for executing custom WASM messages.
 * Handles cases where advanced blockchain interactions are required.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Array<Object>} proposals - An array of advanced proposals focused on WASM message execution.
 */
export async function processAdvancedProposal(page, proposals) {
  for (const proposal of proposals) {
    if (proposal.type === "Execute custom WASM messages") {
      await executeCustomWASMMessages(page, proposal.details);
    } else {
      console.error("Unsupported advanced proposal type:", proposal.type);
    }
  }
}

/**
 * Updates the DAO's information fields such as name, description, and social media links.
 * This function interacts with form fields by matching them to the provided details keys.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} details - An object containing the DAO information fields to be updated.
 */
async function updateDaoInformation(page, details) {
  await page.getByRole("button", { name: "Governance", exact: true }).click();
  await page
    .getByRole("button", { name: "Update DAO information Update" })
    .click();

  const fieldSelectors = {
    daoName: 'input[name="name"]',
    daoDescription: 'textarea[name="description"]',
    twitter: 'input[name="twitterUsername"]',
    githubLink: 'input[name="githubUsername"]',
    telegram: 'input[name="telegramUsername"]',
    discord: 'input[name="discordUsername"]',
  };

  // Iterate over the details object and fill in the fields that are present
  for (const [key, value] of Object.entries(details)) {
    const selector = fieldSelectors[key];
    if (selector && value) {
      await page.fill(selector, value);
    }
  }
}

/**
 * Executes custom WASM messages in a decentralized application or protocol.
 * It involves selecting a blockchain, entering a message, and executing it.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} details - An object with properties `chain` and `message` for execution.
 */
async function executeCustomWASMMessages(page, details) {
  await page.getByRole("button", { name: "Advanced", exact: true }).click();
  await page
    .getByRole("button", { name: "Execute custom WASM messages" })
    .click();

  // Expand the dropdown for chain selection
  await page.click('[title="Expand"]');
  await page
    .getByRole("option", { name: `${details.chain} ${details.chain}` })
    .locator("div")
    .first()
    .click();
  await page.getByLabel("Message1Enter your message").fill(details.message);
}

/**
 * Updates the list of whitelisted assets for a platform or service.
 * It searches for an asset, verifies its presence, and selects it for updating the whitelist.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} details - An object containing the `asset` name to be whitelisted.
 */
async function updateWhiteListedAssets(page, details) {
  await page.getByRole("button", { name: "Tokens", exact: true }).click();
  await page.getByRole("button", { name: "Update whitelisted assets" }).click();
  await page.getByPlaceholder("Search for an asset").fill(details.asset);
  expect(page.getByText(details.asset)).toBeVisible();
  await page.getByText(details.asset).click();
}

/**
 * Creates a cross-chain treasury by selecting multiple chains.
 * This function navigates to the treasury creation interface and processes each specified chain.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} details - An object containing an array of `chains` involved in the treasury.
 */
async function createCrossChainTreasury(page, details) {
  await page.getByRole("button", { name: "Treasuries", exact: true }).click();
  await page
    .getByRole("button", { name: "Create cross-chain treasury" })
    .click();

  details.chains.forEach(async (chain) => {
    expect(page.getByText(chain)).toBeVisible();
    await page.getByText(chain).click();
  });
}

/**
 * Updates the minimum weight required for rewards distribution in a DAO or decentralized protocol.
 * This function modifies the minimum weight setting through an input form.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {Object} details - An object containing the `reward` weight value to be set.
 */
async function updateMinimumWeightForRewards(page, details) {
  await page.getByRole("button", { name: "Governance", exact: true }).click();
  await page
    .getByRole("button", { name: "Update minimum weight for rewards" })
    .click();

  await page.getByPlaceholder("Enter minimum weight").fill(details.reward);
}

/**
 * Fills in the name and description fields for a new proposal in a DAO.
 * This function provides fields to enter a title and description for a proposal.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} name - The title of the proposal.
 * @param {string} description - The detailed description of the proposal.
 */
export async function enterNameAndDescriptionForProposal(
  page,
  name,
  description
) {
  await page.getByPlaceholder("Enter proposal title").fill(name);
  await page.getByPlaceholder("Enter proposal description").fill(description);
}
