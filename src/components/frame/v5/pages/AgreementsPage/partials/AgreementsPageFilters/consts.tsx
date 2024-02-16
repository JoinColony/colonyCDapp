import { Calendar, FlagPennant } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import DateFilters from './partials/DateFilters/DateFilters.tsx';
import StatusFilters from './partials/StatusFilters/index.ts';

export const filterItems = [
  {
    icon: FlagPennant,
    label: formatText({ id: 'agreementsPage.filter.status' }),
    name: 'status',
    children: <StatusFilters />,
  },
  {
    icon: Calendar,
    label: formatText({ id: 'agreementsPage.filter.date' }),
    name: 'date',
    children: <DateFilters />,
  },
];
