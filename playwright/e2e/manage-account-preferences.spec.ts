/* eslint-disable playwright/no-conditional-in-test */
import { expect, test } from '@playwright/test';

import {
  selectWallet,
  setCookieConsent,
  generateRandomEmail,
  fillInput,
} from '../utils/common.ts';

test.describe('Preferences section', () => {
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

  test('Email field', async ({ page }) => {
    await expect(page.getByText(/^Email address$/)).toBeVisible();

    await expect(page.getByText(/Update your email address/)).toBeVisible();
    const emailValue = await page
      .getByTestId('preferences-email-value')
      .innerText();
    await expect(page.getByTestId('preferences-email-value')).toBeVisible();

    await page.getByRole('button', { name: /update email/i }).click();

    await page
      .getByRole('button', { name: /update email/i })
      .waitFor({ state: 'hidden' });

    await expect(page.getByTestId('preferences-email-value')).toBeHidden();

    await expect(
      page.getByRole('button', { name: /save changes/i }),
    ).toBeVisible();

    const emailInput = page.locator('[name="email"]');
    await expect(emailInput).toHaveValue(emailValue);

    await page.getByRole('button', { name: /cancel/i }).click();

    await expect(page.getByTestId('preferences-email-value')).toBeVisible();
    await expect(emailInput).toBeHidden();

    await test.step('Should not accept existing email', async () => {
      await page.getByRole('button', { name: /update email/i }).click();

      await emailInput.waitFor({ state: 'visible' });
      await emailInput.clear();
      await fillInput({
        page,
        selector: '[name="email"]',
        value: emailValue,
      });

      await page.getByRole('button', { name: /save changes/i }).click();

      await expect(
        page
          .getByTestId('form-error')
          .filter({ hasText: /email already registered/i }),
      ).toBeVisible();

      await page.getByRole('button', { name: /cancel/i }).click();
    });

    await test.step('Shows an error message when the email is invalid', async () => {
      await page.getByRole('button', { name: /update email/i }).click();

      await fillInput({
        page,
        selector: '[name="email"]',
        value: 'invalid-email',
      });

      await page.getByRole('button', { name: /save changes/i }).click();

      await expect(page.getByTestId('form-error')).toBeVisible();

      await page.getByRole('button', { name: /cancel/i }).click();
    });

    await test.step('Should accept a valid email', async () => {
      const email = generateRandomEmail();

      await page.getByRole('button', { name: /update email/i }).click();

      await fillInput({
        page,
        selector: '[name="email"]',
        value: email,
      });

      await page.getByRole('button', { name: /save changes/i }).click();

      await expect(
        page
          .getByRole('alert')
          .filter({ hasText: /action completed successfully/i })
          .last(),
      ).toBeVisible();

      await expect(page.getByTestId('preferences-email-value')).toHaveText(
        email,
      );
    });
  });

  test('Wallet information', async ({ page }) => {
    await page.getByRole('button', { name: /copy address/i }).click();

    const clipboardText: string = await page.evaluate(
      'navigator.clipboard.readText()',
    );

    await expect(page.getByText(clipboardText, { exact: true })).toBeVisible();
  });

  test('Notification preferences', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Notification preferences' }),
    ).toBeVisible();

    const notificationsDisabled = await page
      .getByText(/Notifications are disabled/)
      .isVisible();

    if (notificationsDisabled) {
      // Enable notifications
      await page.getByRole('link', { name: /advanced settings/i }).click();

      await page.waitForURL('/account/advanced');

      const notificationsSection = page.getByTestId('notifications-section');
      await expect(
        notificationsSection.getByText(/Manage services/i),
      ).toBeVisible();

      await expect(
        notificationsSection.getByRole('heading', { name: /Notifications/i }),
      ).toBeVisible();

      await expect(
        notificationsSection.getByText(
          /Enables in-app and external notifications for activity in colonies you’ve joined/i,
        ),
      ).toBeVisible();

      await page.getByTestId('notifications-toggle').click();

      const alert = page.getByRole('alert');

      await expect(alert).toBeVisible();

      await expect(
        alert.getByText(/You will now receive notifications/i),
      ).toBeVisible();
      await page.goBack();
      await page.waitForURL('/account/preferences');
    }

    await expect(page.getByText(/Payments and funds/)).toBeVisible();

    await expect(page.getByRole('heading', { name: /Mention/ })).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /Operations and admin/i }),
    ).toBeVisible();

    await expect(
      page.getByTestId('payment-notifications-toggle'),
    ).toBeVisible();

    await expect(
      page.getByTestId('mention-notifications-toggle'),
    ).toBeVisible();

    await expect(
      page.getByTestId('mention-notifications-toggle'),
    ).toBeVisible();

    await page.goto('/account/advanced');

    if (await page.getByText('Loading...').isVisible()) {
      await page.getByText('Loading...').waitFor({ state: 'hidden' });
    }

    await page.getByTestId('notifications-toggle').click();
  });
});
