import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { SimplePayment } from '../models/simple-payment.ts';
import {
  uninstallReputationWeightedExtension,
  enableReputationWeightedExtension,
  setCookieConsent,
  signInAndNavigateToColony,
  forwardTime,
} from '../utils/common.ts';
import { getFirstDomainAndTotalFunds } from '../utils/graphqlHelpers.ts';

// eslint-disable-next-line no-warning-comments
// TODO: Resolve issue with running in parallel (amplify mock fails to handle multiple parallel requests from test cases)
test.describe.configure({ mode: 'serial' });

test.describe('Simple payment', () => {
  test.describe('User has required permissions', () => {
    let page: Page;
    let context: BrowserContext;
    let simplePayment: SimplePayment;

    test.beforeAll(async ({ browser, baseURL }) => {
      context = await browser.newContext();
      page = await context.newPage();
      simplePayment = new SimplePayment(page);

      await setCookieConsent(context, baseURL);
      await signInAndNavigateToColony(page, {
        colonyUrl: '/planex',
        wallet: /dev wallet 1$/i,
      });
      await enableReputationWeightedExtension(page, {
        colonyPath: '/planex',
      });
    });

    test.afterAll(async () => {
      await uninstallReputationWeightedExtension(page, {
        colonyPath: '/planex',
      });
      await context?.close();
    });

    test.beforeEach(async () => {
      await simplePayment.open();
    });

    test.afterEach(async () => {
      await simplePayment.close();
    });

    test('Should successfully create a simple payment (Permissions decision method)', async () => {
      const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

      await simplePayment.fillForm({
        title: 'Test Simple Payment',
        team: 'General',
        recipient: recipientAddress,
        amount: '1',
        decisionMethod: 'Permissions',
      });

      await simplePayment.submit();

      await simplePayment.waitForTransaction();

      await expect(simplePayment.completedAction).toBeVisible();
      await expect(
        simplePayment.completedAction.getByText(
          /Member used permissions to create this action/i,
        ),
      ).toBeVisible();
    });

    test('Should support a payment with reputation', async () => {
      const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

      await simplePayment.fillForm({
        title: 'Test Simple Payment',
        team: 'General',
        recipient: recipientAddress,
        amount: '1',
        decisionMethod: 'Reputation',
      });

      await expect(simplePayment.form.getByText('Created In')).toBeVisible();

      await expect(
        simplePayment.form.getByRole('button', { name: 'General' }),
      ).toHaveCount(2);

      await simplePayment.submit();

      await simplePayment.waitForTransaction();

      await expect(simplePayment.stepper).toBeVisible();
      await simplePayment.verifyStepperUI();
      await simplePayment.voteOnMotion('Support');

      await forwardTime(0.1);
      await simplePayment.reloadPage();

      await expect(
        simplePayment.completedAction.getByText(
          'Finalize to execute the agreed transactions and return stakes',
        ),
      ).toBeVisible();

      await simplePayment.finalize();

      await simplePayment.claim();
    });

    test('Should oppose a payment with reputation', async () => {
      const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

      await simplePayment.fillForm({
        title: 'Test Simple Payment to Oppose',
        team: 'General',
        recipient: recipientAddress,
        amount: '1',
        decisionMethod: 'Reputation',
      });

      await expect(simplePayment.form.getByText('Created In')).toBeVisible();
      await expect(
        simplePayment.form.getByRole('button', { name: 'General' }),
      ).toHaveCount(2);

      await simplePayment.submit();

      await simplePayment.waitForTransaction();

      await expect(simplePayment.stepper).toBeVisible();
      await simplePayment.verifyStepperUI();
      await simplePayment.voteOnMotion('Oppose');

      await forwardTime(0.1);
      await simplePayment.reloadPage();

      await expect(
        simplePayment.completedAction.getByText(
          'Action failed and cannot be executed',
        ),
      ).toBeVisible();

      await expect(
        simplePayment.completedAction.getByRole('button', { name: 'Failed' }),
      ).toBeVisible();
    });

    test('Should validate simple payment form fields', async () => {
      await simplePayment.submit();

      // Verify validation messages
      for (const message of SimplePayment.validationMessages
        .allRequiredFields) {
        await expect(simplePayment.getValidationMessage(message)).toBeVisible();
      }

      await simplePayment.setTitle(
        'This is a test title that exceeds the maximum character limit of sixty.',
      );
      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.title.maxLengthExceeded,
        ),
      ).toBeVisible();
    });

    test('Should display tooltips and user info', async () => {
      for (const [field, message] of Object.entries(
        SimplePayment.tooltipMessages,
      )) {
        await simplePayment.form.getByText(field, { exact: true }).hover();
        await expect(simplePayment.getTooltip(message)).toBeVisible();
      }

      await simplePayment.openUserInfo();

      await expect(simplePayment.drawer.getByTestId('user-info')).toBeVisible();
    });

    test('Should display the confirmation modal when the user tries to close the form', async () => {
      await simplePayment.setTitle('Test');

      await simplePayment.closeButton.click();

      await simplePayment.getConfirmationDialog().waitFor({ state: 'visible' });

      await expect(
        simplePayment.getConfirmationDialog().getByRole('button', {
          name: 'Yes, cancel the action',
        }),
      ).toBeVisible();

      await expect(
        simplePayment.getConfirmationDialog().getByRole('button', {
          name: 'No, go back to editing',
        }),
      ).toBeVisible();

      await simplePayment
        .getConfirmationDialog()
        .getByRole('button', { name: 'No, go back to editing' })
        .click();

      await simplePayment.getConfirmationDialog().waitFor({ state: 'hidden' });

      await expect(simplePayment.form).toBeVisible();
    });

    test("Shouldn't be able to make a payment with a locked token outside of it's native colony", async () => {
      // Select a token that is not native to the colony
      await simplePayment.selectToken('ƓƓƓ');

      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.token.locked,
        ),
      ).toBeVisible();
    });

    test('Should prevent payment amount equal to total domain balance to reserve funds for network fees', async () => {
      const { balance, domainName, tokenDecimals, tokenSymbol } =
        await getFirstDomainAndTotalFunds({
          colonyName: 'planex',
        });

      expect(Number(balance)).toBeGreaterThan(0);

      await simplePayment.fillForm({
        title: 'Test Simple Payment',
        team: domainName,
        amount: convertToDecimal(balance, tokenDecimals)?.toString() || '',
        token: tokenSymbol,
        decisionMethod: 'Permissions',
      });

      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.amount.maxExceeded,
        ),
      ).toBeVisible();
    });
  });

  test.describe('User has no permissions', () => {
    let simplePayment: SimplePayment;

    test.beforeEach(async ({ page, context, baseURL }) => {
      simplePayment = new SimplePayment(page);

      await setCookieConsent(context, baseURL);

      await signInAndNavigateToColony(page, {
        colonyUrl: '/planex',
        // NOTE: Assuming this test user does not have permissions for Simple Payment in Planex Colony
        wallet: /dev wallet 3$/i,
      });

      await simplePayment.open();
    });

    test('Should not allow to create a simple payment with Permission Decision method', async () => {
      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.permissions,
        ),
      ).toBeVisible();

      await expect(simplePayment.submitButton).toBeDisabled();
      // User should still be able to change the action type
      await simplePayment.changeActionType('Advanced payment');
      await expect(simplePayment.submitButton).toBeEnabled();
    });
  });
});
