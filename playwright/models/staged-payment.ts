import type { Locator, Page } from '@playwright/test';

export class StagedPayment {
  static readonly validationMessages = {
    title: {
      maxLengthExceeded: 'Title must not exceed 60 characters',
      isRequired: 'Title is required',
    },
    allRequiredFields: [
      'from must be a `number` type, but the final value was: `NaN` (cast from the value `""`)',
      'decisionMethod must be defined',
      'Recipient is required',
      'Title is required',
      'Name is required in 1st milestone',
      'Amount must be greater than zero',
    ],
    amount: {
      isRequired: 'Amount is required',
      mustBeGreaterThanZero: 'Amount must be greater than zero',
      maxExceeded: /Not enough \w+ tokens/,
    },
    token: {
      locked:
        'This token is locked and is not able to be used for payments. Check with the token creator for details.',
    },
    milestone: {
      maxLengthExceeded: /\w+ milestone exceeds limit of 80 characters./,
    },
  };

  drawer: Locator;

  form: Locator;

  selectDropdown: Locator;

  decisionMethodDropdown: Locator;

  sidebar: Locator;

  stepper: Locator;

  closeButton: Locator;

  submitButton: Locator;

  completedAction: Locator;

  expenditureActionStatusBadge: Locator;

  makePaymentButton: Locator;

  stagesTable: Locator;

  addMilestoneButton: Locator;

  supportButton: Locator;

  opposeButton: Locator;

  submitVoteButton: Locator;

  revealVoteButton: Locator;

