/* eslint-disable no-warning-comments */
import { type Page } from '@playwright/test';

import { selectWallet } from './common.ts';

export const validationMessages = {
  title: {
    maxLengthExceeded: 'Title must not exceed 60 characters',
    isRequired: 'Title is required',
  },
  allRequiredFields: [
    'decisionMethod must be defined',
    // TODO: Uncomment once issue #3802 is fixed
    // 'from is a required field',
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
};

export const tooltipMessages = {
  from: /Team source of the funds/i,
  recipient: /Member or address designated to receive the funds/i,
  amount: /Quantity and type of funds of the payment/i,
  decisionMethod: /Mechanism behind the decision-making process/i,
};

export const openSimplePaymentDrawer = async (page: Page) => {
  const actionDrawer = page.getByTestId('action-drawer');

  await page
    .getByTestId('colony-page-sidebar')
    .getByLabel('Start the payment group action')
    .click();
  await actionDrawer.waitFor({ state: 'visible' });
  await actionDrawer
    .getByRole('button', {
      name: 'Simple payment Quick, one-click transfers',
    })
    .click();
  await page.getByTestId('action-form').waitFor({ state: 'visible' });

  await actionDrawer
    .getByTestId('action-sidebar-description')
    .waitFor({ state: 'visible' });
};

export const closeSimplePaymentDrawer = async (page: Page) => {
  await page
    .getByRole('button', { name: /close the modal/i })
    // eslint-disable-next-line playwright/no-force-option
    .click({ force: true });

  const dialog = page
    .getByRole('dialog')
    .filter({ hasText: 'Do you wish to cancel the action creation?' });
  if (await dialog.isVisible()) {
    await dialog
      .getByRole('button', { name: 'Yes, cancel the action' })
      .click();
  }
};

export const signInAndNavigateToColony = async (
  page: Page,
  { colonyUrl, wallet }: { colonyUrl: string; wallet: string | RegExp },
) => {
  await page.goto(colonyUrl);
  await selectWallet(page, wallet);
  // Wait for the Dashboard to load
  await page.getByText('Loading Colony').waitFor({ state: 'hidden' });
  await page
    .getByTestId('loading-skeleton')
    .last()
    .waitFor({ state: 'hidden' });
};
