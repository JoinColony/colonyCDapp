import { expect, test } from '@playwright/test';

import { acceptCookieConsentBanner } from '../utils/common.ts';
import {
  generateRandomString,
  selectWalletAndUserProfile,
} from '../utils/create-colony.ts';
import { generateCreateColonyUrl } from '../utils/graphqlHelpers.ts';

test.describe('Create Colony flow', () => {
  const colonyName = 'testcolonyname';

  test.beforeEach(async ({ page }) => {
    const colonyUrl = await generateCreateColonyUrl();

    await page.goto(colonyUrl);

    await selectWalletAndUserProfile(page);

    await acceptCookieConsentBanner(page);
  });
  test.describe('Details step', () => {
    test('Should render Details step correctly', async ({ page }) => {
      // Heading of the step and form is shown
      await Promise.all([
        expect(
          page
            .getByTestId('onboarding-heading')
            .filter({ hasText: /Welcome/i }),
        ).toBeVisible(),
        expect(
          page
            .getByTestId('onboarding-subheading')
            .filter({ hasText: /Let’s set up your Colony/i }),
        ).toBeVisible(),
        expect(page.getByLabel(/colony name/i)).toBeVisible(),
        expect(page.getByLabel(/custom colony URL/i)).toBeVisible(),
        expect(page.getByRole('button', { name: /continue/i })).toBeVisible(),
      ]);
      // Sidebar navigation and its components are visible
      const sidebarNav = page.getByRole('navigation');

      await Promise.all([
        expect(sidebarNav.getByText(/create your new colony/i)).toBeVisible(),
        expect(sidebarNav.getByText('Create', { exact: true })).toBeVisible(),
        expect(sidebarNav.getByText('Details')).toBeVisible(),
        expect(sidebarNav.getByText('Native Token')).toBeVisible(),
        expect(sidebarNav.getByText('Confirmation')).toBeVisible(),
        expect(sidebarNav.getByText('Complete')).toBeVisible(),
        expect(
          sidebarNav.getByRole('button', { name: 'Help & Feedback' }),
        ).toBeVisible(),
      ]);
    });

    test('Should accept a valid Colony Name and Custom URL and navigate to the next step', async ({
      page,
    }) => {
      // continue button is disabled initially
      await expect(
        page.getByRole('button', { name: /continue/i }),
      ).toBeDisabled();

      // Fill in colony name and custom URL
      await page.getByLabel(/colony Name/i).fill(colonyName);
      await page.getByLabel(/custom colony URL/i).fill(generateRandomString());

      // Check if URL is available
      await expect(page.getByText(/URL available/i)).toBeVisible();

      // Click continue and verify navigation to the next step
      await page.getByRole('button', { name: /continue/i }).click();
      await expect(
        page.getByRole('heading', { name: /creating a new native token/i }),
      ).toBeVisible();
    });

    test('Should show an error message when the Colony URL is already taken', async ({
      page,
    }) => {
      // Mock the response for the 'CheckColonyNameExists' query
      page.route('**/graphql', (route, request) => {
        const postData = request.postDataJSON();

        if (postData.operationName === 'CheckColonyNameExists') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                getColonyByName: {
                  items: ['someColonyId'],
                  __typename: 'ModelColonyConnection',
                },
              },
            }),
          });
        } else {
          route.continue();
        }
      });

      const colonyUrlField = page.getByLabel(/custom colony URL/i);

      await colonyUrlField.fill('takenurl');

      await page.getByLabel(/colony name/i).focus();

      await expect(
        page.getByText(/This colony URL is already taken/i),
      ).toBeVisible();
    });

    test('Should reject invalid colony name', async ({ page }) => {
      // More than 20 characters
      await page.getByLabel(/colony name/i).fill('A'.repeat(21));

      await expect(page.getByTestId('form-error')).toBeVisible();
    });

    test("Should reject invalid custom colony URL's", async ({ page }) => {
      await test.step('Invalid name', async () => {
        await page.getByLabel(/custom colony URL/i).fill('invalid name');

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('Contains invalid character', async () => {
        await page.getByLabel(/custom colony URL/i).fill('/invalid');

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('More than 20 characters', async () => {
        await page.getByLabel(/custom colony URL/i).fill('a'.repeat(21));

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('Reserved keyword', async () => {
        await page.getByLabel(/custom colony URL/i).fill('account');

        await expect(page.getByTestId('form-error')).toBeVisible();
      });
    });
  });
});
