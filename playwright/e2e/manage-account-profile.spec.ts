import { expect, test } from '@playwright/test';

import { selectWallet, setCookieConsent, fillInput } from '../utils/common.ts';

test.describe('Manage Account', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setCookieConsent(context, baseURL);

    await page.goto('/');

    await selectWallet(page);

    await page.getByTestId('user-navigation-hamburger').click();

    await page.getByTestId('user-menu').waitFor({ state: 'visible' });

    await page
      .getByTestId('user-menu')
      .getByRole('link', { name: /manage account/i })
      .click();

    await page.waitForURL('/account/profile');
  });

  test.describe('Profile section', () => {
    test('Username field', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: 'Profile', level: 3 }),
      ).toBeVisible();

      await expect(
        page.getByRole('heading', { name: 'Your Colony profile', level: 4 }),
      ).toBeVisible();

      await expect(
        page.getByText(/You can change your username every 90 days/i),
      ).toBeVisible();

      const displayNameInput = page.locator('[name="displayName"]');

      // Should be pre-filled with the user's display name
      await expect(displayNameInput).toHaveValue(/.+/);

      await displayNameInput.hover();

      await expect(
        page.getByText(/You can change your username again in /i),
      ).toBeVisible();
    });

    test('Website field', async ({ page }) => {
      const websiteInput = page.locator('[name="website"]');
      const toast = page
        .getByRole('alert')
        .filter({ hasText: /action completed successfully/i })
        .last();

      const saveChangesButton = page.getByRole('button', {
        name: 'Save changes',
      });
      await expect(page.getByText('Website', { exact: true })).toBeVisible();
      await expect(page.getByText('Your website is optional')).toBeVisible();
      await expect(websiteInput).toBeEnabled();

      await test.step('Shows an error message when the website is invalid', async () => {
        await fillInput({
          page,
          selector: '[name="website"]',
          value: 'invalid-website',
        });
        await saveChangesButton.click();

        await expect(
          page
            .getByTestId('form-error')
            .filter({ hasText: /Enter a valid URL/i }),
        ).toBeVisible();
      });

      await test.step('The field is not required', async () => {
        await websiteInput.clear();
        await fillInput({
          page,
          selector: '[name="website"]',
          value: '',
        });

        await saveChangesButton.click();
        await expect(toast).toBeVisible();
        await expect(websiteInput).toHaveValue('');
        await expect(toast).toBeHidden();
      });

      await test.step('Accepts a valid website', async () => {
        const website = 'https://colony.io';

        await fillInput({
          page,
          selector: '[name="website"]',
          value: website,
        });
        await saveChangesButton.click();

        await expect(toast).toBeVisible();

        await expect(toast).toBeHidden();
      });
    });

    test('Your Bio field', async ({ page }) => {
      await expect(page.getByText(/^Your bio$/)).toBeVisible();
      await expect(
        page.getByText(
          /Your bio is optional and shows on your Colony profile in under 200 characters/,
        ),
      ).toBeVisible();

      const bioInput = page.locator('[name="bio"]');
      const toast = page
        .getByRole('alert')
        .filter({ hasText: /action completed successfully/i })
        .last();

      await test.step('Shows an error message when the bio is too long', async () => {
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(500);
        await bioInput.fill('a'.repeat(201));

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(
          page
            .getByTestId('form-error')
            .filter({ hasText: /Too many characters/i }),
        ).toBeVisible();
      });

      await test.step('The field is not required', async () => {
        await bioInput.clear();

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(toast).toBeVisible();

        await expect(toast).toBeHidden();
      });

      await test.step('Accepts a valid value', async () => {
        const text = 'This is my bio';

        await bioInput.clear();
        await fillInput({
          page,
          selector: '[name="bio"]',
          value: text,
        });

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(toast).toBeVisible();
      });
    });

    test('Location field', async ({ page }) => {
      const toast = page
        .getByRole('alert')
        .filter({ hasText: /action completed successfully/i })
        .last();
      await expect(page.getByText(/Location/)).toBeVisible();
      await expect(
        page.getByText(
          /Your location is optional and only shown on your Colony profile/,
        ),
      ).toBeVisible();

      const locationInput = page.locator('[name="location"]');

      await test.step('The field is not required', async () => {
        await locationInput.clear();

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(toast).toBeVisible();

        await expect(toast).toBeHidden();
      });

      await test.step('Accepts a valid value', async () => {
        const location = 'New York';

        await locationInput.clear();
        await fillInput({
          page,
          selector: '[name="location"]',
          value: location,
        });

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(toast).toBeVisible();

        await expect(locationInput).toHaveValue(location);
        await expect(toast).toBeHidden();
      });
    });
  });
});
