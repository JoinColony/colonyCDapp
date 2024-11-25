/* eslint-disable playwright/no-conditional-in-test */
import { expect, test } from '@playwright/test';

import { selectWallet, setCookieConsent, fillInput } from '../utils/common.ts';

const validImagePath = 'playwright/fixtures/images/jaya-the-beast_400KB.png';
const invalidImagePath = 'playwright/fixtures/images/cat-image-new-1_3_MB.png';

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

    test('Avatar', async ({ page }) => {
      const toast = page
        .getByRole('alert')
        .filter({ hasText: /profile image changed successfully/i })
        .last();
      await test.step('Removing Avatar', async () => {
        const removeAvatarButton = page.getByRole('button', {
          name: 'Remove avatar',
        });
        const avatarUploader = page.getByTestId('avatar-uploader');
        const avatar = page.getByTestId('user-profile-avatar');
        const avatarInHeader = page.getByTestId('header-avatar');

        if (!(await removeAvatarButton.isVisible())) {
          // Upload a valid image
          const uploadInput = page.locator('input[type="file"]');

          await page.getByRole('button', { name: 'Change avatar' }).click();

          await uploadInput.setInputFiles(validImagePath);

          await removeAvatarButton.waitFor({ state: 'visible' });
        }

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

        await toast.waitFor({ state: 'visible' });

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

        await expect(toast).toBeVisible();

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
      // Verify that the website field is pre-filled with the user's website
      await expect(websiteInput).toHaveValue(/.+/);

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
