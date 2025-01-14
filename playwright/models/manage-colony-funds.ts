import type { Page, Locator } from '@playwright/test';

export class ManageColonyFunds {
  static readonly validationMessages = {
    title: {
      maxLengthExceeded: 'Title must not exceed 60 characters',
      isRequired: 'Title is required',
    },
    allRequiredFields: [
      'required field',
      'decisionMethod must be defined',
      'Title is required',
    ],
    amount: {
      isRequired: 'required field',
      mustBeGreaterThanZero: 'Amount must be greater than zero',
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
  }

  async open(motionTitle: 'Mint tokens') {
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

  async getBalance({ token }: { token: string }) {
    await this.sidebar
      .getByLabel('Go to the Colony balances page')
      .first()
      .click();
    await this.sidebar.getByText('Balances').click();

    await this.page.waitForURL('**/balances');
    const balanceCell = this.page
      .getByRole('table')
      .locator('tr td')
      .filter({ hasText: token })
      .last();
    const balance = await balanceCell.textContent();
    return balance?.split(' ')[0];
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
      await this.form.getByPlaceholder('Enter title').fill(title);
    }
    if (amount) {
      await this.form.getByPlaceholder('Enter amount').fill(amount);
    }

    if (decisionMethod) {
      await this.form.getByRole('button', { name: 'Select method' }).click();

      await this.decisionMethodDropdown
        .getByRole('button', { name: decisionMethod })
        .click();
    }
  }

  async support(stakeAmount?: string) {
    await this.supportButton.click();
    await this.stepper.getByRole('textbox').waitFor({ state: 'visible' });
    if (stakeAmount) {
      await this.stepper.getByRole('textbox').fill(stakeAmount);
    } else {
      await this.stepper.getByRole('button', { name: 'Max' }).click();
    }
    await this.stepper.getByRole('button', { name: 'Stake' }).waitFor();
    await this.stepper.getByRole('button', { name: 'Stake' }).click();
  }

  async oppose(stakeAmount?: string) {
    await this.opposeButton.click();
    if (stakeAmount) {
      await this.stepper.getByRole('textbox').fill(stakeAmount);
    } else {
      await this.stepper.getByRole('button', { name: 'Max' }).click();
    }
    await this.stepper.getByRole('button', { name: 'Stake' }).waitFor();
    await this.stepper.getByRole('button', { name: 'Stake' }).click();
  }
}
