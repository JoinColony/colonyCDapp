import { type BrowserContext, expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { ManageColonyTeams } from '../models/manage-colony-teams.ts';
import {
  generateRandomString,
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe.configure({ mode: 'serial' });
test.describe('Manage Colony Teams', () => {
  let page: Page;
  let context: BrowserContext;
  let manageColonyTeams: ManageColonyTeams;
  let extensions: Extensions;

  test.beforeAll(async ({ browser, baseURL }) => {
    context = await browser.newContext();
    page = await context.newPage();
    manageColonyTeams = new ManageColonyTeams(page);
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
  test('Create new team | Permissions decision method', async () => {
    const teamName = `Test team ${generateRandomString()}`;
    await manageColonyTeams.open('Create new team');
    await manageColonyTeams.fillForm({
      title: 'Test team',
      purpose: 'This is a test purpose',
      name: teamName,
      decisionMethod: 'Permissions',
    });
    const colorIndex = Math.floor(Math.random() * 16);
    const selectedColor = await manageColonyTeams.setColor(colorIndex);
    const teamNameColor = await manageColonyTeams.getTeamNameColor(teamName);

    expect(selectedColor).toBe(teamNameColor);
    await manageColonyTeams.createTeamButton.click();

    await manageColonyTeams.waitForTransaction();

    await expect(
      manageColonyTeams.completedAction.getByText(
        'Member used permissions to create this action',
      ),
    ).toBeVisible();

    await expect(
      manageColonyTeams.completedAction.getByText(teamName, { exact: true }),
    ).toHaveCount(2);

    await expect(
      manageColonyTeams.completedAction.getByText('Permissions', {
        exact: true,
      }),
    ).toBeVisible();

    const { teamBadgeColor, teamNameTextColor } =
      await manageColonyTeams.getTeamColorBadgeColor(teamName);

    expect(teamBadgeColor).toBe(selectedColor);
    expect(teamNameTextColor).toBe(teamNameColor);

    await manageColonyTeams.verifyTeamCreated({
      teamName,
      colonyName: 'planex',
    });
  });

  test('Create new team | Reputation decision method', async () => {
    const teamName = `Test team ${generateRandomString()}`;
    await manageColonyTeams.open('Create new team');
    const colorIndex = Math.floor(Math.random() * 16);
    await manageColonyTeams.fillForm({
      title: 'Test team',
      purpose: 'This is a test purpose',
      name: teamName,
      colorIndex,
      decisionMethod: 'Reputation',
    });

    await manageColonyTeams.createTeamButton.click();

    await manageColonyTeams.waitForTransaction();

    await expect(manageColonyTeams.stepper).toBeVisible();
    await expect(manageColonyTeams.completedAction).toBeVisible();
    await expect(
      manageColonyTeams.completedAction.getByText(
        `Create new team ${teamName} by leela`,
      ),
    ).toBeVisible();
    await expect(
      manageColonyTeams.stepper.getByText(/Total stake required: \d+/),
    ).toBeVisible();

    await manageColonyTeams.support();

    await expect(manageColonyTeams.stepper).toHaveText(/100% Supported/);

    await manageColonyTeams.oppose();

    await expect(manageColonyTeams.stepper).toHaveText(/100% Opposed/);

    await manageColonyTeams.stepper
      .getByText(/Vote to support or oppose?/)
      .waitFor();
    await manageColonyTeams.supportButton.click();
    await manageColonyTeams.submitVoteButton.click();
    await expect(
      manageColonyTeams.stepper.getByText(/You voted:Support/),
    ).toBeVisible();

    await expect(
      manageColonyTeams.stepper.getByText(/^0 votes revealed$/),
    ).toBeVisible();

    await manageColonyTeams.revealVoteButton.click();

    await manageColonyTeams.stepper
      .getByRole('button', {
        name: 'Support wins',
      })
      .waitFor();

    await expect(
      manageColonyTeams.stepper.getByText(
        'Finalize to execute the agreed transaction',
      ),
    ).toBeVisible();
    await manageColonyTeams.finalizeButton.click();

    await manageColonyTeams.waitForPending();
    await manageColonyTeams.claimButton.click();
    await manageColonyTeams.waitForPending();

    await manageColonyTeams.stepper
      .getByRole('heading', {
        name: 'Your overview Claimed',
      })
      .waitFor();
  });

  test('Form validation', async () => {
    await manageColonyTeams.open('Create new team');
    await manageColonyTeams.createTeamButton.click();

    // Verify all required field validation messages
    for (const message of ManageColonyTeams.validationMessages.createTeam
      .allRequiredFields) {
      await expect(manageColonyTeams.drawer.getByText(message)).toBeVisible();
    }

    // Test title max length validation
    await manageColonyTeams.fillForm({
      title:
        'This is a test title that exceeds the maximum character limit of sixty characters long.',
    });

    await manageColonyTeams.createTeamButton.click();

    await expect(
      manageColonyTeams.drawer.getByText(
        ManageColonyTeams.validationMessages.common.title.maxLengthExceeded,
      ),
    ).toBeVisible();

    // Verify long teamName value is truncated
    await manageColonyTeams.fillForm({
      name: 'This is a test title that exceeds the maximum character limit of 20 characters long.',
    });
    await expect(
      manageColonyTeams.form.getByPlaceholder('Enter team name'),
    ).toHaveValue('This is a test title');

    await manageColonyTeams.fillForm({
      purpose: 's'.repeat(121),
    });
    await expect(
      manageColonyTeams.drawer.getByText(
        ManageColonyTeams.validationMessages.common.purpose.maxLengthExceeded,
      ),
    ).toBeVisible();

    await manageColonyTeams.close();
  });

  test('Edit team | Permissions decision method', async () => {
    // Create a team to edit
    const initialTeamName = `Test team ${generateRandomString()}`;
    await manageColonyTeams.open('Create new team');
    await manageColonyTeams.fillForm({
      title: 'Create test team',
      purpose: 'Initial purpose',
      name: initialTeamName,
      decisionMethod: 'Permissions',
    });
    const initialColorIndex = 2;
    const initialColor = await manageColonyTeams.setColor(initialColorIndex);
    await manageColonyTeams.createTeamButton.click();
    await manageColonyTeams.waitForTransaction();
    // Edit team
    await manageColonyTeams.open('Edit a team');

    await manageColonyTeams.selectTeam(initialTeamName);

    // Update team details
    const updatedTeamName = `Updated team ${generateRandomString()}`;
    const updatedPurpose = 'Updated team purpose';
    await manageColonyTeams.fillForm({
      title: 'Edit team details',
      name: updatedTeamName,
      purpose: updatedPurpose,
      decisionMethod: 'Permissions',
    });

    const newColorIndex = 3;
    const updatedColor = await manageColonyTeams.setColor(newColorIndex);

    await manageColonyTeams.editTeamButton.click();
    await manageColonyTeams.waitForTransaction();

    // Verify the completed action
    await expect(
      manageColonyTeams.completedAction.getByText(
        'Member used permissions to create this action',
      ),
    ).toBeVisible();

    await expect(
      manageColonyTeams.completedAction.getByText(updatedTeamName, {
        exact: true,
      }),
    ).toHaveCount(2);

    // Verify color changes
    const { teamBadgeColor } =
      await manageColonyTeams.getTeamColorBadgeColor(updatedTeamName);

    expect(teamBadgeColor).toBe(updatedColor);
    expect(teamBadgeColor).not.toBe(initialColor);

    // Verify the purpose was updated
    await expect(
      manageColonyTeams.completedAction.getByText(updatedPurpose, {
        exact: true,
      }),
    ).toBeVisible();
  });
});
