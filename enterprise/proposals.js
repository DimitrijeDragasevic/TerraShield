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

// update dao configuration
// custom wasm message
// send luna
// update dao information
// create cross chain treasury

// const tokenProposals = [
//     { type: "Stake DAO treasury assets", details: { /* details here */ }},
//     { type: "Update whitelisted assets", details: { /* details here */ }}
// ];

// const treasuriesProposals = [
//     { type: "Create cross-chain treasury", details: { /* details here */ }},
//     { type: "Send treasury assets", details: { /* details here */ }}
// ];

// await processTokenProposal(page, tokenProposals);
// await processTreasuriesProposal(page, treasuriesProposals);

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

export async function processAdvancedProposal(page, proposals) {
  for (const proposal of proposals) {
    if (proposal.type === "Execute custom WASM messages") {
      await executeCustomWASMMessages(page, proposal.details);
    } else {
      console.error("Unsupported advanced proposal type:", proposal.type);
    }
  }
}

async function updateDaoInformation(page, details) {
  // Navigate to the Governance section and initiate the update process
  await page.getByRole("button", { name: "Governance", exact: true }).click();
  await page
    .getByRole("button", { name: "Update DAO information Update" })
    .click();
  // Define a mapping of details object keys to input selectors on the page
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

async function executeCustomWASMMessages(page, details) {
  await page.getByRole("button", { name: "Advanced", exact: true }).click();
  await page
    .getByRole("button", { name: "Execute custom WASM messages" })
    .click();

  // Expand the dropdown for chain selection
  await page.click('[title="Expand"]');

  // Confirm the selection if necessary - this might be optional based on how your UI works
  await page
    .getByRole("option", { name: `${details.chain} ${details.chain}` })
    .locator("div")
    .first()
    .click();

  // Enter the message in the appropriate input field
  await page.getByLabel("Message1Enter your message").fill(details.message);
}


