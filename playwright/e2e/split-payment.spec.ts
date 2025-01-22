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
  const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
  const recipient2 = '0x9dF24e73f40b2a911Eb254A8825103723E13209C';

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

  test('Happy path (Staking decision method)', async () => {
    await splitPayment.fillForm({
      title: 'Test Split Payment',
      team: 'General',
      decisionMethod: 'Staking',
      distribution: 'Unequal',
      totalAmount: '5',
      recipients: [
        {
          amount: '2.5',
          recipient,
          percentage: '50%',
        },
        {
          amount: '2.5',
          recipient: recipient2,
          percentage: '50%',
        },
      ],
    });

    await splitPayment.submitButton.click();

    await splitPayment.confirmRequiredStakeDialog();
    await splitPayment.waitForTransaction();

    await expect(splitPayment.completedAction).toBeVisible();
    await expect(splitPayment.stepper).toBeVisible();
    await expect(splitPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );

    await splitPayment.confirmPayment();
    await splitPayment.fundPayment();
    await splitPayment.releasePayment({ releaseMethod: 'Permissions' });

    await expect(splitPayment.expenditureActionStatusBadge).toHaveText('Paid');
    for (const [index, row] of [
      /fry\s*2.5CREDS\s*50%/i,
      /amy\s*2.5CREDS\s*50%/i,
      /Total payments5 CREDS/i,
    ].entries()) {
      await expect(
        splitPayment.completedActionTable.locator('tbody tr').nth(index),
      ).toContainText(row, {
        ignoreCase: true,
      });
    }
  });

  test('Happy path (Equal distribution/Permissions decision method)', async () => {
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
          percentage: '50%',
        },
        {
          amount: '1',
          recipient: recipient2,
          percentage: '50%',
        },
      ],
    });

    await splitPayment.submitButton.click();
    await splitPayment.waitForTransaction();

    await expect(splitPayment.completedAction).toBeVisible();
    await expect(splitPayment.stepper).toBeVisible();
    await expect(splitPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );

    await splitPayment.confirmPayment();
    await splitPayment.fundPayment();
    await splitPayment.releasePayment({ releaseMethod: 'Permissions' });

    await expect(splitPayment.expenditureActionStatusBadge).toHaveText('Paid');
    await expect(
      splitPayment.completedAction.getByText('Action type'),
    ).toBeVisible();
    await expect(
      splitPayment.completedAction.getByText('Split payment', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      splitPayment.completedAction.getByText('General', {
        exact: true,
      }),
    ).toBeVisible();
    // Distribution should be displayed as Unequal here as we manually typed in the values of amount and percentage fields
    await expect(
      splitPayment.completedAction.getByText('Unequal', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      splitPayment.completedAction.getByText('Permissions', {
        exact: true,
      }),
    ).toBeVisible();
    for (const [index, row] of [
      /fry\s*1CREDS\s*50%/i,
      /amy\s*1CREDS\s*50%/i,
      /Total payments2 CREDS/i,
    ].entries()) {
      await expect(
        splitPayment.completedActionTable.locator('tbody tr').nth(index),
      ).toContainText(row);
    }
  });

  test('Redo payment (Permissions decision method/Payment Creator release method)', async () => {
    await splitPayment.fillForm({
      title: 'Test Split Payment',
      team: 'General',
      decisionMethod: 'Permissions',
      distribution: 'Unequal',
      totalAmount: '5',
      recipients: [
        {
          amount: '2.5',
          recipient,
          percentage: '50%',
        },
        {
          amount: '2.5',
          recipient: recipient2,
          percentage: '50%',
        },
      ],
    });

    await splitPayment.submitButton.click();
    await splitPayment.waitForTransaction();
    await splitPayment.confirmPayment();
    await splitPayment.fundPayment();
    await splitPayment.releasePayment({ releaseMethod: 'Payment creator' });

    await splitPayment.threeDotButton.click();
    await splitPayment.redoActionButton.click();
    await splitPayment.waitForLoadingComplete();
    // The Form should be pre-filled with the previous values
    await expect(splitPayment.titleInput).toHaveValue('Test Split Payment');
    await expect(
      splitPayment.form.getByRole('button', { name: 'Split payment' }),
    ).toBeVisible();
    await expect(splitPayment.form.getByLabel('Select token')).toContainText(
      'CREDS',
    );
    await expect(splitPayment.totalAmountInput).toHaveValue('5');
    await expect(
      splitPayment.form.getByRole('button', {
        name: 'General',
      }),
    ).toBeVisible();
    // Recipients table should be present and filled with th expected data
    const row1 = splitPayment.recipientsTable.locator('tbody tr').nth(0);
    const row2 = splitPayment.recipientsTable.locator('tbody tr').nth(1);
    await expect(row1.getByPlaceholder('Enter value')).toHaveValue('50');
    await expect(row2.getByPlaceholder('Enter value')).toHaveValue('50');
    await expect(row1.getByText('CREDS')).toBeVisible();
    await expect(row2.getByText('CREDS')).toBeVisible();
    await expect(row1.getByPlaceholder('Enter amount')).toHaveValue('2.5');
    await expect(row2.getByPlaceholder('Enter amount')).toHaveValue('2.5');

    await splitPayment.submitButton.click();

    await splitPayment.waitForTransaction();

    await expect(splitPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );
  });

  test('Form validation', async () => {
    await splitPayment.submitButton.click();

    // Verify validation messages
    for (const message of SplitPayment.validationMessages.allRequiredFields) {
      await expect(splitPayment.drawer.getByText(message)).toBeVisible();
    }

    await splitPayment.setTitle(
      'This is a test title that exceeds the maximum character limit of sixty.',
    );
    await expect(
      splitPayment.drawer.getByText(
        SplitPayment.validationMessages.title.maxLengthExceeded,
      ),
    ).toBeVisible();

    await splitPayment.fillForm({
      title: 'Test Split Payment',
      team: 'General',
      decisionMethod: 'Staking',
      distribution: 'Unequal',
      totalAmount: '5',
      recipients: [
        {
          amount: '1',
          recipient,
          percentage: '50%',
        },
        {
          amount: '1',
          recipient: recipient2,
          percentage: '50%',
        },
      ],
    });

    await splitPayment.submitButton.click();

    await expect(
      splitPayment.drawer.getByText(
        SplitPayment.validationMessages.percentage.mustBe100,
      ),
    ).toBeVisible();
  });

  test('Recipients table actions', async () => {
    await splitPayment.fillForm({
      title: 'Test Split Payment',
      team: 'General',
      decisionMethod: 'Staking',
      distribution: 'Equal',
      totalAmount: '2',
      recipients: [
        {
          amount: '1',
          recipient,
          percentage: '50%',
        },
      ],
    });

    await splitPayment.form.getByLabel('Open menu').first().click();
    await splitPayment.form.getByRole('button', { name: 'Duplicate' }).click();

    await expect(
      splitPayment.drawer.getByText(
        SplitPayment.validationMessages.percentage.mustBe100,
      ),
    ).toBeHidden();
    await expect(splitPayment.form.getByText('100%')).toBeVisible();

    await splitPayment.form.getByLabel('Open menu').nth(1).click();
    await splitPayment.form.getByRole('button', { name: 'Remove row' }).click();

    await expect(splitPayment.recipientsTable.locator('tbody tr')).toHaveCount(
      1,
    );

    await expect(
      splitPayment.recipientsTable.locator('tfoot tr').first(),
    ).toContainText('50%');

    await expect(
      splitPayment.drawer.getByText(
        SplitPayment.validationMessages.percentage.mustBe100,
      ),
    ).toBeVisible();
  });

  test('Equal distribution automatically calculates amounts and percentages', async () => {
    await splitPayment.fillForm({
      title: 'Auto-calculated Split Payment',
      team: 'General',
      decisionMethod: 'Permissions',
      distribution: 'Equal',
      totalAmount: '100',
      recipients: [{ recipient }, { recipient: recipient2 }],
    });

    const rows = splitPayment.recipientsTable.locator('tbody tr');
    // Check that amounts and percentages were automatically calculated
    // Verify first recipient
    await expect(rows.nth(0).getByPlaceholder('Enter amount')).toHaveValue(
      '50',
    );
    await expect(rows.nth(0).getByPlaceholder('Enter value')).toHaveValue('50');

    // Verify second recipient
    await expect(rows.nth(1).getByPlaceholder('Enter amount')).toHaveValue(
      '50',
    );
    await expect(rows.nth(1).getByPlaceholder('Enter value')).toHaveValue('50');

    // Verify total adds up correctly
    await expect(
      splitPayment.recipientsTable.locator('tfoot tr').first(),
    ).toContainText('100%');
  });
});
