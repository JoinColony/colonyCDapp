import { expect, test } from '@playwright/test';

import {
  fillInput,
  selectWallet,
  setCookieConsent,
  generateRandomString,
} from '../utils/common.ts';
import {
  fillColonyNameStep,
  fillNativeTokenStepWithExistingToken,
} from '../utils/create-colony.ts';
import {
  fetchFirstValidTokenAddress,
  generateCreateColonyUrl,
  getColonyAddressByName,
} from '../utils/graphqlHelpers.ts';

test.describe('Create Colony flow', () => {
  const colonyName = 'testcolonyname';

  test.beforeEach(async ({ page, context, baseURL }) => {
    await setCookieConsent(context, baseURL);
    const colonyUrl = await generateCreateColonyUrl();

    await page.goto(colonyUrl);

    await selectWallet(page, /dev wallet 1$/i);
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
      await fillInput({
        page,
        label: /colony name/i,
        value: colonyName,
      });

      await fillInput({
        page,
        label: /custom colony URL/i,
        value: generateRandomString(),
      });

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

      await fillInput({
        page,
        label: /custom colony URL/i,
        value: 'takenurl',
      });

      await expect(
        page.getByText(/This colony URL is already taken/i),
      ).toBeVisible();
    });

    test('Should reject invalid colony name', async ({ page }) => {
      // More than 20 characters
      await fillInput({
        page,
        label: /colony name/i,
        value: 'A'.repeat(21),
      });

      await expect(page.getByTestId('form-error')).toBeVisible();
    });

    test("Should reject invalid custom colony URL's", async ({ page }) => {
      await test.step('Invalid value', async () => {
        await fillInput({
          page,
          label: /custom colony URL/i,
          value: 'invalid name',
        });

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('Contains invalid character', async () => {
        await page.getByLabel(/custom colony URL/i).clear();

        await fillInput({
          page,
          label: /custom colony URL/i,
          value: '/invalid',
        });

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('More than 20 characters', async () => {
        await page.getByLabel(/custom colony URL/i).clear();

        await fillInput({
          page,
          label: /custom colony URL/i,
          value: 'a'.repeat(21),
        });

        await expect(page.getByTestId('form-error')).toBeVisible();
      });

      await test.step('Reserved keyword', async () => {
        await page.getByLabel(/custom colony URL/i).clear();

        await fillInput({
          page,
          label: /custom colony URL/i,
          value: 'account',
        });

        await expect(page.getByTestId('form-error')).toBeVisible();
      });
    });
  });

  test.describe('Native Token step', () => {
    const invalidToken = 'invalidtoken';

    test.beforeEach(async ({ page }) => {
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: generateRandomString(),
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

      await expect(
        page.getByRole('button', { name: 'Back', exact: true }),
      ).toBeVisible();

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

      await fillInput({
        page,
        label: /token name/i,
        value: tokenName,
      });

      await fillInput({
        page,
        label: /token symbol/i,
        value: tokenSymbol,
      });

      // The entered token name and symbol should persist after navigating forward and back

      await page.getByRole('button', { name: /continue/i }).click();
      await page.getByRole('button', { name: 'Back', exact: true }).click();

      await page
        .getByLabel(/Create a new token/i)
        .waitFor({ state: 'visible' });

      await expect(page.getByLabel(/token name/i)).toHaveValue(tokenName);
      await expect(page.getByLabel(/token symbol/i)).toHaveValue(tokenSymbol);
    });

    test('Should accept and validate existing token properly', async ({
      page,
    }) => {
      const validImage = 'playwright/fixtures/images/jaya-the-beast_400KB.png';

      const invalidImage =
        'playwright/fixtures/images/cat-image-new-1_3_MB.png';

      // Select New token option
      await page.getByLabel(/Create a new token/i).check();
      await page.getByRole('button', { name: /continue/i }).click();

      // Upload valid image
      const tokenImageInput = page.locator('input[type="file"]');
      await tokenImageInput.setInputFiles(validImage);

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

      await test.step('Should not accept incorrectly formatted token address', async () => {
        await fillInput({
          page,
          label: /existing token address/i,
          value: invalidToken,
        });

        await expect(page.getByText(/Invalid address/i)).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeDisabled();
      });

      await test.step('Should not accept correctly formatted, but a User address', async () => {
        const userAddress = '0x3a965407cEd5E62C5aD71dE491Ce7B23DA5331A4';

        await page.getByLabel(/Existing token address/i).clear();

        await fillInput({
          page,
          label: /existing token address/i,
          value: userAddress,
        });

        await expect(
          page.getByText(/Fetching your token's details/i),
        ).toBeVisible();
        await expect(
          page.getByText(
            /Token data not found. Please check the token contract address/i,
          ),
        ).toBeVisible();

        await expect(
          page.getByText(/Is the address definitely correct?/i),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeDisabled();
      });

      await test.step("Should not accept an 'address zero'", async () => {
        const addressZero = '0x0000000000000000000000000000000000000000';

        await page.getByLabel(/existing token address/i).clear();

        await fillInput({
          page,
          label: /existing token address/i,
          value: addressZero,
        });

        await expect(
          page.getByText(/Fetching your token's details/i),
        ).toBeVisible();
        await expect(
          page.getByText(
            /You cannot use ETH token as a native token for colony/i,
          ),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeDisabled();
      });

      await test.step('Should not accept correctly formatted, but a colony address', async () => {
        const colonyAddress = await getColonyAddressByName();

        await page.getByLabel(/existing token address/i).clear();

        await fillInput({
          page,
          label: /existing token address/i,
          value: colonyAddress,
        });

        await expect(
          page.getByText(/Fetching your token's details/i),
        ).toBeVisible();
        await expect(
          page.getByText(
            /Token data not found. Please check the token contract address/i,
          ),
        ).toBeVisible();
        await expect(
          page.getByText(/Is the address definitely correct?/i),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeDisabled();
      });

      await test.step('Should not accept correctly formatted, but not existing token address', async () => {
        // This mocked address passes client side validation but fails on BE side
        const notExistingToken = '0x6b175474e89094c44da98b954eedeac495271d0f';

        await page.getByLabel(/existing token address/i).clear();

        await fillInput({
          page,
          label: /existing token address/i,
          value: notExistingToken,
        });

        await expect(
          page.getByText(/Fetching your token's details/i),
        ).toBeVisible();
        await expect(
          page.getByText(
            /Token data not found. Please check the token contract address/i,
          ),
        ).toBeVisible();
        await expect(
          page.getByText(/Is the address definitely correct?/i),
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeDisabled();
      });

      await test.step('Should accept correctly formatted, and existing token address', async () => {
        const existingToken = await fetchFirstValidTokenAddress();

        await page.getByLabel(/existing token address/i).clear();

        await fillInput({
          page,
          label: /existing token address/i,
          value: existingToken,
        });

        await expect(page.getByText(/Invalid address/i)).toBeHidden();
        await expect(
          page.getByText(
            /Token data not found. Please check the token contract address/i,
          ),
        ).toBeHidden();
        await expect(page.getByText(/Token found:/i)).toBeVisible();
        await expect(
          page.getByRole('button', { name: /continue/i }),
        ).toBeEnabled();
      });
    });
  });

  test.describe('Confirmation step', () => {
    let existingToken: string;
    test.beforeAll(async () => {
      existingToken = await fetchFirstValidTokenAddress();
    });
    test('Should render Confirmation step as expected', async ({ page }) => {
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: generateRandomString(),
      });
      await fillNativeTokenStepWithExistingToken(page, existingToken);
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

      await expect(
        page.getByRole('button', { name: 'Back', exact: true }),
      ).toBeVisible();

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
      const customColonyURL = generateRandomString();
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: customColonyURL,
      });

      await fillNativeTokenStepWithExistingToken(page, existingToken);

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
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: generateRandomString(),
      });
      await fillNativeTokenStepWithExistingToken(page, existingToken);

      await page
        .getByTestId('colony-token-card')
        .getByRole('button', { name: 'Edit' })
        .click();

      await expect(page.getByLabel(/Existing token address/i)).toBeVisible();
      await expect(page.getByLabel(/Existing token address/i)).toHaveValue(
        existingToken,
      );
    });

    test('Should create a colony and navigate to the newly created colony URL', async ({
      page,
    }) => {
      const colonyURL = generateRandomString();
      await fillColonyNameStep(page, {
        nameFieldValue: colonyName,
        urlFieldValue: colonyURL,
      });
      await fillNativeTokenStepWithExistingToken(page, existingToken);

      await page.getByRole('button', { name: /continue/i }).click();

      await expect(
        page
          .getByTestId('onboarding-heading')
          .filter({ hasText: /Complete setup/i }),
      ).toBeVisible();
      await expect(
        page.getByTestId('onboarding-subheading').filter({
          hasText:
            /Deploying to the blockchain requires you to sign a transaction in your wallet for each step/i,
        }),
      ).toBeVisible();

      // Expect the transition to the newly created colony URL
      await page.waitForURL(colonyURL);

      // Expect the Colony Created dialog to be visible
      const colonyCreateDialog = page
        .getByRole('dialog')
        .filter({ hasText: /Congratulations/i });
      await expect(colonyCreateDialog).toBeVisible({ timeout: 10000 });

      await expect(
        colonyCreateDialog.getByRole('button', {
          name: /explore your colony/i,
        }),
      ).toBeVisible();
      // This section is not shown on first time creation of a colony by a given user
      const isInviteBlockPresent = await colonyCreateDialog
        .getByRole('heading', {
          name: /Invite a person to create a Colony/i,
        })
        .isVisible();

      // eslint-disable-next-line playwright/no-conditional-in-test
      if (isInviteBlockPresent) {
        await expect(
          colonyCreateDialog.getByRole('button', { name: /copy/i }),
        ).toBeVisible();

        await expect(
          colonyCreateDialog.getByText(/\/create-colony\/.*/),
        ).toBeVisible();

        await expect(
          colonyCreateDialog.getByRole('heading', {
            name: /Invite a person to create a Colony/i,
          }),
        ).toBeVisible();
      }
    });
  });
});
