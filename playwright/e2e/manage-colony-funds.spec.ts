import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { ManageColonyFunds } from '../models/manage-colony-funds.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

// eslint-disable-next-line no-warning-comments
test.describe.configure({ mode: 'serial' });
test.describe('Manage Colony Funds', () => {
  let page: Page;
  let context: BrowserContext;
  let manageColonyFunds: ManageColonyFunds;
  let extensions: Extensions;
  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    manageColonyFunds = new ManageColonyFunds(page);
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
  test.describe('Mint tokens', () => {
    test('Permissions decision method', async () => {
      const currentBalance = (await manageColonyFunds.getBalance({
        token: 'CREDS',
      })) as string;
      await manageColonyFunds.open('Mint tokens');

      await manageColonyFunds.fillMintTokensForm({
        amount: '1_000_000',
        decisionMethod: 'Permissions',
        title: 'Mint tokens',
      });
      await manageColonyFunds.mintTokensButton.click();
      await manageColonyFunds.waitForTransaction();

      await expect(
        manageColonyFunds.completedAction.getByRole('heading', {
          name: 'Mint tokens',
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText(/Mint \w+ CREDS by \w+/),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText('Mint Tokens', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText('1MCREDS', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText('Permissions', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText(
          'Member used permissions to',
        ),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByRole('heading', {
          name: 'Overview',
        }),
      ).toBeVisible();

      const newBalance = (await manageColonyFunds.getBalance({
        token: 'CREDS',
      })) as string;

      const initial = parseFloat(currentBalance);
      const after = parseFloat(newBalance);

      await expect(after).toBeGreaterThan(initial);
    });

    test('Reputation decision method', async () => {
      await manageColonyFunds.open('Mint tokens');

      await manageColonyFunds.fillMintTokensForm({
        amount: '1',
        decisionMethod: 'Reputation',
        title: 'Mint tokens',
      });

      await manageColonyFunds.mintTokensButton.click();
      await manageColonyFunds.waitForTransaction();

      await expect(manageColonyFunds.stepper).toBeVisible();
      await expect(manageColonyFunds.completedAction).toBeVisible();
      await expect(
        manageColonyFunds.stepper.getByText(/Total stake required: \d+/),
      ).toBeVisible();

      await manageColonyFunds.support();

      await expect(manageColonyFunds.stepper).toHaveText(/100% Supported/);

      await manageColonyFunds.oppose();

      await expect(manageColonyFunds.stepper).toHaveText(/100% Opposed/);

      await manageColonyFunds.stepper
        .getByText(/Vote to support or oppose?/)
        .waitFor();
      await manageColonyFunds.supportButton.click();
      await manageColonyFunds.submitVoteButton.click();
      await manageColonyFunds.revealVoteButton.click();
      await manageColonyFunds.stepper.getByText('vote revealed').waitFor();
      await expect(
        manageColonyFunds.stepper.getByText(
          'Finalize to execute the agreed transaction',
        ),
      ).toBeVisible();
      await manageColonyFunds.finalizeButton.click();

      await manageColonyFunds.waitForPending();
      await manageColonyFunds.claimButton.click();
      await manageColonyFunds.waitForPending();
      await manageColonyFunds.completedAction
        .getByRole('heading', { name: 'Your overview Claimed' })
        .waitFor();

      await manageColonyFunds.claimButton.waitFor({
        state: 'hidden',
      });
    });

    test('Form validation', async () => {
      await manageColonyFunds.open('Mint tokens');
      await manageColonyFunds.mintTokensButton.click();

      for (const message of ManageColonyFunds.validationMessages
        .allRequiredFields) {
        await expect(manageColonyFunds.drawer.getByText(message)).toBeVisible();
      }

      await manageColonyFunds.fillMintTokensForm({
        title:
          'This is a test title that exceeds the maximum character limit of sixty.',
      });

      await manageColonyFunds.mintTokensButton.click();

      await expect(
        manageColonyFunds.drawer.getByText(
          ManageColonyFunds.validationMessages.title.maxLengthExceeded,
        ),
      ).toBeVisible();
    });
  });
});
