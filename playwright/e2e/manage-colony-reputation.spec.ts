/* eslint-disable no-warning-comments */
import { expect, type Page, test } from '@playwright/test';

import { Extensions } from '../models/extensions.ts';
import { ManageReputation } from '../models/manage-colony-reputation.ts';
import {
  setCookieConsent,
  signInAndNavigateToColony,
} from '../utils/common.ts';

test.describe('Manage Colony Reputation', () => {
  async function setupTest(page: Page) {
    const manageReputation = new ManageReputation(page);
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
      manageReputation,
      extensions,
    };
  }

  test('Permissions decision method', async ({ page }) => {
    const { manageReputation } = await setupTest(page);

    const points = '20';
    const member = '0xb77D57F4959eAfA0339424b83FcFaf9c15407461';
    const memberName = 'leela';
    const title = 'Award reputation to leela';
    await manageReputation.open('Manage reputation');

    await manageReputation.fillManageReputationForm({
      title,
      modification: 'Award reputation',
      member,
      amount: points,
      decisionMethod: 'Permissions',
    });

    const percetage =
      await manageReputation.verifyReputationValuesInTable(points);

    await manageReputation.updateReputationButton.click();
    await manageReputation.waitForTransaction();

    await expect(
      manageReputation.completedAction.getByText(
        `Add ${points} reputation points to ${memberName} by leela`,
      ),
    ).toBeVisible();
    await expect(
      manageReputation.completedAction.getByText(
        'Member used permissions to create this action',
      ),
    ).toBeVisible();
    await expect(
      manageReputation.completedAction.getByText('Manage reputation'),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByText(title, { exact: true }),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByText('Award reputation', {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByRole('button', {
        name: `Avatar of user ${memberName}`,
      }),
    ).toHaveCount(2);

    await expect(
      manageReputation.completedAction.getByRole('table').getByText('Awarded'),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction
        .getByRole('table')
        .getByText(`${points} ${percetage}`),
    ).toBeVisible();
  });

  test('Reputation decision method', async ({ page }) => {
    const { manageReputation } = await setupTest(page);

    const points = '100';
    const member = '0x27fF0C145E191C22C75cD123C679C3e1F58a4469';
    const memberName = 'fry';
    const title = 'Award reputation to fry';

    await manageReputation.open('Manage reputation');

    await manageReputation.fillManageReputationForm({
      title,
      modification: 'Award reputation',
      member,
      amount: points,
      decisionMethod: 'Reputation',
    });

    const percetage =
      await manageReputation.verifyReputationValuesInTable(points);

    await manageReputation.updateReputationButton.click();
    await manageReputation.waitForTransaction();

    await expect(
      manageReputation.completedAction.getByText(
        `Add ${points} reputation points to ${memberName} by leela`,
      ),
    ).toBeVisible();

    await manageReputation.completeReputationFlow();

    await expect(
      manageReputation.completedAction.getByText('Manage reputation'),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByText(title, { exact: true }),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByText('Award reputation', {
        exact: true,
      }),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByRole('button', {
        name: 'Avatar of user fry',
      }),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction.getByRole('table').getByText('Awarded'),
    ).toBeVisible();

    await expect(
      manageReputation.completedAction
        .getByRole('table')
        .getByText(`${points} ${percetage}`),
    ).toBeVisible();
  });

  test('Form validation', async ({ page }) => {
    const { manageReputation } = await setupTest(page);

    await manageReputation.open('Manage reputation');
    await manageReputation.updateReputationButton.click();

    for (const message of ManageReputation.validationMessages
      .allRequiredFields) {
      await expect(manageReputation.drawer.getByText(message)).toBeVisible();
    }

    await manageReputation.fillManageReputationForm({
      title:
        'This is a test title that exceeds the maximum character limit of sixty characters long.',
    });

    await manageReputation.updateReputationButton.click();

    await expect(
      manageReputation.drawer.getByText(
        ManageReputation.validationMessages.title.maxLengthExceeded,
      ),
    ).toBeVisible();

    await manageReputation.fillManageReputationForm({
      title: 'Award reputation',
      modification: 'Award reputation',
      member: '0x27fF0C145E191C22C75cD123C679C3e1F58a4469',
      decisionMethod: 'Reputation',
      amount: '-100',
    });

    await expect(
      manageReputation.drawer.getByText(
        ManageReputation.validationMessages.amount.mustBeGreaterThanZero,
      ),
    ).toBeVisible();

    await manageReputation.fillManageReputationForm({
      amount: '0',
    });

    await expect(
      manageReputation.drawer.getByText(
        ManageReputation.validationMessages.amount.mustBeGreaterThanZero,
      ),
    ).toBeVisible();

    await manageReputation.fillManageReputationForm({
      amount: '1'.padEnd(80, '0'), // 1 followed by 79 zeros
    });

    await expect(manageReputation.drawer.getByText('×1078')).toHaveCount(2);

    // TODO: Uncomment this test when the issue is fixed
    // Test very small number
    // await manageReputation.fillManageReputationForm({
    //   amount: '0.0000000000000000001', // 18 decimal places
    // });
    // await expect(manageReputation.drawer.getByText('×10-18')).toHaveCount(2);

    // Test invalid member address validation
    // TODO: Uncomment this test when the validation is fixed
    // await manageReputation.fillManageReputationForm({
    //   member: '0x1234567890',
    // });
    // await expect(
    //   manageReputation.drawer.getByText(
    //     ManageReputation.validationMessages.member.invalid,
    //   ),
    // ).toBeVisible();

    await manageReputation.close();
  });
});
