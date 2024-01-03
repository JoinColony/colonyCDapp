import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import DecideDropdown from './partials/DropdownContent/DecideDropdown';
import ManageDropdown from './partials/DropdownContent/ManageDropdown';
import PayDropdown from './partials/DropdownContent/PayDropdown';
import { SubNavigationItemProps } from './partials/SubNavigationItem/types';

export const displayName = 'v5.common.SubNavigation';

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

export const subNavigationItems: Omit<
  SubNavigationItemProps,
  'isOpen' | 'setOpen'
>[] = [
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
