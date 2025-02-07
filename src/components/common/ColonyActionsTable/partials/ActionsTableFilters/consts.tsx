import {
  Calendar,
  CubeFocus,
  FilePlus,
  FlagPennant,
  Scales,
} from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import ActionTypeFilters from './partials/filters/ActionTypeFilters/index.ts';
import ChainFilters from './partials/filters/ChainFilters/ChainFilters.tsx';
import DateFilters from './partials/filters/DateFilters/index.ts';
import DecisionMethodFilters from './partials/filters/DecisionMethodFilters/index.ts';
import StatusFilters from './partials/filters/StatusFilters/index.ts';

export const filterItems = [
  {
    icon: FilePlus,
    label: formatText({ id: 'activityFeedTable.filters.actionType' }),
    name: 'actionType',
    children: <ActionTypeFilters />,
  },
  {
    icon: FlagPennant,
    label: formatText({ id: 'activityFeedTable.filters.status' }),
    name: 'status',
    children: <StatusFilters />,
  },
  {
    icon: Calendar,
    label: formatText({ id: 'activityFeedTable.filters.date' }),
    name: 'date',
    children: <DateFilters />,
  },
  {
    icon: Scales,
    label: formatText({ id: 'activityFeedTable.filters.decisionMethod' }),
    name: 'decisionMethod',
    children: <DecisionMethodFilters />,
  },
  {
    icon: CubeFocus,
    label: formatText({ id: 'activityFeedTable.filters.chain' }),
    name: 'chain',
    children: <ChainFilters />,
  },
];
