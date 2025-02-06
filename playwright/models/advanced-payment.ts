import type { Locator, Page } from '@playwright/test';

type Recipient = {
  amount: string;
  claimDelay: string;
  recipient: string;
};

type CSVFileInput =
  | string
  | {
      name: string;
      mimeType: string;
      buffer: Buffer;
    };

export class AdvancedPayment {
  static readonly validationMessages = {
    title: {
      maxLengthExceeded: 'The maximum character limit is 60.',
      isRequired: 'Title is required',
    },
    allRequiredFields: [
      // This one should be changed to a human readable message
      'from must be a `number` type, but the final value was: `NaN` (cast from the value `""`)',
      'decisionMethod must be defined',
      'Recipient is required in 1st payment',
      'Amount must be greater than zero',
      "Claim delay can't be empty in 1st payment",
      'Title is required',
    ],
    amount: {
      isRequired: 'Amount is required',
      mustBeGreaterThanZero: 'Amount must be greater than zero',
      maxExceeded: 'Not enough funds to cover the payment and network fees',
    },
    permissions:
      "You don't have the right permissions to create this action. Try another action type.",
    token: {
      locked:
        'This token is locked and is not able to be used for payments. Check with the token creator for details.',
    },
  };

  static readonly tooltipMessages = {
    From: /Team source of the funds/i,
    Recipient: /Member or address designated to receive the funds/i,
    Amount: /Quantity and type of funds of the payment/i,
    'Decision method': /Mechanism behind the decision-making process/i,
  };

  drawer: Locator;

  form: Locator;

  selectDrowdown: Locator;

  decisionMethodDropdown: Locator;

  sidebar: Locator;

  stepper: Locator;

  closeButton: Locator;

  userInfo: Locator;

  submitButton: Locator;

  completedAction: Locator;

  recipientsTable: Locator;

  addPaymentButton: Locator;

  uploadCSVButton: Locator;

  openMenuButton: Locator;

  totalAmount: Locator;

  expenditureActionStatusBadge: Locator;

  menuButton: Locator;

  constructor(private page: Page) {
    this.drawer = page.getByTestId('action-drawer');
    this.form = page.getByTestId('action-form');
    this.selectDrowdown = page.getByTestId('search-select-menu');
    this.decisionMethodDropdown = page
      .getByRole('list')
      .filter({ hasText: /Available decision methods/i });
    this.sidebar = page.getByTestId('colony-page-sidebar');
    this.stepper = page.getByTestId('stepper');
    this.closeButton = page.getByRole('button', { name: /close the modal/i });
    this.userInfo = page.getByTestId('user-info');
    this.submitButton = page.getByRole('button', { name: 'Create payment' });
    this.completedAction = page.getByTestId('completed-action');
    this.recipientsTable = page.getByTestId('payment-builder-recipients-field');
    this.addPaymentButton = page.getByRole('button', { name: 'Add payment' });
    this.uploadCSVButton = page.getByRole('button', {
      name: 'Upload CSV',
    });
    this.openMenuButton = this.form.getByRole('button', { name: 'Open menu' });
    this.totalAmount = page.getByTestId('payment-builder-payouts-total');
    this.expenditureActionStatusBadge = this.drawer.getByTestId(
      'expenditure-action-status-badge',
    );
    this.menuButton = this.completedAction.getByLabel('Open menu');
  }

