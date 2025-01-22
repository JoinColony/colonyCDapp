import { type Page, type Locator, expect } from '@playwright/test';

export class ManageColonyFunds {
  static readonly validationMessages = {
    common: {
      amount: {
        isRequired: 'required field',
        mustBeGreaterThanZero: 'Amount must be greater than zero',
      },
      title: {
        maxLengthExceeded: 'Title must not exceed 60 characters',
        isRequired: 'Title is required',
      },
    },
    mintTokens: {
      allRequiredFields: [
        'required field',
        'decisionMethod must be defined',
        'Title is required',
      ],
    },
    fundsTransfer: {
      allRequiredFields: [
        'from must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
        'decisionMethod must be defined',
        'to is a required field',
        'Amount must be greater than zero',
        'Title is required',
      ],
      team: {
        sameTeam: 'Cannot move to same team pot.',
      },
      amount: {
        notEnoughFunds:
          'Not enough funds to cover the payment and network fees',
      },
      token: {
        locked:
          'This token is locked and is not able to be used for payments. Check with the token creator for details.',
      },
    },
    manageTokens: {
      allRequiredFields: [
        'No changes in the table',
        'Title is required',
        "Decision Method can't be empty",
      ],
      token: {
        isAlreadyAdded: 'This token is already on colony tokens list',
      },
    },
  };

  drawer: Locator;

  form: Locator;

  sidebar: Locator;

  selectDropdown: Locator;

  decisionMethodDropdown: Locator;

  stepper: Locator;

  closeButton: Locator;

  mintTokensButton: Locator;

  completedAction: Locator;

  confirmationDialog: Locator;

  supportButton: Locator;

  opposeButton: Locator;

  submitVoteButton: Locator;

  revealVoteButton: Locator;

  finalizeButton: Locator;

  claimButton: Locator;

  transferFundsButton: Locator;

  updateTokensButton: Locator;

  manageTokensTable: Locator;

  tokenSelector: Locator;

  tokenSearchMenu: Locator;

  constructor(private page: Page) {
    this.drawer = page.getByTestId('action-drawer');
    this.form = page.getByTestId('action-form');
    this.selectDropdown = page.getByTestId('search-select-menu');
    this.decisionMethodDropdown = page
      .getByRole('list')
      .filter({ hasText: /Available decision methods/i });
    this.sidebar = page.getByTestId('colony-page-sidebar');
    this.stepper = page.getByTestId('stepper');
    this.closeButton = page.getByRole('button', { name: /close the modal/i });
    this.mintTokensButton = page
      .getByRole('button', {
        name: 'Mint tokens',
      })
      .nth(1);
    this.completedAction = page.getByTestId('completed-action');
    this.confirmationDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Do you wish to cancel the action creation?' });
    this.supportButton = this.stepper.getByText('Support', { exact: true });
    this.opposeButton = this.stepper.getByText('Oppose', { exact: true });
    this.submitVoteButton = this.stepper.getByRole('button', {
      name: 'Submit vote',
    });
    this.revealVoteButton = this.stepper.getByRole('button', {
      name: 'Reveal vote',
    });
    this.finalizeButton = this.completedAction
      .getByRole('button', {
        name: 'Finalize',
      })
      .last();
    this.claimButton = this.stepper
      .getByRole('button', {
        name: 'Claim',
      })
      .last();
    this.transferFundsButton = this.form
      .getByRole('button', {
        name: 'Transfer funds',
      })
      .last();
    this.updateTokensButton = this.form
      .getByRole('button', {
        name: 'Update tokens',
      })
      .last();
    this.manageTokensTable = this.drawer.getByRole('table');
    this.tokenSelector = this.page.getByTestId('token-select');
    this.tokenSearchMenu = this.page.getByTestId('token-search-select');
  }

  async setTitle(title: string) {
    await this.form.getByPlaceholder('Enter title').fill(title);
  }

  async open(motionTitle: 'Mint tokens' | 'Transfer funds' | 'Manage tokens') {
    await this.sidebar.getByLabel('Start the manage colony action').click();
    await this.drawer.waitFor({ state: 'visible' });
    await this.drawer
      .getByRole('button', {
        name: motionTitle,
      })
      .click();
    await this.form.waitFor({ state: 'visible' });
    await this.drawer
      .getByTestId('action-sidebar-description')
      .waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeButton.click();

    const dialog = this.confirmationDialog;
    if (await dialog.isVisible()) {
      await dialog
        .getByRole('button', { name: 'Yes, cancel the action' })
        .click();
    }
  }

