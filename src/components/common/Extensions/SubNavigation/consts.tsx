import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { SubNavigationItemProps } from './SubNavigationItem/types';
import PayDropdown from './Partials/DropdownContent/PayDropdown';
import DecideDropdown from './Partials/DropdownContent/DecideDropdown';
import ManageDropdown from './Partials/DropdownContent/ManageDropdown';

export const displayName = 'common.Extensions.SubNavigation';

export const MSG = defineMessages({
  pay: {
    id: `${displayName}.pay`,
    defaultMessage: 'Pay',
  },
  decide: {
    id: `${displayName}.decide`,
    defaultMessage: 'Decide',
  },
  manage: {
    id: `${displayName}.manage`,
    defaultMessage: 'Manage',
  },
});

export const subNavigationItems: Omit<SubNavigationItemProps, 'isOpen' | 'setOpen'>[] = [
  {
    id: 0,
    label: <FormattedMessage {...MSG.pay} />,
    content: <PayDropdown />,
    icon: 'hand-coins',
  },
  {
    id: 1,
    label: <FormattedMessage {...MSG.decide} />,
    content: <DecideDropdown />,
    icon: 'hands-clapping',
  },
  {
    id: 2,
    label: <FormattedMessage {...MSG.manage} />,
    content: <ManageDropdown />,
    icon: 'folders',
  },
];
