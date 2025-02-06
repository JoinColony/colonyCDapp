import type { Page, Locator } from '@playwright/test';

export class SplitPayment {
  static readonly validationMessages = {
    title: {
      maxLengthExceeded: 'The maximum character limit is 60.',
      isRequired: 'Title is required',
    },
    allRequiredFields: [
      'decisionMethod must be defined',
      'distributionMethod must be defined',
      'team must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
      'Percent is required in 1st payment',
      'Amount must be greater than zero',
      'Title is required',
      'Recipient is required',
    ],
    percentage: {
      mustBe100: 'The sum of percentages must be 100.',
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

  confirmationDialog: Locator;

  recipientsTable: Locator;

  addRecipientButton: Locator;

  expenditureActionStatusBadge: Locator;

  completedActionTable: Locator;

  threeDotButton: Locator;

  redoActionButton: Locator;

  titleInput: Locator;

  totalAmountInput: Locator;

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
    this.confirmationDialog = page
      .getByRole('dialog')
      .filter({ hasText: 'Do you wish to cancel the action creation?' });
    this.recipientsTable = this.form.getByRole('table');
    this.addRecipientButton = this.form.getByRole('button', {
      name: 'Add recipient',
    });
    this.expenditureActionStatusBadge = this.drawer.getByTestId(
      'expenditure-action-status-badge',
    );

    this.completedActionTable = this.completedAction.getByRole('table');
    this.threeDotButton = this.completedAction.getByLabel('Open menu');
    this.redoActionButton = this.page.getByRole('button', {
      name: 'Redo action',
    });
    this.titleInput = this.form.getByPlaceholder('Enter title');
    this.totalAmountInput = this.form.locator('input[name="amount"]');
  }

  async open() {
    await this.sidebar.getByLabel('Start the payment group action').click();
    await this.drawer.waitFor({ state: 'visible' });
    await this.drawer
      .getByRole('button', { name: 'New Split payment' })
      .click();
    await this.form.waitFor({ state: 'visible' });
    await this.drawer
      .getByTestId('action-sidebar-description')
      .waitFor({ state: 'visible' });
  }

  async close() {
    await this.closeButton.click();

    if (await this.confirmationDialog.isVisible()) {
      await this.confirmationDialog
        .getByRole('button', { name: 'Yes, cancel the action' })
        .click();
    }
  }

  async setTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async setRecipient({ address, row = 0 }: { address: string; row: number }) {
    await this.recipientsTable
      .getByRole('row')
      .nth(row)
      .getByLabel('Select user')
      .click();

    await this.page
      .getByPlaceholder('Search or add wallet address')
      .fill(address);

    await this.page
      .getByRole('button', {
        name: address,
      })
      .click();
  }

  async fillForm({
    title,
    team,
    decisionMethod,
    totalAmount,
    distribution,
    recipients,
  }: {
    title?: string;
    team?: string;
    decisionMethod?: string;
    totalAmount?: string;
    distribution?: Distribution;
    recipients?: Recipient[];
  }) {
    if (title) {
      await this.setTitle(title);
    }
    if (team) {
      await this.form.getByRole('button', { name: 'Select team' }).click();
      await this.selectDropdown.getByRole('button', { name: team }).click();
    }
    if (decisionMethod) {
      await this.form.getByRole('button', { name: 'Select method' }).click();

      await this.decisionMethodDropdown
        .getByRole('button', { name: decisionMethod })
        .click();
    }
    if (totalAmount) {
      await this.totalAmountInput.fill(totalAmount);
    }
    if (distribution) {
      await this.form
        .getByRole('button', { name: 'Select split type' })
        .click();
      await this.page
        .getByRole('button', { name: distribution, exact: true })
        .click();
    }

    if (recipients) {
      for (const [
        index,
        { amount, recipient, percentage },
      ] of recipients.entries()) {
        const row = index + 1;
        await this.setRecipient({ address: recipient, row });
        if (amount) {
          await this.recipientsTable
            .getByRole('row')
            .nth(row)
            .getByPlaceholder('Enter amount')
            .fill(amount);
        }
        if (percentage) {
          await this.recipientsTable
            .getByRole('row')
            .nth(row)
            .getByPlaceholder('Enter value')
            .fill(percentage);
        }
        if (row !== recipients.length) {
          await this.addRecipientButton.click();
        }
      }
    }
  }

  async waitForLoadingComplete() {
    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
  }

  async waitForTransaction() {
    await this.page.waitForURL(/\?tx=/);
    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
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

  async releasePayment({ releaseMethod }: { releaseMethod: ReleaseMethod }) {
    await this.completedAction
      .getByRole('button', { name: 'Release' })
      .nth(1)
      .click();
    const releaseDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Release payment' });

    await releaseDialog.waitFor({ state: 'visible' });
    await releaseDialog.getByText('Select Method').click();
    await this.page.getByRole('option', { name: releaseMethod }).click();
    await releaseDialog
      .getByRole('button', { name: 'Release Payment' })
      .click();
    await releaseDialog.waitFor({ state: 'hidden' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });

    await this.expenditureActionStatusBadge
      .filter({
        hasText: 'Paid',
      })
      .waitFor();
  }

  async confirmRequiredStakeDialog() {
    const requiredStakeDialog = this.page.getByRole('dialog').filter({
      hasText: 'Create the payment',
    });

    await requiredStakeDialog.waitFor({ state: 'visible' });

    await requiredStakeDialog.getByTestId('spinner-loader').waitFor({
      state: 'hidden',
    });

    await requiredStakeDialog
      .getByRole('button', { name: 'Create payment' })
      .click();

    await requiredStakeDialog.waitFor({ state: 'hidden' });
  }
}

type Distribution = 'Equal' | 'Unequal' | 'Reputation percentage';
type Recipient = {
  amount?: string;
  recipient: string;
  percentage?: string;
};
type ReleaseMethod = 'Payment creator' | 'Permissions' | 'Reputation';
