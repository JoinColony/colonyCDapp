import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CardSelectOption } from '../../Fields/CardSelect/types';
import { ACTION } from '~constants/actions';

export const DECISION_METHOD_OPTIONS: CardSelectOption<string>[] = [
  {
    label: <FormattedMessage id="actionSidebar.method.reputation" />,
    value: 'reputation',
  },
  {
    label: <FormattedMessage id="actionSidebar.method.multisig" />,
    value: 'multi-sig-permissions',
  },
  {
    label: <FormattedMessage id="actionSidebar.method.permissions" />,
    value: 'permissions',
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
