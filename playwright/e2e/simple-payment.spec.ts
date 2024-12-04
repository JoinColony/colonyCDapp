import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { setCookieConsent } from '../utils/common.ts';
import {
  closeSimplePaymentDrawer,
  openSimplePaymentDrawer,
  signInAndNavigateToColony,
  tooltipMessages,
  validationMessages,
} from '../utils/simple-payment.ts';

test.describe('Simple payment', () => {
  test.describe('User has required permissions', () => {
    let page: Page;
    let context: BrowserContext;

    test.beforeAll(async ({ browser, baseURL }) => {
      context = await browser.newContext();
      page = await context.newPage();

      await setCookieConsent(context, baseURL);

      await signInAndNavigateToColony(page, {
        colonyUrl: '/planex',
        wallet: /dev wallet 1$/i,
      });
    });

    test.afterAll(async () => {
      await context?.close();
    });

    test.beforeEach(async () => {
      await openSimplePaymentDrawer(page);
    });

    test.afterEach(async () => {
      await closeSimplePaymentDrawer(page);
    });

    test('Should successfully create a simple payment', async () => {
      const actionDrawer = page.getByTestId('action-drawer');
      const actionForm = page.getByTestId('action-form');

      const menu = page.getByTestId('search-select-menu');
      const memberAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

      await actionForm.getByPlaceholder('Enter title').fill('Pay fry');

      await expect(
        actionForm.getByRole('button', { name: 'Simple payment' }),
      ).toBeVisible();

      await actionForm.getByRole('button', { name: 'Select team' }).click();
      await menu.getByRole('button', { name: 'General' }).click();
      await actionForm.getByLabel('Select user').click();
      await page.getByPlaceholder('Search or add wallet address').click();
      await page
        .getByPlaceholder('Search or add wallet address')
        .fill(memberAddress);
      await page
        .getByRole('button', {
          name: memberAddress,
        })
        .click();

      await actionForm.getByPlaceholder('Enter amount').fill('1');
      await actionForm.getByRole('button', { name: 'Select method' }).click();
      await page.getByRole('button', { name: 'Permissions' }).click();
      // await actionForm
      //   .getByRole('button', { name: 'Enter a description' })
      //   .click();
      // await actionForm
      //   .locator('[contenteditable="true"]')
      //   .pressSequentially('**A simple payment**');

      await expect(
        actionForm.getByText(/^Pay \w+ 1 CREDS by \w+$/i),
      ).toBeVisible();
      await actionForm.getByRole('button', { name: 'Create payment' }).click();

      await actionForm
        .getByRole('button', { name: 'Pending' })
        .first()
        .waitFor({ state: 'visible' });

      await actionForm.waitFor({ state: 'hidden' });
      await page.waitForURL(/planex\?tx=/);
      await page
        .getByTestId('loading-skeleton')
        .last()
        .waitFor({ state: 'hidden' });

      await expect(
        actionDrawer.getByText(
          /Member used permissions to create this action/i,
        ),
      ).toBeVisible();
    });

    test('Should display validation errors for required fields and invalid inputs', async () => {
      const actionDrawer = page.getByTestId('action-drawer');
      const actionForm = actionDrawer.getByTestId('action-form');
      const titleField = actionForm.getByPlaceholder('Enter title');
      const amountField = actionForm.getByPlaceholder('Enter amount');

      const errorNotification = actionForm.getByTestId('action-sidebar-error');
      const submitPaymentButton = actionForm.getByRole('button', {
        name: 'Create payment',
      });

      // Verify the errors are shown when required fields are empty
      await submitPaymentButton.click();

      await errorNotification.waitFor({ state: 'visible' });
      // Verify there is an error for each field
      for (const message of validationMessages.allRequiredFields) {
        await expect(actionForm.getByText(message)).toBeVisible();
      }

      // Enter more than 60 chars in the Title field
      await titleField.fill(
        'This is a test title that exceeds the maximum character limit of sixty.',
      );

      await expect(
        actionDrawer.getByText(validationMessages.title.maxLengthExceeded),
      ).toBeVisible();
      // Enter amount more than the maximum available
      await amountField.fill('100_000_000_000_000_000_000_000');

      await submitPaymentButton.click();

      await expect(
        actionDrawer.getByText(validationMessages.amount.maxExceeded),
      ).toBeVisible();

      // Very small amount value should be accepted
      await amountField.fill('0.0000000000000000000000001');

      await expect(
        actionDrawer.getByText(validationMessages.amount.mustBeGreaterThanZero),
      ).toBeHidden();
    });

    test('Should display tooltips and user info on hover and click actions', async () => {
      const actionForm = page.getByTestId('action-form');
      await actionForm.getByText('From', { exact: true }).hover();

      await expect(page.getByText(tooltipMessages.from)).toBeVisible();

      await actionForm.getByText('Recipient').nth(1).hover();

      await expect(page.getByText(tooltipMessages.recipient)).toBeVisible();

      await actionForm.getByText('Amount', { exact: true }).hover();

      await expect(page.getByText(tooltipMessages.amount)).toBeVisible({
        timeout: 10000,
      });

      await actionForm.getByText('Decision method').hover();

      await expect(
        page.getByText(tooltipMessages.decisionMethod),
      ).toBeVisible();

      // Verify the User info is shown when clicking on the username
      await actionForm
        .getByTestId('action-sidebar-description')
        .getByRole('button')
        .click();

      await expect(page.getByTestId('user-info')).toBeVisible();

      // Verify select token modal is shown when clicking on the token
      await actionForm.getByRole('button', { name: 'Select token' }).click();

      await expect(page.getByTestId('token-list')).toBeVisible();
    });

    test('Should display the confirmation modal when the user tries to close the form', async () => {
      const simplePaymentForm = page.getByTestId('action-form');
      const dialog = page
        .getByRole('dialog')
        .filter({ hasText: 'Do you wish to cancel the action creation?' });
      await simplePaymentForm.getByPlaceholder('Enter title').fill('Pay Fry');

      await page.getByRole('button', { name: /close the modal/i }).click();

      await dialog.waitFor({ state: 'visible' });

      await expect(
        dialog.getByRole('button', { name: 'Yes, cancel the action' }),
      ).toBeVisible();

      await expect(
        dialog.getByRole('button', { name: 'No, go back to editing' }),
      ).toBeVisible();

      await dialog
        .getByRole('button', { name: 'Yes, cancel the action' })
        .click();

      await dialog.waitFor({ state: 'hidden' });

      await expect(simplePaymentForm).toBeVisible();
    });
  });

  test.describe('User has no permissions', () => {
    test('Should not allow to create a simple payment with no permissions', async ({
      page,
      context,
      baseURL,
    }) => {
      await setCookieConsent(context, baseURL);

      // Log in with a wallet that has no permissions for simple payments
      await signInAndNavigateToColony(page, {
        colonyUrl: '/planex',
        wallet: /dev wallet 3$/i,
      });

      await openSimplePaymentDrawer(page);

      const actionDrawer = page.getByTestId('action-drawer');
      const actionForm = actionDrawer.getByTestId('action-form');

      await expect(
        actionForm.getByText(validationMessages.permissions),
      ).toBeVisible();

      await expect(
        actionForm.getByRole('button', { name: 'Create payment' }),
      ).toBeDisabled();

      // User should still be able to change the action type
      await actionForm.getByRole('button', { name: 'Simple payment' }).click();

      await page
        .getByTestId('search-select-menu')
        .waitFor({ state: 'visible' });

      await page
        .getByTestId('search-select-menu')
        .getByRole('button', { name: 'Advanced payment' })
        .click();

      await expect(
        actionForm.getByRole('button', { name: 'Create payment' }),
      ).toBeEnabled();
    });
  });
});