  async open() {
    await this.sidebar.getByLabel('Start the payment group action').click();
    await this.drawer.waitFor({ state: 'visible' });
    await this.drawer
      .getByRole('button', {
        name: /New Advanced Payment Multiple recipients/i,
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
    await this.selectDrowdown.getByRole('button', { name: teamName }).click();
  }

  async setRecipient({ address, row = 0 }: { address: string; row: number }) {
    await this.recipientsTable
      .getByRole('row')
      .nth(row)
      .getByLabel('Select user')
      .click();
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

  async setAmount({ amount, row = 0 }: { amount: string; row: number }) {
    await this.recipientsTable
      .getByRole('row')
      .nth(row)
      .getByRole('cell', { name: 'Select Token' })
      .getByPlaceholder('Enter amount')
      .fill(amount);
  }

  async setClaimDelay({ delay, row = 0 }: { delay: string; row: number }) {
    await this.recipientsTable
      .getByRole('row')
      .nth(row)
      .getByRole('cell', { name: 'Hours' })
      .getByPlaceholder('Enter amount')
      .fill(delay);
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

  async waitForPending() {
    await this.form
      .getByRole('button', { name: 'Pending' })
      .first()
      .waitFor({ state: 'visible' });
  }

  async waitForTransaction() {
    await this.page.waitForURL(/\?tx=/);
    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
  }

  async verifyStepperUI() {
    await this.stepper.waitFor({ state: 'visible' });
    await this.stepper
      .getByRole('button', { name: 'Staking' })
      .waitFor({ state: 'visible' });
    await this.stepper
      .getByRole('button', { name: 'Voting' })
      .waitFor({ state: 'visible' });

    await this.stepper.getByRole('button', { name: 'Reveal' }).waitFor({
      state: 'visible',
    });

    await this.stepper.getByRole('button', { name: 'Outcome' }).waitFor({
      state: 'visible',
    });

    await this.stepper.getByRole('button', { name: 'Finalize' }).waitFor({
      state: 'visible',
    });
  }

  async openUserInfo() {
    await this.form
      .getByTestId('action-sidebar-description')
      .getByRole('button')
      .click();
  }

  async changeActionType(newType: string) {
    await this.form.getByRole('button', { name: 'Advanced payment' }).click();
    await this.selectDrowdown.getByRole('button', { name: newType }).click();
  }

  getValidationMessage(message: string) {
    return this.drawer.getByText(message);
  }

  getTooltip(text: RegExp) {
    return this.page.getByText(text);
  }

  getConfirmationDialog() {
    return this.page
      .getByRole('dialog')
      .filter({ hasText: 'Do you wish to cancel the action creation?' });
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

  async fundPayment() {
    await this.completedAction
      .getByRole('button', { name: 'Fund', exact: true })
      .click();

    const fundDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Payment funding' });
    await fundDialog.waitFor({ state: 'visible' });
    await fundDialog.getByText('Select Method').click();
    await this.page.getByRole('option', { name: 'Permissions' }).click();
    await fundDialog.getByRole('button', { name: 'Fund Payment' }).click();
    await fundDialog.waitFor({ state: 'hidden' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });

    await this.expenditureActionStatusBadge
      .filter({
        hasText: 'Release',
      })
      .waitFor();
  }

  async releasePayment() {
    await this.completedAction
      .getByRole('button', { name: 'Release' })
      .nth(1)
      .click();
    const releaseDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Release payment' });

    await releaseDialog.waitFor({ state: 'visible' });
    await releaseDialog.getByText('Select Method').click();
    await this.page.getByRole('option', { name: 'Permissions' }).click();
    await releaseDialog
      .getByRole('button', { name: 'Release Payment' })
      .click();
    await releaseDialog.waitFor({ state: 'hidden' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });

    await this.expenditureActionStatusBadge
      .filter({
        hasText: 'Payable',
      })
      .waitFor();
  }

  async makePayment() {
    await this.completedAction
      .getByRole('button', { name: 'Make payment' })
      .click();

    await this.page.getByRole('button', { name: 'Pending' }).last().waitFor({
      state: 'hidden',
    });

    await this.completedAction
      .getByRole('button', { name: 'Make payment' })
      .waitFor({ state: 'hidden' });

    await this.expenditureActionStatusBadge
      .filter({
        hasText: 'Paid',
      })
      .waitFor();
  }

  async confirmRequiredStakeDialog() {
    await this.page
      .getByRole('dialog')
      .filter({ hasText: 'Required stake amount' })
      .getByRole('button', { name: 'Create payment' })
      .click();

    await this.page
      .getByRole('dialog')
      .filter({ hasText: 'Required stake amount' })
      .waitFor({ state: 'hidden' });
  }

  async fillForm({
    title,
    team,
    decisionMethod,
    recipients,
  }: {
    title: string;
    team: string;
    decisionMethod: string;
    recipients?: Recipient[];
  }) {
    await this.setTitle(title);
    await this.selectTeam(team);
    await this.selectDecisionMethod(decisionMethod);

    if (recipients) {
      for (const [
        index,
        { amount, claimDelay, recipient },
      ] of recipients.entries()) {
        const row = index + 1;
        await this.setAmount({ amount, row });
        await this.setClaimDelay({ delay: claimDelay, row });
        await this.setRecipient({ address: recipient, row });
        if (row !== recipients.length) {
          await this.addPaymentButton.click();
        }
      }
    }
  }

  async reloadPage() {
    await this.page.reload();

    await this.page.getByText(/loading colon/i).waitFor({ state: 'hidden' });

    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
  }

  async cancelAction() {
    const cancelDialog = this.page.getByRole('dialog').filter({
      has: this.page.getByRole('heading', { name: 'Cancel the payment' }),
    });

    await this.menuButton.click();
    await this.page.getByRole('button', { name: 'Cancel payment' }).click();
    await cancelDialog.waitFor({ state: 'visible' });

    await cancelDialog.getByText('Select method').click();
    await this.page.getByRole('option', { name: 'Permissions' }).click();
    await cancelDialog
      .getByRole('button', { name: 'Confirm cancelation' })
      .click();

    await cancelDialog.waitFor({ state: 'hidden' });
  }

  async uploadRecipientsCSV(csvInput: CSVFileInput) {
    await this.uploadCSVButton.click();

    const dialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Upload CSV' });
    await dialog.waitFor({ state: 'visible' });

    await dialog.locator('input[type="file"]').setInputFiles(csvInput);

    return dialog;
  }
}
