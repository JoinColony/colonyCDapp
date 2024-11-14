/* eslint-disable playwright/no-conditional-in-test */
import { expect, test } from '@playwright/test';

import {
  selectWallet,
  setCookieConsent,
  generateRandomEmail,
  fillInputWithDelay,
} from '../utils/common.ts';

const validImagePath = 'playwright/fixtures/images/jaya-the-beast_400KB.png';
const invalidImagePath = 'playwright/fixtures/images/cat-image-new-1_3_MB.png';

test.describe('Manage Account', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    await setCookieConsent(context, baseURL);

    await page.goto('/');

    await selectWallet(page);

    await page.goto('/account/profile');
  });

  test.describe('Profile section', () => {
    test.beforeEach(async ({ page }) => {
      await page
        .getByTestId('account-page-sidebar')
        .getByLabel('/account/profile')
        .click();
    });

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
      await expect(displayNameInput.inputValue).toBeTruthy();

      await displayNameInput.hover();

      await expect(
        page.getByText(/You can change your username again in /i),
      ).toBeVisible();
    });

    test('Avatar', async ({ page }) => {
      await test.step('Removing Avatar', async () => {
        const removeAvatarButton = page.getByRole('button', {
          name: 'Remove avatar',
        });

        if (!(await removeAvatarButton.isVisible())) {
          // Upload a valid image
          const uploadInput = page.locator('input[type="file"]');

          await page.getByRole('button', { name: 'Change avatar' }).click();

          await uploadInput.setInputFiles(validImagePath);

          await removeAvatarButton.waitFor({ state: 'visible' });
        }
        const avatarUploader = page.getByTestId('avatar-uploader');
        const avatar = page.getByTestId('user-profile-avatar');
        const avatarInHeader = page.getByTestId('header-avatar');
        //  Avatar in the profile form and header should be the same
        await expect(page.getByTestId('user-profile-avatar')).toHaveAttribute(
          'src',
          (await page
            .getByTestId('header-avatar')
            .getAttribute('src')) as string,
        );

        // Verify that the avatar uploader is visible
        await expect(avatarUploader).toBeVisible();

        // Remove the avatar
        await removeAvatarButton.click();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /profile image changed successfully/i })
            .last(),
        ).toBeVisible();

        await removeAvatarButton.waitFor({ state: 'hidden' });

        const updatedAvatarSrc = await avatar.getAttribute('src');
        const updatedAvatarInHeaderSrc =
          await avatarInHeader.getAttribute('src');

        await expect(updatedAvatarSrc?.startsWith('data:')).toBeTruthy();
        await expect(
          updatedAvatarInHeaderSrc?.startsWith('data:'),
        ).toBeTruthy();
        // Avatars in the profile and header should be the same
        await expect(page.getByTestId('user-profile-avatar')).toHaveAttribute(
          'src',
          (await page
            .getByTestId('header-avatar')
            .getAttribute('src')) as string,
        );

        await expect(removeAvatarButton).toBeHidden();
      });

      await test.step('Uploading avatar', async () => {
        const avatarUploader = page.getByTestId('avatar-uploader');
        const avatar = page.getByTestId('user-profile-avatar');

        await expect(avatarUploader).toBeVisible();

        await expect(avatar).toBeVisible();
        await expect(avatar).toHaveAttribute('src', /data:/);

        // Upload a valid image
        const uploadInput = page.locator('input[type="file"]');

        await page.getByRole('button', { name: 'Change avatar' }).click();

        await page.getByRole('button', { name: 'Click to upload' }).waitFor({
          state: 'visible',
        });

        await uploadInput.setInputFiles(validImagePath);

        await expect(avatar).toHaveAttribute('src', /data:/);

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /profile image changed successfully/i })
            .last(),
        ).toBeVisible();

        // Upload an invalid image
        await page.getByRole('button', { name: /change avatar/i }).click();
        await uploadInput.setInputFiles(invalidImagePath);

        // Verify that the error message is displayed
        await expect(
          page.getByText(/File size is too large, it should not exceed 1MB/i),
        ).toBeVisible();

        await expect(
          page.getByRole('button', { name: 'Try again' }),
        ).toBeVisible();

        await expect(page.getByTestId('file-remove')).toBeVisible();

        await expect(
          page.getByRole('button', { name: 'Click to upload' }),
        ).toBeHidden();
      });
    });

    test('Website field', async ({ page }) => {
      const websiteInput = page.locator('[name="website"]');

      const saveChangesButton = page.getByRole('button', {
        name: 'Save changes',
      });
      await expect(page.getByText('Website', { exact: true })).toBeVisible();
      await expect(page.getByText('Your website is optional')).toBeVisible();
      await expect(websiteInput).toBeEnabled();

      // Verify that the website field is pre-filled with the user's website
      await expect(websiteInput.inputValue).toBeTruthy();

      await test.step('Shows an error message when the website is invalid', async () => {
        await fillInputWithDelay({
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
        await fillInputWithDelay({
          page,
          selector: '[name="website"]',
          value: '',
        });

        await saveChangesButton.click();
        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();
        await expect(websiteInput).toHaveValue('');
        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeHidden();
      });

      await test.step('Accepts a valid website', async () => {
        const website = 'https://colony.io';

        await fillInputWithDelay({
          page,
          selector: '[name="website"]',
          value: website,
        });
        await saveChangesButton.click();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();

        await expect(websiteInput).toHaveValue(`${website}/`);
        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeHidden();
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

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeHidden();
      });

      await test.step('Accepts a valid value', async () => {
        const text = 'This is my bio';

        await bioInput.clear();
        await fillInputWithDelay({
          page,
          selector: '[name="bio"]',
          value: text,
        });

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();

        await expect(bioInput).toHaveValue(text);
      });
    });

    test('Location field', async ({ page }) => {
      await expect(page.getByText(/Location/)).toBeVisible();
      await expect(
        page.getByText(
          /Your location is optional and only shown on your Colony profile/,
        ),
      ).toBeVisible();

      const locationInput = page.locator('[name="location"]');

      await test.step('The field is not required', async () => {
        await locationInput.clear();

        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeHidden();
      });

      await test.step('Accepts a valid value', async () => {
        const location = 'New York';

        await locationInput.clear();
        await fillInputWithDelay({
          page,
          selector: '[name="location"]',
          value: location,
        });

        await page.getByRole('button', { name: /save changes/i }).click();

        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeVisible();

        await expect(locationInput).toHaveValue(location);
        await expect(
          page
            .getByRole('alert')
            .filter({ hasText: /action completed successfully/i })
            .last(),
        ).toBeHidden();
      });
    });
  });

  test.describe('Preferences section', () => {
    test.beforeEach(async ({ page }) => {
      await page
        .getByTestId('account-page-sidebar')
        .getByLabel('/account/preferences')
        .click();
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
        await fillInputWithDelay({
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

        await fillInputWithDelay({
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

        await fillInputWithDelay({
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

      await expect(
        page.getByText(clipboardText, { exact: true }),
      ).toBeVisible();
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

      await expect(
        page.getByRole('heading', { name: /Mention/ }),
      ).toBeVisible();

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

      await page.getByTestId('notifications-toggle').click();
    });
  });

  test.describe('Advanced Settings section', () => {
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

      await expect(
        page.getByText(/disabling this option means/i),
      ).toBeVisible();
    });
  });
});
