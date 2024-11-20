/* eslint-disable no-warning-comments */
import { type Page } from '@playwright/test';

export const validationMessages = {
  title: {
    maxLengthExceeded: 'Title must not exceed 60 characters',
    isRequired: 'Title is required',
  },
  allRequiredFields: [
    'decisionMethod must be defined',
    // TODO: Uncomment once issue #38102 is fixed
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
