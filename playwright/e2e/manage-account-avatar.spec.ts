/* eslint-disable playwright/no-skipped-test */
import { test, expect } from '@playwright/test';
import path from 'node:path';

import { selectWallet, setCookieConsent } from '../utils/common.ts';

test.describe('Avatar Uploader on Manage Account page', () => {
  test.beforeEach(async ({ page, baseURL, context }) => {
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

  test('accepts valid PNG file with correct dimensions', async ({ page }) => {
    const validPng = path.join(
      __dirname,
      '../fixtures/images/valid-avatar-300x300.png',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(validPng);

    await page.getByRole('button', { name: 'Click to upload' }).waitFor({
      state: 'hidden',
    });
    await expect(
      page.getByRole('button', { name: 'Remove avatar' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('avatar-uploader-error-content'),
    ).toBeHidden();
  });

  test('accepts valid JPG file with correct dimensions', async ({ page }) => {
    const validJpg = path.join(
      __dirname,
      '../fixtures/images/valid-avatar-300x300.jpg',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(validJpg);

    await page.getByRole('button', { name: 'Click to upload' }).waitFor({
      state: 'hidden',
    });
    await expect(
      page.getByRole('button', { name: 'Remove avatar' }),
    ).toBeVisible();

    await expect(
      page.getByTestId('avatar-uploader-error-content'),
    ).toBeHidden();
  });

  test('accepts valid SVG file with correct dimensions', async ({ page }) => {
    const validSvg = path.join(
      __dirname,
      '../fixtures/images/valid-avatar-300x300.svg',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(validSvg);

    await page.getByRole('button', { name: 'Click to upload' }).waitFor({
      state: 'hidden',
    });

    await expect(
      page.getByRole('button', { name: 'Remove avatar' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('avatar-uploader-error-content'),
    ).toBeHidden();
  });
  // NOTE: enable this test once we have fixed issue #3858 with the avatar uploader
  test.skip('rejects file smaller than 120x120px', async ({ page }) => {
    const smallImage = path.join(
      __dirname,
      '../fixtures/images/small-avatar-200x200.png',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(smallImage);

    await expect(
      // The error message to be confirmed
      page.getByText(/Image must be at least 120x120px/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test('rejects file larger than 1MB', async ({ page }) => {
    const largeImage = path.join(
      __dirname,
      '../fixtures/images/cat-image-new-1_3_MB.png',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(largeImage);

    await expect(
      page.getByText(/File size is too large, it should not exceed 1MB/i),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(page.getByTestId('file-remove')).toBeVisible({
      timeout: 10000,
    });
  });

  test('rejects unsupported file format', async ({ page }) => {
    const gifImage = path.join(__dirname, '../fixtures/images/avatar.gif');

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(gifImage);

    await expect(
      page.getByText(/Incorrect file format, must be .PNG, .JPG, or .SVG/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test('shows preview of uploaded image', async ({ page }) => {
    const validPng = path.join(
      __dirname,
      '../fixtures/images/valid-avatar-300x300.png',
    );

    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(validPng);

    await expect(page.getByTestId('user-profile-avatar')).toBeVisible();
    await expect(page.getByTestId('user-profile-avatar')).toHaveAttribute(
      'src',
      /data:/,
    );

    // Check header avatar is also updated
    await expect(page.getByTestId('header-avatar')).toHaveAttribute(
      'src',
      (await page
        .getByTestId('user-profile-avatar')
        .getAttribute('src')) as string,
    );
  });

  test('allows removing uploaded image', async ({ page }) => {
    const validPng = path.join(
      __dirname,
      '../fixtures/images/valid-avatar-300x300.png',
    );

    // Upload image first
    await page.getByRole('button', { name: 'Change avatar' }).click();
    await page.locator('input[type="file"]').setInputFiles(validPng);

    // Wait for upload to complete
    await page.getByRole('alert').waitFor();
    await expect(page.getByRole('alert').last()).toContainText(
      /profile image changed successfully/i,
    );

    // Remove the avatar
    await page.getByRole('button', { name: 'Remove avatar' }).click();

    // Verify removal
    await page.getByRole('alert').waitFor();
    await expect(page.getByRole('alert').last()).toContainText(
      /profile image changed successfully/i,
    );
    await expect(
      page.getByRole('button', { name: 'Remove avatar' }),
    ).toBeHidden({ timeout: 10000 });
  });
});
