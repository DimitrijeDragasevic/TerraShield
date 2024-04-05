export async function dopositAssetsToTreasury(page) {
  await page.getByText('Treasury', { exact: true }).click();
  // wait for the test ids to get implemented
}