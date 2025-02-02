/* eslint-disable playwright/expect-expect */
import { expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { ManageColonyTeams } from '../models/manage-colony-teams.ts';
import {
  generateRandomString,
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe('Manage Colony Teams', () => {
  async function setupTest(page: Page) {
    const manageColonyTeams = new ManageColonyTeams(page);
    const extensions = new Extensions(page);

    await setCookieConsent(page.context(), test.info().project.use.baseURL);
    await signInAndNavigateToColony(page, {
      colonyUrl: '/planex',
      wallet: /dev wallet 1$/i,
    });
    await extensions.enableReputationWeightedExtension({
      colonyPath: '/planex',
    });

    return {
      manageColonyTeams,
      extensions,
    };
  }

  test('Create new team | Permissions decision method', async ({ page }) => {
    const { manageColonyTeams } = await setupTest(page);

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

  test('Create new team | Reputation decision method', async ({ page }) => {
    const { manageColonyTeams } = await setupTest(page);

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

    await expect(
      manageColonyTeams.completedAction.getByText(
        `Create new team ${teamName} by leela`,
      ),
    ).toBeVisible();
    await manageColonyTeams.completeReputationFlow();
  });

  test('Form validation', async ({ page }) => {
    const { manageColonyTeams } = await setupTest(page);

    await manageColonyTeams.open('Create new team');
    await manageColonyTeams.createTeamButton.click();

    for (const message of ManageColonyTeams.validationMessages.createTeam
      .allRequiredFields) {
      await expect(manageColonyTeams.drawer.getByText(message)).toBeVisible();
    }

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

  test('Edit team | Permissions decision method', async ({ page }) => {
    const { manageColonyTeams } = await setupTest(page);

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

    const { teamBadgeColor } =
      await manageColonyTeams.getTeamColorBadgeColor(updatedTeamName);

    expect(teamBadgeColor).toBe(updatedColor);
    expect(teamBadgeColor).not.toBe(initialColor);

    await expect(
      manageColonyTeams.completedAction.getByText(updatedPurpose, {
        exact: true,
      }),
    ).toBeVisible();
  });
});