  finalizeButton: Locator;

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
    this.submitButton = page.getByRole('button', { name: 'Create payment' });
    this.completedAction = page.getByTestId('completed-action');
    this.expenditureActionStatusBadge = this.drawer.getByTestId(
      'expenditure-action-status-badge',
    );
    this.makePaymentButton = this.completedAction.getByRole('button', {
      name: 'Make next payment',
    });
    this.stagesTable = this.completedAction.getByRole('table');
    this.addMilestoneButton = this.form.getByRole('button', {
      name: 'Add milestone',
    });
    this.supportButton = this.stepper.getByText('Support', { exact: true });
    this.opposeButton = this.stepper.getByText('Oppose', { exact: true });
    this.submitVoteButton = this.stepper.getByRole('button', {
      name: 'Submit vote',
    });
    this.revealVoteButton = this.stepper.getByRole('button', {
      name: 'Reveal vote',
    });
    this.finalizeButton = this.stepper.getByRole('button', {
      name: 'Finalize',
    });
  }

  async open() {
    await this.sidebar.getByLabel('Start the payment group action').click();
    await this.drawer.waitFor({ state: 'visible' });
    await this.drawer
      .getByRole('button', {
        name: 'New Staged payments Pre-funded milestone based payments',
      })
      .click();
    await this.form.waitFor({ state: 'visible' });
    await this.drawer
      .getByTestId('action-sidebar-description')
      .waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeButton.click();

    const dialog = this.getConfirmationDialog();
    if (await dialog.isVisible()) {
      await dialog
        .getByRole('button', { name: 'Yes, cancel the action' })
        .click();
    }
  }

  async setTitle(title: string) {
    await this.form.getByPlaceholder('Enter title').fill(title);
  }

  async selectTeam(teamName: string) {
    await this.form.getByRole('button', { name: 'Select team' }).click();
    await this.selectDropdown.getByRole('button', { name: teamName }).click();
  }

  async setRecipient(address: string) {
    await this.form.getByLabel('Select user').click();
    await this.page.getByPlaceholder('Search or add wallet address').click();
    await this.page
      .getByPlaceholder('Search or add wallet address')
      .fill(address);
    await this.page
      .getByRole('button', {
        name: address,
      })
      .click();
  }

  async setAmount(amount: string) {
    await this.form.getByPlaceholder('Enter amount').fill(amount);
  }

  async selectToken(tokenName: string) {
    await this.form.getByRole('button', { name: 'Select token' }).click();
    await this.page
      .getByTestId('token-list-item')
      .getByText(tokenName)
      .first()
      .click();
  }

  async selectDecisionMethod(method: string) {
    await this.form.getByRole('button', { name: 'Select method' }).click();

    await this.decisionMethodDropdown
      .getByRole('button', { name: method })
      .click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async waitForTransaction() {
    await this.page.waitForURL(/\?tx=/);
    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
  }

  getConfirmationDialog() {
    return this.page
      .getByRole('dialog')
      .filter({ hasText: 'Do you wish to cancel the action creation?' });
  }

  async setStages(stages: Stage[]) {
    for (const [index, stage] of stages.entries()) {
      if (index !== 0) {
        await this.form.getByRole('button', { name: 'Add milestone' }).click();
      }
      await this.form
        .getByPlaceholder('Enter milestone')
        .nth(index)
        .fill(stage.title);
      await this.form
        .getByPlaceholder('Enter amount')
        .nth(index)
        .fill(stage.amount);
      if (stage.token) {
        await this.form

          .getByRole('button', { name: 'Select token' })
          .nth(index)
          .click();
        await this.page
          .getByTestId('token-list-item')
          .getByText(stage.token)
          .first()
          .click();
      }
    }
  }

  async confirmRequiredStakeDialog() {
    const modal = this.page.getByRole('dialog').filter({
      hasText: 'Create the payment',
    });
    await modal.waitFor({ state: 'visible' });
    await modal
      .getByText('Required stake amount')
      .waitFor({ state: 'visible' });
    await modal.getByRole('button', { name: 'Create payment' }).click();
    await modal.waitFor({ state: 'hidden' });
  }

  async confirmPayment() {
    await this.completedAction
      .getByRole('button', { name: 'Confirm details' })
      .click();

    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });

    await this.expenditureActionStatusBadge
      .filter({
        hasText: 'Funding',
      })
      .waitFor();
  }

  async fundPayment(method: 'Permissions' | 'Reputation' = 'Permissions') {
    await this.completedAction
      .getByRole('button', { name: 'Fund', exact: true })
      .click();

    const fundDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Payment funding' });
    await fundDialog.waitFor({ state: 'visible' });
    await fundDialog.getByText('Select Method').click();
    await this.page.getByRole('option', { name: method }).click();
    await fundDialog.getByRole('button', { name: 'Fund Payment' }).click();
    await fundDialog.waitFor({ state: 'hidden' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });
  }

  async releasePayment(method: 'Permissions' | 'Reputation' = 'Permissions') {
    await this.completedAction
      .getByRole('button', { name: 'Release' })
      .nth(1)
      .click();
    const releaseDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Release payment' });

    await releaseDialog.waitFor({ state: 'visible' });
    await releaseDialog.getByText('Select Method').click();
    await this.page.getByRole('option', { name: method }).click();
    await releaseDialog
      .getByRole('button', { name: 'Release Payment' })
      .click();
    await releaseDialog.waitFor({ state: 'hidden' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });
  }

  async makePayment(method: 'Permissions' | 'Payment creator' | 'Reputation') {
    await this.makePaymentButton.click();

    await this.page.getByRole('button', { name: 'Pending' }).last().waitFor({
      state: 'hidden',
    });

    const modal = this.page.getByRole('dialog').filter({
      hasText: 'Make milestone payments',
    });
    await modal.waitFor({ state: 'visible' });
    await modal.getByText('Select method').click();
    await this.page.getByRole('option', { name: method, exact: true }).click();

    await modal.getByRole('button', { name: 'Make payment' }).click();

    await modal.waitFor({ state: 'hidden' });
    if (
      await this.completedAction
        .getByRole('button', { name: 'Pending' })
        .isVisible()
    ) {
      await this.completedAction
        .getByRole('button', { name: 'Pending' })
        .waitFor({ state: 'hidden' });
    }
  }

  async fillForm({
    title,
    team,
    recipient,
    decisionMethod,
    stages,
  }: {
    title?: string;
    team?: string;
    recipient?: string;
    decisionMethod?: string;
    stages?: Stage[];
  }) {
    if (title) {
      await this.setTitle(title);
    }
    if (team) {
      await this.selectTeam(team);
    }
    if (recipient) {
      await this.setRecipient(recipient);
    }
    if (decisionMethod) {
      await this.selectDecisionMethod(decisionMethod);
    }

    if (stages) {
      await this.setStages(stages);
    }
  }

  async duplicateMilestone(row: number) {
    await this.form
      .getByRole('table')
      .locator('tbody tr')
      .nth(row)
      .getByRole('cell', { name: 'Open menu' })
      .click();
    await this.form.getByRole('button', { name: 'Duplicate row' }).click();
  }

  async deleteMilestone(row: number) {
    await this.form
      .getByRole('table')
      .locator('tbody tr')
      .nth(row)
      .getByRole('cell', { name: 'Open menu' })
      .click();
    await this.form.getByRole('button', { name: 'Remove row' }).click();
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

type Stage = {
  title: string;
  amount: string;
  token?: string;
};
