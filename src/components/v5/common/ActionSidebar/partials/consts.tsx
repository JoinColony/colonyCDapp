import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CardSelectOption } from '../../Fields/CardSelect/types';
import { ACTION } from '~constants/actions';

export const DISTRIBUTION_METHOD = {
  Equal: 'equal',
  Unequal: 'unequal',
  ReputationPercentage: 'reputation-percentage',
} as const;

export type DistributionMethod =
  (typeof DISTRIBUTION_METHOD)[keyof typeof DISTRIBUTION_METHOD];

export const DISTRIBUTION_METHOD_OPTIONS: CardSelectOption<string>[] = [
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.equal" />,
    value: DISTRIBUTION_METHOD.Equal,
  },
  {
    label: <FormattedMessage id="actionSidebar.distributionTypes.unequal" />,
    value: DISTRIBUTION_METHOD.Unequal,
  },
  {
    label: (
      <FormattedMessage id="actionSidebar.distributionTypes.reputationPercentage" />
    ),
    value: DISTRIBUTION_METHOD.ReputationPercentage,
  },
];

export const POPULAR_ACTIONS = [
  {
    action: ACTION.SIMPLE_PAYMENT,
    text: { id: 'actionSidebar.simplePayment' },
    iconName: 'money',
  },
  {
    action: ACTION.USER_PERMISSIONS,
    text: { id: 'actionSidebar.userPermission' },
    iconName: 'wrench',
  },
  {
    action: ACTION.TRANSFER_FUNDS,
    text: { id: 'actionSidebar.transferFunds' },
    iconName: 'user-switch',
  },
  {
    action: ACTION.ADVANCED_PAYMENT,
    text: { id: 'actionSidebar.advancedPayments' },
    iconName: 'coins',
  },
];
