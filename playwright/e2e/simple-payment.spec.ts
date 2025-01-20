import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { Extensions } from '../models/extensions.ts';
import { SimplePayment } from '../models/simple-payment.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
  forwardTime,
} from '../utils/common.ts';
import { getFirstDomainAndTotalFunds } from '../utils/graphqlHelpers.ts';

// eslint-disable-next-line no-warning-comments
// TODO: Resolve issue with running in parallel (amplify mock fails to handle multiple parallel requests from test cases)
test.describe.configure({ mode: 'serial' });

test.describe('Simple payment', () => {
  let page: Page;
  let context: BrowserContext;
  let simplePayment: SimplePayment;
  let extensions: Extensions;

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    simplePayment = new SimplePayment(page);
    extensions = new Extensions(page);
    await setCookieConsent(context, baseURL);
    await signInAndNavigateToColony(page, {
      colonyUrl: '/planex',
      wallet: /dev wallet 1$/i,
    });
    await extensions.enableReputationWeightedExtension({
      colonyPath: '/planex',
    });
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.beforeEach(async () => {
    await simplePayment.open();
  });

  test.afterEach(async () => {
    await simplePayment.close();
  });

  test('Permissions decision method', async () => {
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

  test('Reputation decision method | Vote Support', async () => {
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

  test('Reputation decision method | VoteOppose', async () => {
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

  test('Form validation', async () => {
    await simplePayment.submit();

    // Verify validation messages
    for (const message of SimplePayment.validationMessages.allRequiredFields) {
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

  test('Form tooltips and user info dropdown', async () => {
    for (const [field, message] of Object.entries(
      SimplePayment.tooltipMessages,
    )) {
      await simplePayment.form.getByText(field, { exact: true }).hover();
      await expect(simplePayment.getTooltip(message)).toBeVisible();
    }

    await simplePayment.openUserInfo();

    await expect(simplePayment.drawer.getByTestId('user-info')).toBeVisible();
  });

  test('Confirmation modal on close', async () => {
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

  test('Attempt to use an external locked token', async () => {
    // Select a token that is not native to the colony
    await simplePayment.selectToken('ƓƓƓ');
    await simplePayment.selectToken('ƓƓƓ');

    //  User shouldn't be able to make a payment with a locked token outside of it's native colony
    await expect(
      simplePayment.getValidationMessage(
        SimplePayment.validationMessages.token.locked,
      ),
    ).toBeVisible();
  });

  test('Token amount validation', async () => {
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
    // Should prevent payment amount equal to total domain balance to reserve funds for network fees
    await expect(
      simplePayment.getValidationMessage(
        SimplePayment.validationMessages.amount.maxExceeded,
      ),
    ).toBeVisible();
  });
});
