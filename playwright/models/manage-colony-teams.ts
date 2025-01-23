import { type Page, type Locator, expect } from '@playwright/test';

export class ManageColonyTeams {
  static readonly validationMessages = {
    createTeam: {
      allRequiredFields: [
        'decisionMethod must be defined',
        'domainColor must be defined',
        'Team name required.',
        'Title is required',
      ],
    },
    common: {
      title: {
        maxLengthExceeded: 'Title must not exceed 60 characters',
      },
      purpose: {
        maxLengthExceeded: 'domainPurpose must be at most 120 characters',
      },
    },
  };

  drawer: Locator;

  form: Locator;

  sidebar: Locator;

  selectDropdown: Locator;

  decisionMethodDropdown: Locator;

  createTeamButton: Locator;

  editTeamButton: Locator;

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

  teamColorSelectButton: Locator;

  teamColorSelectMenu: Locator;

  teamColorBadge: Locator;

  constructor(private page: Page) {
    this.drawer = page.getByTestId('action-drawer');
    this.form = page.getByTestId('action-form');
    this.selectDropdown = page.getByTestId('search-select-menu');
    this.decisionMethodDropdown = page
      .getByRole('list')
      .filter({ hasText: /Available decision methods/i });
    this.sidebar = page.getByTestId('colony-page-sidebar');
    this.createTeamButton = this.form.getByRole('button', {
      name: 'Create team',
      exact: true,
    });
    this.editTeamButton = this.form.getByRole('button', {
      name: 'Edit team',
      exact: true,
    });
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
    this.teamColorSelectButton = this.page.getByTestId(
      'team-color-select-button',
    );
    this.teamColorSelectMenu = this.page.getByTestId('team-color-select-menu');
    this.teamColorBadge = this.page.getByTestId('team-color-badge');
  }

  async setTitle(title: string) {
    await this.form.getByPlaceholder('Enter title').fill(title);
  }

  async open(motionTitle: 'Create new team' | 'Edit a team') {
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

  async setColor(colorIndex: number): Promise<string> {
    await this.teamColorSelectButton.click();
    await this.teamColorSelectMenu.waitFor({ state: 'visible' });
    const selectedColor = await this.teamColorSelectMenu
      .getByRole('listitem')
      .nth(colorIndex)
      .getByRole('button')
      .locator('div div')
      .evaluate((el) => {
        return getComputedStyle(el).backgroundColor;
      });
    await this.teamColorSelectMenu
      .getByRole('listitem')
      .nth(colorIndex)
      .getByRole('button')
      .click();

    await this.teamColorSelectMenu.waitFor({ state: 'hidden' });
    return selectedColor;
  }

  async getTeamNameColor(teamName: string): Promise<string> {
    const teamNameElement = this.form
      .getByRole('button')
      .getByText(teamName, { exact: true });
    return teamNameElement.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
  }

  async getTeamColorBadgeColor(teamName: string) {
    const teamBadgeColor = await this.teamColorBadge.evaluate((el) => {
      return window.getComputedStyle(el.firstChild as Element).backgroundColor;
    });
    const teamNameTextColor = await this.teamColorBadge
      .getByText(teamName)
      .evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
    return { teamBadgeColor, teamNameTextColor };
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

  async fillForm({
    title,
    name,
    colorIndex,
    purpose,
    decisionMethod,
  }: {
    title?: string;
    name?: string;
    colorIndex?: number;
    purpose?: string;
    decisionMethod?: 'Permissions' | 'Reputation';
  }) {
    if (title) {
      await this.setTitle(title);
    }

    if (name) {
      await this.form.getByPlaceholder('Enter team name').fill(name);
    }

    if (purpose) {
      await this.form.getByPlaceholder('Enter short description').fill(purpose);
    }

    if (colorIndex !== undefined) {
      await this.setColor(colorIndex);
    }

    if (decisionMethod) {
      await this.setDecisionMethod(decisionMethod);
    }
  }

  async selectTeam(teamName: string) {
    await this.form
      .getByRole('button', { name: 'Select team', exact: true })
      .click();
    await this.selectDropdown.getByText(teamName).click();
  }

  async verifyTeamCreated({
    teamName,
    colonyName,
  }: {
    teamName: string;
    colonyName: string;
  }) {
    await this.page.goto(`/${colonyName}/teams`);
    await this.page.getByText('Loading').waitFor({ state: 'hidden' });
    await expect(
      this.page.getByRole('heading', { name: teamName, exact: true }),
    ).toBeVisible();
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
}
