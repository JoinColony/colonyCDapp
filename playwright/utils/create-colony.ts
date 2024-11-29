import { type Page } from '@playwright/test';

import { fillInput } from './common.ts';

export const fillColonyNameStep = async (
  page: Page,
  {
    nameFieldValue,
    urlFieldValue,
  }: { nameFieldValue: string; urlFieldValue: string },
) => {
  await fillInput({
    page,
    label: /colony name/i,
    value: nameFieldValue,
  });

  await fillInput({
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

  await fillInput({
    page,
    label: /Existing token address/i,
    value: token,
  });
  await page.getByRole('button', { name: /continue/i }).click();
};
