import { type Page } from '@playwright/test';

export const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

const generateRandomUsername = () => {
  return `user_${generateRandomString()}`;
};

const generateRandomEmail = () => {
  return `test_${generateRandomString()}@example.com`;
};

const fillUserProfile = async (page: Page) => {
  const username = generateRandomUsername();
  const email = generateRandomEmail();

  await page.getByLabel(/Email address/i).fill(email);
  await page.getByLabel(/username/i).fill(username);

  await page.getByRole('button', { name: /continue/i }).click();
};

export const selectWalletAndUserProfile = async (page: Page) => {
  let isUserConnected = false;

  await page.route('**/graphql', async (route, request) => {
    const postData = request.postDataJSON(); // Get the request body as JSON
    if (postData.operationName === 'GetUserByAddress') {
      // Fetch original response.
      const response = await route.fetch();

      const jsonResponse = await response.json();

      // Check if the user exists and has a profile
      const items = jsonResponse.data?.getUserByAddress?.items;
      if (items && items.length > 0) {
        isUserConnected = !!items[0]?.profile?.displayName;
      }
    }

    route.continue();
  });

  await page
    .getByRole('button', { name: /connect wallet/i })
    .first()
    .click();

  await page.getByLabel(/I agree to/i).click();

  await page.getByText(/dev wallet 2/i).click();

  await page.getByText(/Local Ganache Instance/i).waitFor({ state: 'visible' });

  const loadingIndicator = page.getByText(/Checking your access.../i);
  const loadingIndicatorVisible = await loadingIndicator.isVisible();

  if (loadingIndicatorVisible) {
    await loadingIndicator.waitFor({ state: 'hidden' });
  }

  if (!isUserConnected) {
    await fillUserProfile(page);
  }
};

export const fillColonyNameStep = async (
  page: Page,
  {
    nameFieldValue,
    urlFieldValue,
  }: { nameFieldValue: string; urlFieldValue: string },
) => {
  const continueButton = page.getByRole('button', { name: /continue/i });

  await page.getByLabel(/colony Name/i).fill(nameFieldValue);

  await page.getByLabel(/custom colony URL/i).fill(urlFieldValue);

  await page.getByText(/URL available/i).waitFor({ state: 'visible' });

  await page.getByLabel(/custom colony URL/i).blur();

  await page.getByText(/URL available/i).waitFor({ state: 'visible' });

  await continueButton.click();
};

export const fillNativeTokenStepWithExistingToken = async (
  page: Page,
  token: string,
) => {
  await page.getByLabel(/Use an existing token/i).check();
  await page.getByRole('button', { name: /continue/i }).click();

  await page.getByLabel(/Existing token address/i).fill(token);
  await page.getByRole('button', { name: /continue/i }).click();
};
