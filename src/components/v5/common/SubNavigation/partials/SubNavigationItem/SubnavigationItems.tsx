import { Folders, HandCoins, HandsClapping } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import DecideDropdown from '../DropdownContent/DecideDropdown.tsx';
import ManageDropdown from '../DropdownContent/ManageDropdown.tsx';
import PayDropdown from '../DropdownContent/PayDropdown.tsx';

import { type SubNavigationItemProps } from './types.ts';

const displayName = 'v5.common.SubNavigation.subNavigationItems';

const MSG = defineMessages({
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

const SubNavigationItems: Omit<SubNavigationItemProps, 'isOpen' | 'setOpen'>[] =
  [
    {
      id: 0,
      label: <FormattedMessage {...MSG.pay} />,
      content: <PayDropdown />,
      icon: HandCoins,
    },
    {
      id: 1,
      label: <FormattedMessage {...MSG.decide} />,
      content: <DecideDropdown />,
      icon: HandsClapping,
    },
    {
      id: 2,
      label: <FormattedMessage {...MSG.manage} />,
      content: <ManageDropdown />,
      icon: Folders,
    },
  ];

export default SubNavigationItems;
