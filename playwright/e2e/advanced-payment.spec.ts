import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { expendituresBatchRecipients } from '../fixtures/test-data.ts';
import { AdvancedPayment } from '../models/advanced-payment.ts';
import {
  forwardTime,
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe.configure({ mode: 'serial' });

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

  test.beforeEach(async () => {
    await advancedPayment.open();
  });

  test('Should be able to create an advanced payment (Permissions method)', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x9dF24e73f40b2a911Eb254A8825103723E13209C';
    const claimDelay = 1;

    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Permissions',
      recipients: [
        { amount: '1', claimDelay: claimDelay.toString(), recipient },
        {
          amount: '2',
          claimDelay: claimDelay.toString(),
          recipient: recipient2,
        },
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

    await advancedPayment.fundPayment();

    await advancedPayment.releasePayment();
    await expect(
      advancedPayment.completedAction.getByText('Payment overview'),
    ).toBeVisible();

    await expect(
      advancedPayment.completedAction.getByRole('button', {
        name: 'Make payment',
      }),
    ).toBeDisabled();

    await expect(
      advancedPayment.completedAction.getByText('Claim in'),
    ).toHaveCount(3);

    await forwardTime(claimDelay);

    await advancedPayment.reloadPage();

    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );

    await expect(
      advancedPayment.completedAction.getByText('Claim now'),
    ).toHaveCount(2);

    await advancedPayment.makePayment();

    await expect(
      advancedPayment.completedAction.getByText('Claimed'),
    ).toHaveCount(2);
  });

  test('Should be able to create an advanced payment (Staking method)', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x9dF24e73f40b2a911Eb254A8825103723E13209C';
    const claimDelay = 1;

    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Staking',
      recipients: [
        { amount: '3', claimDelay: claimDelay.toString(), recipient },
        {
          amount: '2',
          claimDelay: claimDelay.toString(),
          recipient: recipient2,
        },
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

    await advancedPayment.fundPayment();

    await advancedPayment.releasePayment();

    await expect(
      advancedPayment.completedAction.getByText('Payment overview'),
    ).toBeVisible();

    await expect(
      advancedPayment.completedAction.getByRole('button', {
        name: 'Make payment',
      }),
    ).toBeDisabled();

    await expect(
      advancedPayment.completedAction.getByText('Claim in'),
    ).toHaveCount(3);

    await forwardTime(claimDelay);

    await advancedPayment.reloadPage();

    await expect(advancedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );

    await expect(
      advancedPayment.completedAction.getByText('Claim now'),
    ).toHaveCount(2);

    await advancedPayment.makePayment();

    await expect(
      advancedPayment.completedAction.getByText('Claimed'),
    ).toHaveCount(2);
  });

  test('Should be able to cancel an advanced payment', async () => {
    const recipient = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const recipient2 = '0x9dF24e73f40b2a911Eb254A8825103723E13209C';
    const claimDelay = 1;

    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Staking',
      recipients: [
        { amount: '1', claimDelay: claimDelay.toString(), recipient },
        {
          amount: '1',
          claimDelay: claimDelay.toString(),
          recipient: recipient2,
        },
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

    await advancedPayment.cancelAction();

    await advancedPayment.expenditureActionStatusBadge
      .filter({
        hasText: 'Canceled',
      })
      .waitFor({ state: 'visible' });
  });

  test('Should validate advanced payment form fields', async () => {
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

    await advancedPayment.close();
  });

  test('Should handle recipient table operations - add new row, remove row, and duplicate row correctly', async () => {
    await advancedPayment.fillForm({
      title: 'Test advanced payment',
      team: 'General',
      decisionMethod: 'Staking',
      recipients: [
        {
          amount: '1',
          claimDelay: '1',
          recipient: '0x27fF0C145E191C22C75cD123C679C3e1F58a4469',
        },
      ],
    });

    await advancedPayment.recipientsTable.getByLabel('Open menu').click();

    await advancedPayment.recipientsTable
      .getByRole('button', { name: 'Duplicate row' })
      .click();

    // Verify two rows exist
    const recipients = await advancedPayment.recipientsTable
      .locator('tbody')
      .getByRole('row')
      .all();
    expect(recipients).toHaveLength(2);

    await expect(
      advancedPayment.recipientsTable.getByLabel('Select User'),
    ).toHaveCount(2);

    // Verify the content of both rows is identical
    await expect(recipients[0]).toHaveText(
      (await recipients[1].textContent()) || '',
    );

    await expect(
      recipients[0]
        .getByRole('cell')
        .filter({ hasNotText: 'Hour' })
        .getByPlaceholder('Enter amount'),
    ).toHaveValue(
      await recipients[1]
        .getByRole('cell')
        .filter({ hasNotText: 'Hour' })
        .getByPlaceholder('Enter amount')

        .inputValue(),
    );

    await expect(
      recipients[0]
        .getByRole('cell')
        .filter({ hasText: 'Hour' })
        .getByPlaceholder('Enter amount'),
    ).toHaveValue(
      await recipients[1]
        .getByRole('cell')
        .filter({ hasText: 'Hour' })
        .getByPlaceholder('Enter amount')
        .inputValue(),
    );

    // Removing a row
    await advancedPayment.recipientsTable
      .getByLabel('Open menu')
      .last()
      .click();

    await advancedPayment.recipientsTable
      .getByRole('button', { name: 'Remove row' })
      .click();

    await expect(
      advancedPayment.recipientsTable.getByLabel('Open menu').nth(1),
    ).toBeHidden();

    await advancedPayment.close();
  });

  test('Should be able to load recipients from CSV file', async () => {
    await advancedPayment.fillForm({
      title: 'Test CSV payment',
      team: 'General',
      decisionMethod: 'Permissions',
    });

    const dialog = await advancedPayment.uploadRecipientsCSV(
      'playwright/fixtures/expenditures_batch.csv',
    );

    await dialog.waitFor({ state: 'hidden' });

    // Verify recipients were loaded correctly
    const recipients = await advancedPayment.recipientsTable
      .locator('tbody')
      .getByRole('row')
      .all();

    // Verify number of rows matches CSV
    expect(recipients).toHaveLength(expendituresBatchRecipients.length);

    // Verify each row matches CSV data
    for (const [
      index,
      expectedRecipient,
    ] of expendituresBatchRecipients.entries()) {
      await expect(recipients[index].getByLabel('Select User')).toHaveText(
        expectedRecipient.username,
      );
      await expect(
        recipients[index]
          .getByRole('cell')
          .filter({ hasNotText: 'Hour' })
          .getByPlaceholder('Enter amount'),
      ).toHaveValue(expectedRecipient.amount);
      await expect(
        recipients[index]
          .getByRole('cell')
          .filter({ hasText: 'Hour' })
          .getByPlaceholder('Enter amount'),
      ).toHaveValue(expectedRecipient.claimDelay);
    }

    // Verify total amount
    const totalAmount = expendituresBatchRecipients.reduce(
      (sum, recipient) => sum + Number(recipient.amount),
      0,
    );
    // We assume that the token symbol is the same for all recipients
    await expect(advancedPayment.totalAmount).toHaveText(
      `${totalAmount}${expendituresBatchRecipients[0].tokenSymbol}`,
    );

    await advancedPayment.close();
  });

  test('Should provide feedback when submitting a CSV file with missing or invalid data', async () => {
    await advancedPayment.fillForm({
      title: 'Test CSV payment',
      team: 'General',
      decisionMethod: 'Permissions',
    });

    const firstRow = advancedPayment.recipientsTable
      .locator('tbody')
      .getByRole('row')
      .first();

    await advancedPayment.uploadRecipientsCSV(
      'playwright/fixtures/expenditures_batch_invalid.csv',
    );

    await expect(firstRow.getByText('Address error')).toBeVisible();

    await expect(firstRow.getByText('Token error')).toBeVisible();

    await advancedPayment.close();
  });

  test('Should provide feedback when loading invalid CSV content', async () => {
    await advancedPayment.fillForm({
      title: 'Test CSV payment',
      team: 'General',
      decisionMethod: 'Permissions',
    });

    // Create invalid CSV content
    const invalidCSVContent = Buffer.from(`
Username (for reference);Address;Token Symbol (for reference);Token Contract Address;Amount;Claim delay (hours)
fry;;INVALID_TOKEN;;not_a_number;invalid_delay
amy;invalid_address;;;;;
`);

    await advancedPayment.uploadRecipientsCSV({
      buffer: invalidCSVContent,
      name: 'invalid.csv',
      mimeType: 'text/csv',
    });

    await expect(
      page.getByText('File structure is incorrect, please try again'),
    ).toBeVisible();
  });
});
