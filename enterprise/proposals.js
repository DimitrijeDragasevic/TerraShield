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
