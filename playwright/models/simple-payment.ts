import type { Locator, Page } from '@playwright/test';

export class SimplePayment {
  static readonly validationMessages = {
    title: {
      maxLengthExceeded: 'Title must not exceed 60 characters',
      isRequired: 'Title is required',
    },
    allRequiredFields: [
      'decisionMethod must be defined',
      // 'from is a required field', // Uncomment once issue #3802 is fixed
      'recipient is a required field',
      'Amount must be greater than zero',
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

  selectDropdown: Locator;

  decisionMethodDropdown: Locator;

  sidebar: Locator;

  stepper: Locator;

  closeButton: Locator;

  userInfo: Locator;

  submitButton: Locator;

  completedAction: Locator;

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
    this.userInfo = page.getByTestId('user-info');
    this.submitButton = page.getByRole('button', { name: 'Create payment' });
    this.completedAction = page.getByTestId('completed-action');
  }

  async open() {
    await this.sidebar.getByLabel('Start the payment group action').click();
    await this.drawer.waitFor({ state: 'visible' });
    await this.drawer
      .getByRole('button', {
        name: 'Simple payment Quick, one-click transfers',
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
    await this.form
      .getByRole('button', { name: 'Pending' })
      .first()
      .waitFor({ state: 'visible' });

    await this.form
      .getByRole('button', { name: 'Pending' })
      .first()
      .waitFor({ state: 'hidden' });

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
    await this.form.getByRole('button', { name: 'Simple payment' }).click();
    await this.selectDropdown.waitFor({ state: 'visible' });
    await this.selectDropdown.getByRole('button', { name: newType }).click();
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

  async voteOnMotion(voteType: 'Support' | 'Oppose') {
    await this.completedAction
      .getByRole('heading', {
        name: 'Total stake required',
      })
      .waitFor({ state: 'visible' });
    await this.completedAction.getByTestId('countDownTimer').waitFor({
      state: 'visible',
    });
    await this.completedAction.getByText(voteType, { exact: true }).click();
    await this.completedAction.getByRole('button', { name: 'Max' }).click();

    await this.completedAction.getByRole('button', { name: 'Stake' }).click();

    await this.completedAction.getByRole('button', { name: 'Stake' }).waitFor({
      state: 'hidden',
    });
  }

  async finalize() {
    await this.completedAction
      .getByTestId('stepper')
      .locator('form')
      .getByRole('button', { name: 'Finalize' })
      .click();

    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'visible' });
    await this.completedAction
      .getByRole('button', { name: 'Pending' })
      .waitFor({ state: 'hidden' });
  }

  async claim() {
    await this.completedAction
      .getByTestId('stepper')
      .locator('form')
      .getByRole('button', { name: 'Claim' })
      .click();
    await this.completedAction
      .getByText('Claimed')
      .waitFor({ state: 'visible' });
  }

  async fillForm({
    title,
    team,
    recipient,
    amount,
    decisionMethod,
    token,
  }: {
    title?: string;
    team?: string;
    recipient?: string;
    amount?: string;
    token?: string;
    decisionMethod?: string;
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
    if (amount) {
      await this.setAmount(amount);
    }
    if (decisionMethod) {
      await this.selectDecisionMethod(decisionMethod);
    }
    if (token) {
      await this.selectToken(token);
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
}
