import { CoinVertical, FolderSimpleLock } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import AttributeFilters from '../partials/filters/AttributeFilters/index.ts';
import TokenFilters from '../partials/filters/TokenFilters/index.ts';

export const filterItems = [
  {
    icon: CoinVertical,
    label: formatText({ id: 'balancePage.filter.tokenType' }),
    name: 'actionType',
    children: <TokenFilters />,
  },
  {
    icon: FolderSimpleLock,
    label: formatText({ id: 'balancePage.filter.attributes' }),
    name: 'status',
    children: <AttributeFilters />,
  },
];
