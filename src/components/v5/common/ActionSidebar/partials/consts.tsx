import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CardSelectOption } from '../../Fields/CardSelect/types';

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
