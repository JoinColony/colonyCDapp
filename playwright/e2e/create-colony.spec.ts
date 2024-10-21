import { expect, test } from '@playwright/test';

import {
  invalidColonyNameFieldValues,
  invalidColonyURLFieldValues,
  validColonyNameFieldValues,
  validColonyURLFieldValues,
} from '../fixtures/colony.ts';
import {
  fillColonyNameStep,
  fillNativeTokenStepWithExistingToken,
  generateRandomString,
  selectWalletAndUserProfile,
} from '../utils/create-colony.ts';
import {
  fetchFirstValidTokenAddress,
  generateCreateColonyUrl,
} from '../utils/graphqlHelpers.ts';

test.describe('Create Colony flow', () => {
  let colonyUrl: string;
  const colonyName = 'testcolonyname';
  let validToken: string;
  const invalidToken = 'invalidtoken';
  let customColonyURL = '';
  test.beforeAll(async () => {
    customColonyURL = generateRandomString();
    colonyUrl = await generateCreateColonyUrl();
    validToken = await fetchFirstValidTokenAddress();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(colonyUrl);

    await selectWalletAndUserProfile(page);
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
          sidebarNav.getByRole('link', { name: /visit our docs/i }),
        ).toHaveAttribute('href', 'https://docs.colony.io/'),
      ]);
    });

    test('Should accept a valid Colony Name and Custom URL and navigate to the next step', async ({
      page,
    }) => {
      const continueButton = page.getByRole('button', { name: /continue/i });
      // continue button is disabled initially
      await expect(continueButton).toBeDisabled();

      // Fill in colony name and custom URL
      await page.getByLabel(/colony Name/i).fill(colonyName);
      await page.getByLabel(/custom colony URL/i).fill(customColonyURL);
      await page.getByLabel(/custom colony URL/i).blur();

      // Check if URL is available
      await expect(page.getByText(/URL available/i)).toBeVisible();

      // Click continue and verify navigation to the next step
      await continueButton.click();
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

    test.describe('Colony Name and URL validation', () => {
      const validData = [
        { field: 'colony name', values: validColonyNameFieldValues },
        { field: 'custom colony URL', values: validColonyURLFieldValues },
      ];

      const invalidData = [
        { field: 'colony name', values: invalidColonyNameFieldValues },
        { field: 'custom colony URL', values: invalidColonyURLFieldValues },
      ];

      for (const { field, values } of validData) {
        test(`Should accept valid ${field}`, async ({ page }) => {
          const inputField = page.getByLabel(new RegExp(field, 'i'));

          for (const value of values) {
            await inputField.fill(value);
            await inputField.blur();

            await expect(page.getByTestId('form-error')).toBeHidden();
          }
        });
      }

      for (const { field, values } of invalidData) {
        test(`Should reject invalid ${field}`, async ({ page }) => {
          const inputField = page.getByLabel(new RegExp(field, 'i'));

          for (const value of values) {
            await inputField.fill(value);
            await inputField.blur();

            await expect(page.getByTestId('form-error')).toBeVisible();
          }
        });
      }
    });
  });

  test.describe('Native Token step', () => {
    test.beforeEach(async ({ page }) => {
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: customColonyURL,
      });
    });

    test('Should render Native Token step correctly', async ({ page }) => {
      await expect(
        page.getByRole('heading', {
          name: /Creating a new native token or use existing?/i,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: /continue/i }),
      ).toBeVisible();

      await expect(page.getByRole('button', { name: /back/i })).toBeVisible();

      await expect(page.getByLabel(/Create a new token/i)).toBeVisible();

      await expect(page.getByLabel(/Use an existing token/i)).toBeVisible();
    });

    test('Should accept New Colony Token data and navigate to new step', async ({
      page,
    }) => {
      const tokenName = 'Test Token Name';
      const tokenSymbol = 'TTN';

      await page.getByLabel(/Create a new token/i).check();
      await page.getByRole('button', { name: /continue/i }).click();

      await expect(
        page.getByRole('heading', { name: /Your Colony's native token/i }),
      ).toBeVisible();

      await expect(page.getByLabel(/Create a new token/)).toBeChecked();

      await expect(page.getByLabel(/Use an existing token/i)).not.toBeChecked();

      await page.getByLabel(/token name/i).fill(tokenName);

      await page.getByLabel(/token symbol/i).fill(tokenSymbol);

      // The entered token name and symbol should persist after navigating forward and back

      await page.getByRole('button', { name: /continue/i }).click();
      await page.getByRole('button', { name: /back/i }).click();

      await expect(page.getByLabel(/token name/i)).toHaveValue(tokenName);
      await expect(page.getByLabel(/token symbol/i)).toHaveValue(tokenSymbol);
    });

    test('Token Logo file uploader should work correctly', async ({ page }) => {
      const validFilePath =
        'playwright/fixtures/images/jaya-the-beast_400KB.png';

      const invalidImage =
        'playwright/fixtures/images/cat-image-new-1_3_MB.png';

      // Select New token option
      await page.getByLabel(/Create a new token/i).check();
      await page.getByRole('button', { name: /continue/i }).click();

      // Upload valid image
      const tokenImageInput = page.locator('input[type="file"]');
      await tokenImageInput.setInputFiles(validFilePath);

      await expect(
        page.getByRole('button', { name: /change logo/i }),
      ).toBeVisible();

      const tokenLogo = page.getByRole('img', { name: /avatar of token/i });
      await expect(tokenLogo).toBeVisible();

      // Removing the image
      await page.getByRole('button', { name: /remove/i }).click();
      await expect(tokenLogo).toBeHidden();

      // Uploading invalid image
      await tokenImageInput.setInputFiles(invalidImage);

      // Validation message appears
      const message = page.getByText(
        /File size is too large, it should not exceed 1MB/i,
      );
      await expect(message).toBeVisible();
      await expect(
        page.getByRole('button', { name: /try again/i }),
      ).toBeEnabled();

      await page.getByTestId('file-remove').click();

      await expect(message).toBeHidden();
      await expect(page.getByTestId('file-remove')).toBeHidden();
      await expect(
        page.getByRole('button', { name: /try again/i }),
      ).toBeHidden();
    });

    test('Should accept existing token and display validation message', async ({
      page,
    }) => {
      await page.getByLabel(/Use an existing token/i).check();
      await page.getByRole('button', { name: /continue/i }).click();

      await expect(page.getByLabel(/Use an existing token/)).toBeChecked();

      await expect(page.getByLabel(/Create a new token/i)).not.toBeChecked();
      const input = page.getByLabel(/Existing token address/i);
      await input.fill(invalidToken);

      await expect(page.getByText(/Invalid address/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /continue/i }),
      ).toBeDisabled();
      await input.fill(validToken);
      await expect(page.getByText(/Invalid address/i)).toBeHidden();
      await expect(page.getByText(/Token found:/i)).toBeVisible();
      await expect(
        page.getByRole('button', { name: /continue/i }),
      ).toBeEnabled();
    });
  });

  test.describe('Confirmation step', () => {
    test.beforeEach(async ({ page }) => {
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: customColonyURL,
      });
    });

    test('Should render Confirmation step as expected', async ({ page }) => {
      await fillNativeTokenStepWithExistingToken(page, validToken);
      // Heading of the Step
      await expect(
        page.getByText(/Confirm your Colony’s details/i),
      ).toBeVisible();
      // Subheading
      await expect(
        page.getByText(
          /Check to ensure your Colony’s details are correct as they can not be changed later/i,
        ),
      ).toBeVisible();

      const colonyNameCard = page.getByTestId('colony-details-card');
      const colonyTokenCard = page.getByTestId('colony-token-card');

      await expect(colonyNameCard.getByText('testcolonyname')).toBeVisible();

      await expect(
        colonyNameCard.getByRole('button', { name: 'Edit' }),
      ).toBeEnabled();

      await expect(
        colonyTokenCard.getByText('DAI for Local Development'),
      ).toBeVisible();

      await expect(
        colonyTokenCard.getByRole('button', { name: 'Edit' }),
      ).toBeEnabled();

      await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();

      await expect(
        page.getByRole('img', {
          name: /Avatar of token DAI for Local Development/i,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole('button', { name: /continue/i }),
      ).toBeEnabled();
    });

    test('Should navigate to Details step when Edit colony details is clicked', async ({
      page,
    }) => {
      await fillNativeTokenStepWithExistingToken(page, validToken);

      await page
        .getByTestId('colony-details-card')
        .getByRole('button', { name: 'Edit' })
        .click();

      await expect(page.getByLabel(/Colony name/i)).toBeVisible();
      await expect(page.getByLabel(/Colony name/i)).toHaveValue(colonyName);
      await expect(page.getByLabel(/Custom Colony URL/i)).toBeVisible();
      await expect(page.getByLabel(/Custom Colony URL/i)).toHaveValue(
        customColonyURL,
      );
    });

    test('Should navigate to Native token step when Edit token is clicked', async ({
      page,
    }) => {
      await fillNativeTokenStepWithExistingToken(page, validToken);

      await page
        .getByTestId('colony-token-card')
        .getByRole('button', { name: 'Edit' })
        .click();

      await expect(page.getByLabel(/Existing token address/i)).toBeVisible();
      await expect(page.getByLabel(/Existing token address/i)).toHaveValue(
        validToken,
      );
    });

    test('Should create a colony and navigate to the Complete Setup step', async ({
      page,
    }) => {
      await fillNativeTokenStepWithExistingToken(page, validToken);

      await page.getByRole('button', { name: /continue/i }).click();

      await expect(page.getByText(/Complete setup/i)).toBeVisible();
      await expect(
        page.getByText(
          /Deploying to the blockchain requires you to sign a transaction in your wallet for each step/i,
        ),
      ).toBeVisible();
    });
  });
});
