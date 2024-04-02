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
                const isVisible = await page.isVisible(outcomeSelector, { timeout: 1000 * attempts });
                if (!isVisible) {
                    allVotesVerified = false;
                    console.log(`Waiting for vote outcome at index ${index} to become visible.`);
                    break; // Break the inner loop and retry the page reload if any vote is not verified
                }

                // Extract the displayed vote outcome
                const voteOutcome = await page.textContent(outcomeSelector);

                // Verify that the vote outcome matches the expected outcome
                if (voteOutcome === expectedOutcome) {
                    console.log(`Vote ${index} verification successful: Expected and found '${expectedOutcome}'.`);
                } else {
                    console.error(`Vote ${index} verification failed: Expected '${expectedOutcome}', but found '${voteOutcome}'.`);
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
