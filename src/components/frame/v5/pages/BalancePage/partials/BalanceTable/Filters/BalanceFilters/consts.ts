import {
  CoinVertical,
  CubeFocus,
  FolderSimpleLock,
} from '@phosphor-icons/react';

import { formatText } from '~utils/intl.ts';

import { BalancePageFilter } from '../partials/filters/index.ts';

export const filterItems = [
  {
    icon: CoinVertical,
    label: formatText({ id: 'balancePage.filter.tokenType' }),
    name: 'token',
    FiltersContent: BalancePageFilter.Token,
  },
  {
    icon: FolderSimpleLock,
    label: formatText({ id: 'balancePage.filter.attributes' }),
    name: 'attribute',
    FiltersContent: BalancePageFilter.Attribute,
  },
  {
    icon: CubeFocus,
    label: formatText({ id: 'balancePage.filter.chain' }),
    name: 'chain',
    FiltersContent: BalancePageFilter.Chain,
  },
];
