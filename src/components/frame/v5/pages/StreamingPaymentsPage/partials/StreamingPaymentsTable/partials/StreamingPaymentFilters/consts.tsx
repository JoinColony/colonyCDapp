import {
  Calendar,
  CalendarBlank,
  ClockCountdown,
  CoinVertical,
  Vignette,
} from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import DateFilters from './partials/DateFilters/DateFilters.tsx';
import EndConditionFilters from './partials/EndConditionFilters/EndConditionFilters.tsx';
import StatusFilters from './partials/StatusFilters/StatusFilters.tsx';
import TokenFilters from './partials/TokenFilters/TokenFilters.tsx';
import TotalStreamedFilters from './partials/TotalStreamedFilters/TotalStreamedFilters.tsx';

export const filterItems = [
  {
    icon: ClockCountdown,
    label: formatText({ id: 'streamingPayment.table.filter.status' }),
    name: 'status',
    children: <StatusFilters />,
  },
  {
    icon: CalendarBlank,
    label: formatText({ id: 'streamingPayment.table.filter.endCondition' }),
    name: 'endCondition',
    children: <EndConditionFilters />,
  },
  {
    icon: CoinVertical,
    label: formatText({ id: 'streamingPayment.table.filter.tokenType' }),
    name: 'endCondition',
    children: <TokenFilters />,
  },
  {
    icon: Calendar,
    label: formatText({ id: 'streamingPayment.table.filter.date' }),
    name: 'date',
    children: <DateFilters />,
  },
];

export const sortItems = [
  {
    icon: Vignette,
    label: formatText({ id: 'streamingPayment.table.filter.totalStreamed' }),
    name: 'totalStreamed',
    children: <TotalStreamedFilters />,
  },
];
