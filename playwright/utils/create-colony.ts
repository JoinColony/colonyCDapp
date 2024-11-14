import { type Page } from '@playwright/test';

import { fillInputByLabelWithDelay } from './common.ts';

export const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const selectWalletAndUserProfile = async (page: Page) => {
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
};

export const fillColonyNameStep = async (
  page: Page,
  {
    nameFieldValue,
    urlFieldValue,
  }: { nameFieldValue: string; urlFieldValue: string },
) => {
  await fillInputByLabelWithDelay({
    page,
    label: /colony name/i,
    value: nameFieldValue,
  });

  await fillInputByLabelWithDelay({
    page,
    label: /custom colony URL/i,
    value: urlFieldValue,
  });

  await page
    .getByRole('button', { name: /continue/i })
    .click({ timeout: 10000 });

  await page
    .getByRole('heading', { name: /creating a new native token/i })
    .waitFor({ state: 'visible' });
};

export const fillNativeTokenStepWithExistingToken = async (
  page: Page,
  token: string,
) => {
  await page.getByLabel(/Use an existing token/i).check();
  await page.getByRole('button', { name: /continue/i }).click();

  await fillInputByLabelWithDelay({
    page,
    label: /Existing token address/i,
    value: token,
  });
  await page.getByRole('button', { name: /continue/i }).click();
};
