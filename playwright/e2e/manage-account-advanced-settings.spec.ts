import { expect, test } from '@playwright/test';

import { selectWallet, setCookieConsent } from '../utils/common.ts';

test.describe('Advanced Settings section', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setCookieConsent(context, baseURL);

    await page.goto('/');

    await selectWallet(page);

    await page
      .getByRole('banner')
      .getByTestId('user-navigation-hamburger')
      .click();

    await page.getByTestId('user-menu').waitFor({ state: 'visible' });

    await page
      .getByTestId('user-menu')
      .getByRole('link', { name: /manage account/i })
      .click();

    await page.waitForURL('/account/profile');
    await page
      .getByTestId('account-page-sidebar')
      .getByLabel('/account/preferences')
      .click();

    await page.waitForURL('/account/preferences');
  });

  test('Metatransactions toggle', async ({ page }) => {
    await page
      .getByTestId('account-page-sidebar')
      .getByLabel('/account/advanced')
      .click();

    await page.getByTestId('metatransactions-toggle').click();

    await expect(
      page
        .getByRole('alert')
        .filter({
          hasText:
            /(colony will pay your gas fee|you will pay your own gas fee)/i,
        })
        .last(),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Advanced settings', level: 3 }),
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Colony pays my gas fees' }),
    ).toBeVisible();

    await page.getByTestId('settings-row-tooltip').hover();

    await expect(page.getByText(/disabling this option means/i)).toBeVisible();
  });
});
