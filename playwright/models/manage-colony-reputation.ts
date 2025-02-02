import { type Page, type Locator, expect } from '@playwright/test';
import { forwardTime } from 'playwright/utils/common';

import { ReputationFlow } from './reputation-flow.ts';

export class ManageReputation {
  static readonly validationMessages = {
    allRequiredFields: [
      'team must be a `number` type, but the final value was: `NaN` (cast from the value `""`).',
      'decisionMethod must be defined',
      'modification is a required field',
      'amount is a required field',
      'member is a required field',
      'Title is required',
    ],
    title: {
      maxLengthExceeded: 'Title must not exceed 60 characters',
    },
    amount: {
      mustBeGreaterThanZero: 'Amount must be greater than zero',
    },
    member: {
      invalid: 'This is not a valid address',
    },
  };

  page: Page;

  drawer: Locator;

  form: Locator;

  sidebar: Locator;

  selectDropdown: Locator;

  decisionMethodDropdown: Locator;

  stepper: Locator;

  closeButton: Locator;

  completedAction: Locator;

  confirmationDialog: Locator;

  supportButton: Locator;

  opposeButton: Locator;

  submitVoteButton: Locator;

  revealVoteButton: Locator;

  finalizeButton: Locator;

  claimButton: Locator;

  updateReputationButton: Locator;

  table: Locator;

  currentReputation: Locator;

  newReputation: Locator;

  userHubButton: Locator;

  userHubPopover: Locator;

  totalReputationPoints: Locator;

  reputationFlow: ReputationFlow;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.getByTestId('action-drawer');
    this.form = page.getByTestId('action-form');
    this.selectDropdown = page.getByTestId('search-select-menu');
    this.decisionMethodDropdown = page
      .getByRole('list')
      .filter({ hasText: /Available decision methods/i });
    this.sidebar = page.getByTestId('colony-page-sidebar');
    this.stepper = page.getByTestId('stepper');
    this.closeButton = page.getByRole('button', { name: /close the modal/i });
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
    this.updateReputationButton = this.drawer
      .getByRole('button', {
        name: 'Update reputation',
      })
      .last();
    this.table = this.page.getByRole('table');
    this.currentReputation = this.table
      .locator('tbody')
      .nth(0)
      .locator('td')
      .nth(0);
    this.newReputation = this.table
      .locator('tbody')
      .nth(0)
      .locator('td')
      .last();
    this.userHubButton = this.page.getByTestId('user-hub-button');
    this.userHubPopover = this.page.getByTestId('user-hub');
    this.totalReputationPoints =
      this.userHubPopover.getByTestId('reputation-points');
    this.reputationFlow = new ReputationFlow(this);
  }

  async setTitle(title: string) {
    await this.form.getByPlaceholder('Enter title').fill(title);
  }

  async open(motionTitle: 'Manage reputation') {
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

  async fillManageReputationForm({
    title,
    modification,
    member,
    amount,
    decisionMethod,
  }: {
    title?: string;
    modification?: string;
    member?: string;
    amount?: string;
    decisionMethod?: 'Permissions' | 'Reputation';
  }) {
    if (title) {
      await this.setTitle(title);
    }

    if (modification) {
      await this.form
        .getByRole('button', { name: 'Select modification' })
        .click();
      await this.page.getByRole('button', { name: modification }).click();
    }

    if (member) {
      await this.form.getByRole('button', { name: 'Select user' }).click();
      await this.page
        .getByPlaceholder('Search or add wallet address')
        .fill(member);
      await this.page.getByRole('button', { name: member }).click();
    }

    if (decisionMethod) {
      await this.setDecisionMethod(decisionMethod);
    }

    if (amount) {
      await this.table.getByPlaceholder('Enter value').fill(amount);
    }
  }

  async selectTeam(teamName: string) {
    await this.form
      .getByRole('button', { name: 'Select team', exact: true })
      .click();
    await this.selectDropdown.getByText(teamName).click();
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

  async verifyReputationValuesInTable(amount: string) {
    const currentReputation = await this.currentReputation.textContent();
    const newReputation = await this.newReputation.textContent();

    // Extract numbers by taking everything before "Points" and removing commas
    const currentValue = parseFloat(
      currentReputation?.split('Points')[0].replace(/,/g, '') || '0',
    );
    const newValue = parseFloat(
      newReputation?.split('Points')[0].replace(/,/g, '') || '0',
    );
    const amountValue = parseFloat(amount);

    // Verify that new reputation equals current reputation plus amount
    expect(newValue).toBeCloseTo(currentValue + amountValue, 0);

    const percentage = await this.table
      .locator('tbody td')
      .nth(1)
      .textContent();

    return percentage;
  }

  async verifyReputationChange({
    pointsAdded = 0,
    pointsRemoved = 0,
  }: {
    pointsAdded?: number;
    pointsRemoved?: number;
  }) {
    await this.userHubButton.click();
    await this.userHubPopover.waitFor({ state: 'visible' });
    const initialTotalReputationPoints =
      await this.totalReputationPoints.textContent();
    const initialTotalReputationPointsValue = parseFloat(
      (initialTotalReputationPoints || '0').replace(/,/g, ''),
    );

    await forwardTime(2);

    await this.page.reload();
    // It doesn't work locally without this second forwardTime - reputation points are not updated
    await forwardTime(2);
    await this.page.reload();

    await this.page.getByText('Loading').waitFor({ state: 'hidden' });

    await this.page
      .getByTestId('loading-skeleton')
      .last()
      .waitFor({ state: 'hidden' });
    await this.userHubButton.click();
    await this.userHubPopover.waitFor({ state: 'visible' });

    const totalReputationPoints =
      await this.totalReputationPoints.textContent();
    const reputationPointsValue = parseFloat(
      (totalReputationPoints || '0').replace(/,/g, ''),
    );

    const expectedValue = Math.floor(
      initialTotalReputationPointsValue + pointsAdded + pointsRemoved,
    );
    const actualValue = Math.floor(reputationPointsValue);

    // Verify that actual value is within ±1 of expected value to account for rounding differences
    expect(Math.abs(actualValue - expectedValue) <= 1).toBeTruthy();
  }

  async completeReputationFlow() {
    await this.reputationFlow.completeVotingWithSupport();
  }
}
