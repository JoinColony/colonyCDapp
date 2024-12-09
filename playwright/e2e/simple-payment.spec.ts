import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { SimplePayment } from '../models/simple-payment.ts';
import {
  deprecateReputationWaightedExtension,
  enableReputationWaightedExtension,
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';
import { getFirstDomainAndTotalFunds } from '../utils/graphqlHelpers.ts';

// NOTE: When running in parallel local mock of amplify fails to handle multiple parallel requests
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
    });

    test.afterAll(async () => {
      await context?.close();
    });

    test('Should successfully create a simple payment with Permissions decision method', async () => {
      const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
      await simplePayment.open();

      await simplePayment.setTitle('Pay fry');
      await simplePayment.selectTeam('General');
      await simplePayment.setRecipient(recipientAddress);
      await simplePayment.setAmount('1');
      await simplePayment.selectDecisionMethod('Permissions');
      await simplePayment.submit();

      await simplePayment.waitForPending();
      await simplePayment.waitForTransaction();

      await expect(simplePayment.completedAction).toBeVisible();
      await expect(
        simplePayment.completedAction.getByText(
          /Member used permissions to create this action/i,
        ),
      ).toBeVisible();
      await simplePayment.close();
    });

    test('Should successfully create a simple payment with Reputation decision method', async () => {
      const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

      await enableReputationWaightedExtension(page, {
        colonyPath: '/planex',
      });

      await simplePayment.open();

      await simplePayment.setTitle('Pay fry');
      await simplePayment.selectTeam('General');
      await simplePayment.setRecipient(recipientAddress);
      await simplePayment.setAmount('1');
      await simplePayment.selectDecisionMethod('Reputation');

      await expect(simplePayment.form.getByText('Created In')).toBeVisible();
      // Cretaed In value is the same as the team name by default
      await expect(
        simplePayment.form.getByRole('button', { name: 'General' }),
      ).toHaveCount(2);

      await simplePayment.submit();

      await simplePayment.waitForPending();
      await simplePayment.waitForTransaction();

      await expect(simplePayment.stepper).toBeVisible();
      await simplePayment.verifyStepperUI();
      await simplePayment.close();

      await deprecateReputationWaightedExtension(page, {
        colonyPath: '/planex',
      });
    });

    test('Should validate simple payment form fields', async () => {
      await simplePayment.open();
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
      await simplePayment.close();
    });

    test('Should display tooltips and user info', async () => {
      await simplePayment.open();

      // Test tooltips
      for (const [field, message] of Object.entries(
        SimplePayment.tooltipMessages,
      )) {
        await simplePayment.form.getByText(field, { exact: true }).hover();
        await expect(simplePayment.getTooltip(message)).toBeVisible();
      }

      // Test user info
      await simplePayment.openUserInfo();
      await simplePayment.close();
    });

    test('Should display the confirmation modal when the user tries to close the form', async () => {
      await simplePayment.open();

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
      await simplePayment.close();
    });

    test("Shouldn't be able to make a payment with a locked token outside of it's native colony", async () => {
      await simplePayment.open();
      // Select a token that is not native to the colony
      await simplePayment.selectToken('ƓƓƓ');

      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.token.locked,
        ),
      ).toBeVisible();

      await simplePayment.close();
    });

    test('Should prevent payment amount equal to total domain balance to reserve funds for network fees', async () => {
      const { balance, domainName, tokenDecimals, tokenSymbol } =
        await getFirstDomainAndTotalFunds({
          // Planex Colony
          colonyName: 'planex',
        });

      expect(Number(balance)).toBeGreaterThan(0);

      await simplePayment.open();

      await simplePayment.selectTeam(domainName);

      await simplePayment.selectToken(tokenSymbol);

      await simplePayment.setAmount(
        convertToDecimal(balance, tokenDecimals)?.toString() || '',
      );

      await expect(
        simplePayment.getValidationMessage(
          SimplePayment.validationMessages.amount.maxExceeded,
        ),
      ).toBeVisible();

      await simplePayment.close();
    });
  });

  test.describe('User has no permissions', () => {
    let simplePayment: SimplePayment;

    test.beforeEach(async ({ page, context, baseURL }) => {
      simplePayment = new SimplePayment(page);

      await setCookieConsent(context, baseURL);

      await signInAndNavigateToColony(page, {
        colonyUrl: '/planex',
        // NOTE: This wallet should have no permissions for Simple Payment in Planex Colony
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
