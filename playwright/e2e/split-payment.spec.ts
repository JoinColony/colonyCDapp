import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { SplitPayment } from '../models/split-payment.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe.configure({ mode: 'serial' });

test.describe('Split payment', () => {
  let page: Page;
  let context: BrowserContext;
  let splitPayment: SplitPayment;

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    splitPayment = new SplitPayment(page);

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
    await splitPayment.open();
  });

  test.afterEach(async () => {
    await splitPayment.close();
  });

  test('Happy path (Equal distribution/Permissions decision method)', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x9dF24e73f40b2a911Eb254A8825103723E13209C';

    await splitPayment.fillForm({
      title: 'Test Split Payment',
      team: 'General',
      decisionMethod: 'Permissions',
      distribution: 'Equal',
      totalAmount: '2',
      recipients: [
        {
          amount: '1',
          recipient,
        },
        {
          amount: '1',
          recipient: recipient2,
        },
      ],
    });

    await splitPayment.submitButton.click();
    await splitPayment.waitForPending();
    await splitPayment.waitForTransaction();

    await expect(splitPayment.completedAction).toBeVisible();
    await expect(splitPayment.stepper).toBeVisible();
    await expect(splitPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );

    await splitPayment.confirmPayment();

    await splitPayment.fundPayment();

    await splitPayment.releasePayment();

    await expect(splitPayment.expenditureActionStatusBadge).toHaveText('Paid');
  });
});
