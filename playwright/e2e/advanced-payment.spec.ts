/* eslint-disable playwright/no-conditional-in-test */
/* eslint-disable playwright/expect-expect */
import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { AdvancedPayment } from '../models/advanced-payment.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe('Advanced payment', () => {
  let page: Page;
  let context: BrowserContext;
  let advancedPayment: AdvancedPayment;

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    advancedPayment = new AdvancedPayment(page);

    await setCookieConsent(context, baseURL);
    await signInAndNavigateToColony(page, {
      colonyUrl: '/planex',
      wallet: /dev wallet 1$/i,
    });
  });

  test.afterAll(async () => {
    await context?.close();
  });
  test('Should be able to create an advanced payment (Permissions method)', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

    await advancedPayment.open();
    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Permissions',
      recipients: [
        { amount: '1', claimDelay: '1', recipient },
        { amount: '2', claimDelay: '2', recipient: recipient2 },
      ],
    });
    await advancedPayment.submitButton.click();
    await advancedPayment.waitForPending();
    await advancedPayment.waitForTransaction();
    await expect(advancedPayment.completedAction).toBeVisible();
    await expect(advancedPayment.stepper).toBeVisible();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );
    await advancedPayment.confirmPayment();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Funding',
    );

    await advancedPayment.fundPayment();

    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Release',
    );

    await advancedPayment.releasePayment();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );

    await expect(
      advancedPayment.completedAction.getByText('Payment overview'),
    ).toBeVisible();
  });

  test('Should be able to create an advanced payment (Staking method)', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

    await advancedPayment.open();
    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Staking',
      recipients: [
        { amount: '3', claimDelay: '1', recipient },
        { amount: '2', claimDelay: '2', recipient: recipient2 },
      ],
    });

    await advancedPayment.submitButton.click();
    await advancedPayment.confirmRequiredStakeDialog();
    await advancedPayment.waitForTransaction();
    await expect(advancedPayment.completedAction).toBeVisible();
    await expect(advancedPayment.stepper).toBeVisible();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );
    await advancedPayment.confirmPayment();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Funding',
    );
    await advancedPayment.fundPayment();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Release',
    );
    await advancedPayment.releasePayment();
    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );
    await expect(
      advancedPayment.completedAction.getByText('Payment overview'),
    ).toBeVisible();
  });

  test('Should validate advanced payment form fields', async () => {
    await advancedPayment.open();
    await advancedPayment.submit();

    // Verify validation messages for required fields
    for (const message of AdvancedPayment.validationMessages
      .allRequiredFields) {
      await expect(advancedPayment.getValidationMessage(message)).toBeVisible();
    }
    // Verify validation message for title field when it exceeds the maximum character limit
    await advancedPayment.setTitle(
      'This is a test title that exceeds the maximum character limit of sixty.',
    );

    await advancedPayment.submit();

    await expect(
      advancedPayment.getValidationMessage(
        AdvancedPayment.validationMessages.title.maxLengthExceeded,
      ),
    ).toBeVisible();
  });
});
