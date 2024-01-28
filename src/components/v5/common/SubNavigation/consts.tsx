import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import DecideDropdown from './partials/DropdownContent/DecideDropdown.tsx';
import ManageDropdown from './partials/DropdownContent/ManageDropdown.tsx';
import PayDropdown from './partials/DropdownContent/PayDropdown.tsx';
import { type SubNavigationItemProps } from './partials/SubNavigationItem/types.ts';

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
