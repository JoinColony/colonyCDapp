import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { ManageColonyFunds } from '../models/manage-colony-funds.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

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
      const [currentBalance] = await manageColonyFunds.getBalance('planex', [
        {
          token: 'CREDS',
        },
      ]);
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

      const [newBalance] = await manageColonyFunds.getBalance('planex', [
        {
          token: 'CREDS',
        },
      ]);

      const initial = parseFloat(currentBalance);
      const after = parseFloat(newBalance);

      expect(after).toBeGreaterThan(initial);
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

      for (const message of ManageColonyFunds.validationMessages.mintTokens
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
          ManageColonyFunds.validationMessages.common.title.maxLengthExceeded,
        ),
      ).toBeVisible();

      await manageColonyFunds.close();
    });
  });

  test.describe('Funds transfer', () => {
    test('Permissions decision method', async () => {
      const transferAmount = '1';
      const [serenityBalance, andromedaBalance] =
        await manageColonyFunds.getBalance('planex', [
          {
            token: 'CREDS',
            team: 'Serenity',
          },
          {
            token: 'CREDS',
            team: 'Andromeda',
          },
        ]);
      await manageColonyFunds.open('Transfer funds');

      await manageColonyFunds.fillTransferFundsForm({
        title: 'Transfer funds',
        amount: transferAmount,
        decisionMethod: 'Permissions',
        from: 'Serenity',
        to: 'Andromeda',
      });

      await manageColonyFunds.transferFundsButton.click();
      await manageColonyFunds.waitForTransaction();

      await expect(
        manageColonyFunds.completedAction.getByText(
          `Move ${transferAmount} CREDS from Serenity to Andromeda`,
        ),
      ).toBeVisible();

      const [newSerenityBalance, newAndromedaBalance] =
        await manageColonyFunds.getBalance('planex', [
          {
            token: 'CREDS',
            team: 'Serenity',
          },
          {
            token: 'CREDS',
            team: 'Andromeda',
          },
        ]);

      expect(parseFloat(newSerenityBalance)).toBe(
        parseFloat(serenityBalance) - parseFloat(transferAmount),
      );
      expect(parseFloat(newAndromedaBalance)).toBe(
        parseFloat(andromedaBalance) + parseFloat(transferAmount),
      );
    });

    test('Reputation decision method', async () => {
      await manageColonyFunds.open('Transfer funds');

      await manageColonyFunds.fillTransferFundsForm({
        title: 'Transfer funds',
        amount: '1',
        decisionMethod: 'Reputation',
        from: 'General',
        to: 'Andromeda',
      });

      await manageColonyFunds.transferFundsButton.click();
      await manageColonyFunds.waitForTransaction();

      await expect(manageColonyFunds.stepper).toBeVisible();
      await expect(manageColonyFunds.completedAction).toBeVisible();
      await expect(
        manageColonyFunds.completedAction.getByText(
          /Move 1 CREDS from General to Andromeda/,
        ),
      ).toBeVisible();
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
      await expect(
        manageColonyFunds.stepper.getByText(/You voted:Support/),
      ).toBeVisible();

      await expect(
        manageColonyFunds.stepper.getByText(/^0 votes revealed$/),
      ).toBeVisible();

      await manageColonyFunds.revealVoteButton.click();

      await manageColonyFunds.stepper
        .getByRole('button', {
          name: 'Support wins',
        })
        .waitFor();

      await expect(
        manageColonyFunds.stepper.getByText(
          'Finalize to execute the agreed transaction',
        ),
      ).toBeVisible();
      await manageColonyFunds.finalizeButton.click();

      await manageColonyFunds.waitForPending();
      await manageColonyFunds.claimButton.click();
      await manageColonyFunds.waitForPending();

      await manageColonyFunds.stepper
        .getByRole('heading', {
          name: 'Your overview Claimed',
        })
        .waitFor();
    });

    test('Form validation', async () => {
      await manageColonyFunds.open('Transfer funds');
      await manageColonyFunds.transferFundsButton.click();

      for (const message of ManageColonyFunds.validationMessages.fundsTransfer
        .allRequiredFields) {
        await expect(manageColonyFunds.drawer.getByText(message)).toBeVisible();
      }

      await expect(
        manageColonyFunds.drawer.getByText(
          ManageColonyFunds.validationMessages.fundsTransfer.team.sameTeam,
        ),
      ).toBeHidden();

      await manageColonyFunds.fillTransferFundsForm({
        from: 'General',
        to: 'General',
        amount: '1',
        title: 'Transfer funds',
        decisionMethod: 'Permissions',
      });

      await expect(
        manageColonyFunds.drawer.getByText(
          ManageColonyFunds.validationMessages.fundsTransfer.team.sameTeam,
        ),
      ).toBeVisible();

      await manageColonyFunds.fillTransferFundsForm({
        amount: '999_999_999_999_999_999',
      });

      await expect(
        manageColonyFunds.drawer.getByText(
          ManageColonyFunds.validationMessages.fundsTransfer.amount
            .notEnoughFunds,
        ),
      ).toBeVisible();

      await manageColonyFunds.fillTransferFundsForm({
        tokenSymbol: 'ƓƓƓ',
      });

      await expect(
        manageColonyFunds.drawer.getByText(
          ManageColonyFunds.validationMessages.fundsTransfer.token.locked,
        ),
      ).toBeVisible();

      await manageColonyFunds.close();
    });
  });

  test.describe('Manage tokens', () => {
    test.afterAll(async () => {
      await manageColonyFunds.removeTokens();
    });
    test('Add/Remove tokens | Permissions decision method', async () => {
      await manageColonyFunds.open('Manage tokens');
      await manageColonyFunds.setTitle('Manage tokens test');
      await manageColonyFunds.setDecisionMethod('Permissions');

      const approvedTokens = await manageColonyFunds.tokenSelector.count();
      await expect(
        manageColonyFunds.form.getByRole('heading', {
          name: 'Approved tokens',
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.manageTokensTable.getByText('Ether', { exact: true }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.manageTokensTable.getByText('ETH', { exact: true }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.manageTokensTable.getByText('Space Credits', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.manageTokensTable.getByText('CREDS', {
          exact: true,
        }),
      ).toBeVisible();

      await manageColonyFunds.form
        .getByRole('button', {
          name: 'Add token',
        })
        .click();

      await manageColonyFunds.manageTokensTable
        .getByLabel('Select token or enter token')
        .click();

      await manageColonyFunds.tokenSearchMenu
        .getByRole('button', {
          name: 'Avatar of token',
        })
        .first()
        .click();

      await expect(manageColonyFunds.tokenSelector).toHaveCount(
        approvedTokens + 1,
      );

      await expect(
        manageColonyFunds.manageTokensTable.getByText('New'),
      ).toBeVisible();

      await manageColonyFunds.updateTokensButton.click();

      await manageColonyFunds.waitForTransaction();

      await expect(
        manageColonyFunds.completedAction.getByRole('heading', {
          name: 'Manage tokens test',
        }),
      ).toBeVisible();

      await expect(manageColonyFunds.manageTokensTable).toBeVisible();
      await expect(
        manageColonyFunds.completedAction.getByText('Manage tokens', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText('Permissions', {
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        manageColonyFunds.completedAction.getByText('New', {
          exact: true,
        }),
      ).toBeVisible();

      const newTokenSymbol = (
        await manageColonyFunds.manageTokensTable
          .getByRole('cell', { name: 'New' })
          .textContent()
      )
        ?.replace('New', '')
        ?.slice(0, 5);

      await manageColonyFunds.verifyTokenAdded({
        colonyName: 'planex',
        token: newTokenSymbol ?? '',
      });
    });

    test('Reputation decision method', async () => {
      await manageColonyFunds.open('Manage tokens');
      await manageColonyFunds.setTitle('Manage tokens test');
      await manageColonyFunds.setDecisionMethod('Reputation');

      await manageColonyFunds.form
        .getByRole('button', {
          name: 'Add token',
        })
        .click();

      await manageColonyFunds.manageTokensTable
        .getByLabel('Select token or enter token')
        .click();

      await manageColonyFunds.tokenSearchMenu
        .getByRole('button', {
          name: 'Avatar of token',
        })
        .first()
        .click();

      await manageColonyFunds.updateTokensButton.click();

      await manageColonyFunds.waitForTransaction();

      await expect(
        manageColonyFunds.completedAction.getByText('Manage tokens', {
          exact: true,
        }),
      ).toBeVisible();

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

      await manageColonyFunds.completedAction
        .getByRole('heading', { name: 'Your overview Claimed' })
        .waitFor();

      await expect(manageColonyFunds.claimButton).toBeHidden();
    });

    test('Form validation', async () => {
      await manageColonyFunds.open('Manage tokens');
      await manageColonyFunds.updateTokensButton.click();

      for (const message of ManageColonyFunds.validationMessages.manageTokens
        .allRequiredFields) {
        await expect(manageColonyFunds.drawer.getByText(message)).toBeVisible();
      }

      await manageColonyFunds.form
        .getByRole('button', {
          name: 'Add token',
        })
        .click();
      await manageColonyFunds.manageTokensTable
        .getByLabel('Select token or enter token')
        .click();

      await manageColonyFunds.tokenSearchMenu
        .getByPlaceholder('Select token or enter token address')
        .fill('0x0000000000000000000000000000000000000000');

      await expect(
        manageColonyFunds.tokenSearchMenu.getByText(
          ManageColonyFunds.validationMessages.manageTokens.token
            .isAlreadyAdded,
        ),
      ).toBeVisible();

      await manageColonyFunds.close();
    });
  });
});