  async getBalance(
    colonyName: string,
    balances: {
      token: string;
      team?: string;
    }[],
  ) {
    await this.page.goto(`/${colonyName}/balances`);

    const result: string[] = [];

    for (const { team, token } of balances) {
      if (team) {
        await this.page.getByRole('button', { name: team }).click();
        await this.page.waitForURL(/\?team=/);
      }

      const value = await this.page
        .getByRole('table')
        .locator('tr td')
        .filter({ hasText: token })
        .last()
        .textContent();
      result.push(value?.split(' ')[0] ?? '');
    }
    await this.page.getByRole('button', { name: 'All teams' }).click();

    return result;
  }

  async waitForTransaction() {
    await this.waitForPending();
    await this.page.waitForURL(/\?tx=/);
    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
  }

  async waitForPending() {
    await this.page
      .getByRole('button', { name: 'Pending' })
      .last()
      .waitFor({ state: 'visible' });

    await this.page
      .getByRole('button', { name: 'Pending' })
      .last()
      .waitFor({ state: 'hidden' });
  }

  async setDecisionMethod(decisionMethod: 'Permissions' | 'Reputation') {
    await this.form.getByRole('button', { name: 'Select method' }).click();

    await this.decisionMethodDropdown
      .getByRole('button', { name: decisionMethod })
      .click();
  }

  async fillMintTokensForm({
    amount,
    decisionMethod,
    title,
  }: {
    amount?: string;
    decisionMethod?: 'Permissions' | 'Reputation';
    title?: string;
  }) {
    if (title) {
      await this.setTitle(title);
    }
    if (amount) {
      await this.form.getByPlaceholder('Enter amount').fill(amount);
    }

    if (decisionMethod) {
      await this.setDecisionMethod(decisionMethod);
    }
  }

  async fillTransferFundsForm({
    amount,
    title,
    from,
    to,
    decisionMethod,
    tokenSymbol,
  }: {
    amount?: string;
    title?: string;
    from?: string;
    to?: string;
    decisionMethod?: 'Permissions' | 'Reputation';
    tokenSymbol?: string;
  }) {
    if (title) {
      await this.setTitle(title);
    }
    if (amount) {
      await this.form.getByPlaceholder('Enter amount').fill(amount);
    }
    if (from) {
      await this.form
        .getByRole('button', { name: 'Select team' })
        .first()
        .click();
      await this.selectDropdown.getByRole('button', { name: from }).click();
    }
    if (to) {
      await this.form
        .getByRole('button', { name: 'Select team' })
        .last()
        .click();
      await this.selectDropdown.getByRole('button', { name: to }).click();
    }

    if (decisionMethod) {
      await this.setDecisionMethod(decisionMethod);
    }
    if (tokenSymbol) {
      await this.form.getByRole('button', { name: 'Select token' }).click();
      await this.page
        .getByTestId('token-list-item')
        .getByText(tokenSymbol)
        .first()
        .click();
    }
  }

  async support(stakeAmount?: string) {
    await this.supportButton.click();
    await this.stepper.getByLabel('Stake amount').waitFor({ state: 'visible' });
    await this.stepper
      .getByRole('button', { name: 'Max' })
      .waitFor({ state: 'visible' });
    if (stakeAmount) {
      await this.stepper.getByLabel('Stake amount').fill(stakeAmount);
    } else {
      await this.stepper.getByRole('button', { name: 'Max' }).click();
    }

    await this.stepper.getByRole('button', { name: 'Stake' }).click();
  }

  async oppose(stakeAmount?: string) {
    await this.opposeButton.click();
    if (stakeAmount) {
      await this.stepper.getByRole('textbox').fill(stakeAmount);
    } else {
      await this.stepper.getByRole('button', { name: 'Max' }).click();
    }

    await this.stepper.getByRole('button', { name: 'Stake' }).click();
  }

  async verifyTokenAdded({
    colonyName,
    token,
  }: {
    colonyName: string;
    token: string;
  }) {
    await this.page.goto(`/${colonyName}/balances`);

    await this.page
      .getByRole('heading', { name: 'Colony token balance' })
      .waitFor({ state: 'visible' });
    await this.page.getByRole('table').waitFor({ state: 'visible' });
    await this.page
      .getByRole('table')
      .getByText(token)
      .first()
      .waitFor({ state: 'visible' });
  }

  async removeTokens() {
    await this.open('Manage tokens');
    await this.setTitle('Remove tokens');
    await this.setDecisionMethod('Permissions');
    const allAddedTokens = await this.manageTokensTable
      .getByLabel('Open menu')
      .all();

    if (allAddedTokens.length === 0) {
      return;
    }

    for (const token of allAddedTokens) {
      await token.click();
      await this.page.getByRole('button', { name: 'Remove row' }).click();
    }

    await this.updateTokensButton.click();
    await this.waitForTransaction();

    await expect(this.manageTokensTable.getByText('Removed')).toHaveCount(
      allAddedTokens.length,
    );
  }
}
