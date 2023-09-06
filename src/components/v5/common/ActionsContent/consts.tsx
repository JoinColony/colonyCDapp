import React from 'react';
import { FormattedMessage } from 'react-intl';

export const DECISION_METHOD_OPTIONS = [
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
