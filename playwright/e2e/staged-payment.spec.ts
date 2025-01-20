import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { StagedPayment } from '../models/staged-payment.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

// eslint-disable-next-line no-warning-comments
// TODO: When running in parallel locally, amplify mock service fails to handle multiple parallel requests from test cases
test.describe.configure({ mode: 'serial' });

test.describe('Staged Payment', () => {
  let page: Page;
  let context: BrowserContext;
  let stagedPayment: StagedPayment;
  let extensions: Extensions;
  const recipientAddress = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    stagedPayment = new StagedPayment(page);
    extensions = new Extensions(page);

    await setCookieConsent(context, baseURL);
    await signInAndNavigateToColony(page, {
      colonyUrl: '/planex',
      wallet: /dev wallet 1$/i,
    });
    await extensions.enableStagedExpenditureExtension({
      colonyPath: '/planex',
    });

    await extensions.enableReputationWeightedExtension({
      colonyPath: '/planex',
    });
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test.beforeEach(async () => {
    await stagedPayment.open();
  });

  test.afterEach(async () => {
    await stagedPayment.close();
  });

  test('Permission decision method', async () => {
    await stagedPayment.fillForm({
      title: 'Test Staged Payment',
      team: 'General',
      recipient: recipientAddress,
      decisionMethod: 'Permissions',
      stages: [
        {
          title: 'Stage 1',
          amount: '1',
        },
        {
          title: 'Stage 2',
          amount: '1',
        },
      ],
    });

    await stagedPayment.submitButton.click();

    await stagedPayment.waitForTransaction();

    await expect(stagedPayment.completedAction).toBeVisible();
    await expect(stagedPayment.stepper).toBeVisible();
    await expect(stagedPayment.expenditureActionStatusBadge).toHaveText(
      'Review',
    );

    await stagedPayment.confirmPayment();
    await stagedPayment.fundPayment('Permissions');

    await stagedPayment.releasePayment();

    await expect(stagedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );

    await stagedPayment.makePayment('Permissions');

    await expect(
      stagedPayment.stagesTable
        .locator('tbody tr')
        .nth(0)
        .getByText('Released'),
    ).toBeVisible();

    await expect(
      stagedPayment.stepper.getByRole('button', { name: 'Stage 1 Passed' }),
    ).toBeVisible();

    await stagedPayment.makePayment('Permissions');

    await expect(
      stagedPayment.stepper.getByRole('button', { name: 'Stage 2 Passed' }),
    ).toBeVisible();

    await expect(
      stagedPayment.completedAction.getByText('Permissions', { exact: true }),
    ).toBeVisible();

    await verifyCompletedStagedPayment(stagedPayment);
  });

  test('Staking decision method', async () => {
    await stagedPayment.fillForm({
      title: 'Test Staged Payment',
      team: 'General',
      recipient: recipientAddress,
      decisionMethod: 'Staking',
      stages: [
        {
          title: 'Stage 1',
          amount: '1',
        },
        {
          title: 'Stage 2',
          amount: '1',
        },
      ],
    });

    await stagedPayment.submitButton.click();

    await stagedPayment.confirmRequiredStakeDialog();

    await stagedPayment.waitForTransaction();

    await expect(stagedPayment.completedAction).toBeVisible();

    await stagedPayment.confirmPayment();
    await stagedPayment.fundPayment();
    await stagedPayment.releasePayment();

    await expect(stagedPayment.expenditureActionStatusBadge).toHaveText(
      'Payable',
    );

    await stagedPayment.makePayment('Permissions');

    await expect(
      stagedPayment.stagesTable
        .locator('tbody tr')
        .nth(0)
        .getByText('Released'),
    ).toBeVisible();

    await expect(
      stagedPayment.stepper.getByRole('button', { name: 'Stage 1 Passed' }),
    ).toBeVisible();

    await stagedPayment.makePayment('Payment creator');

    await expect(
      stagedPayment.stepper.getByRole('button', { name: 'Stage 2 Passed' }),
    ).toBeVisible();

    await expect(
      stagedPayment.completedAction.getByText('Staking', { exact: true }),
    ).toBeVisible();

    await verifyCompletedStagedPayment(stagedPayment);
  });

  test('Reputation decision method | Voting', async () => {
    await stagedPayment.fillForm({
      title: 'Test Staged Payment',
      team: 'General',
      recipient: recipientAddress,
      decisionMethod: 'Permissions',
      stages: [
        {
          title: 'Stage 1',
          amount: '1',
        },
      ],
    });

    await stagedPayment.submitButton.click();

    await stagedPayment.waitForTransaction();

    await expect(stagedPayment.completedAction).toBeVisible();

    await stagedPayment.confirmPayment();

    // Fund the payment using Reputation decision method
    await stagedPayment.fundPayment('Reputation');

    await expect(stagedPayment.expenditureActionStatusBadge).toHaveText(
      'Funding',
    );

    await expect(
      stagedPayment.stepper.getByRole('heading', {
        name: 'Total stake required',
      }),
    ).toBeVisible();

    await stagedPayment.voteOnMotion('Support');
    await stagedPayment.stepper.getByText('100% Supported').waitFor();

    await stagedPayment.stepper
      .getByText('The action has been fully supported and will pass.')
      .waitFor();

    await stagedPayment.voteOnMotion('Oppose');
    await stagedPayment.stepper.getByText('100% Opposed').waitFor();

    await stagedPayment.supportButton.click();

    await stagedPayment.submitVoteButton.click();

    await stagedPayment.revealVoteButton.click();

    await stagedPayment.finalizeButton.click();

    await stagedPayment.releasePayment();

    await stagedPayment.makePayment('Permissions');

    await expect(
      stagedPayment.stepper.getByRole('button', { name: 'Stage 1 Passed' }),
    ).toBeVisible();

    await expect(
      stagedPayment.drawer.getByTestId('expenditure-action-status-badge'),
    ).toHaveText('Paid');
  });

  test('Form validation', async () => {
    await stagedPayment.submit();

    for (const message of StagedPayment.validationMessages.allRequiredFields) {
      await expect(stagedPayment.drawer.getByText(message)).toBeVisible();
    }

    await stagedPayment.setTitle(
      'This is a test title that exceeds the maximum character limit of sixty.',
    );

    await stagedPayment.submit();

    await expect(
      stagedPayment.drawer.getByText(
        StagedPayment.validationMessages.title.maxLengthExceeded,
      ),
    ).toBeVisible();

    // Attempt to use a locked token
    await stagedPayment.fillForm({
      stages: [
        {
          title: 'Stage 1',
          amount: '1',
          token: 'ƓƓƓ',
        },
      ],
    });

    await expect(
      stagedPayment.drawer.getByText(
        StagedPayment.validationMessages.token.locked,
      ),
    ).toBeVisible();

    // Amount exceeds the balance
    await stagedPayment.fillForm({
      title: 'Test Staged Payment',
      team: 'General',
      recipient: recipientAddress,
      decisionMethod: 'Permissions',
      stages: [
        {
          title:
            'This is a very long test title that definitely exceeds the maximum character limit of eighty characters',
          amount: '999_999_999_999_999_999_999',
          token: 'CREDS',
        },
      ],
    });

    await expect(
      stagedPayment.drawer.getByText(
        StagedPayment.validationMessages.amount.maxExceeded,
      ),
    ).toBeVisible();

    await expect(
      stagedPayment.drawer.getByText(
        StagedPayment.validationMessages.milestone.maxLengthExceeded,
      ),
    ).toBeVisible();
    // eslint-disable-next-line no-warning-comments
    // TODO: uncomment once #4185 is fixed
    // Amount field handles very small numbers
    // await stagedPayment.fillForm({
    //   stages: [
    //     {
    //       title: 'Stage 1',
    //       amount: '0.000000000000000000000001', // 24 decimal places
    //     },
    //   ],
    // });

    // await expect(stagedPayment.drawer.getByText('×10-24')).toBeVisible();
  });

  test('Milestones table actions', async () => {
    await stagedPayment.fillForm({
      title: 'Test Staged Payment',
      team: 'General',
      recipient: recipientAddress,
      decisionMethod: 'Permissions',
      stages: [
        {
          title: 'Stage 1',
          amount: '1',
        },
      ],
    });

    await expect(
      stagedPayment.form.getByRole('table').locator('tbody tr'),
    ).toHaveCount(1);

    await stagedPayment.duplicateMilestone(0);

    await expect(
      stagedPayment.form.getByRole('table').locator('tbody tr'),
    ).toHaveCount(2);

    await expect(
      stagedPayment.form.getByRole('table').getByText('Stage 1'),
    ).toHaveCount(2);

    await stagedPayment.deleteMilestone(1);

    await expect(
      stagedPayment.form.getByRole('table').locator('tbody tr'),
    ).toHaveCount(1);
  });
});

async function verifyCompletedStagedPayment(stagedPayment: StagedPayment) {
  await expect(stagedPayment.expenditureActionStatusBadge).toHaveText('Paid');
  await expect(
    stagedPayment.completedAction.getByRole('heading', {
      name: 'Test Staged Payment',
    }),
  ).toBeVisible();

  await expect(
    stagedPayment.completedAction.getByText('Staged payment of 2 CREDS to'),
  ).toBeVisible();

  await expect(
    stagedPayment.completedAction.getByText('Staged payment', {
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    stagedPayment.completedAction.getByText('General'),
  ).toBeVisible();

  await expect(
    stagedPayment.completedAction.getByRole('button', {
      name: 'Avatar of user fry fry',
    }),
  ).toBeVisible();

  await expect(
    stagedPayment.stagesTable.getByText('TOTAL 2 MILESTONES'),
  ).toBeVisible();

  await expect(stagedPayment.stagesTable.getByText('2CREDS')).toBeVisible();
}
