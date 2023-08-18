import React from 'react';
import {
  PermissionsFilter,
  ReputationSort,
} from '~v5/common/TableFiltering/types';
import { FilterOptionProps } from '../types';
import Icon from '~shared/Icon/Icon';

export const contributorFilters: FilterOptionProps[] = [
  {
    id: 'top',
    title: { id: 'filter.option.top' },
  },
  {
    id: 'dedicated',
    title: { id: 'filter.option.dedicated' },
  },
  {
    id: 'active',
    title: { id: 'filter.option.active' },
  },
  {
    id: 'new',
    title: { id: 'filter.option.new' },
  },
  {
    id: 'general',
    title: { id: 'filter.option.general' },
  },
];

export const statusFilters: FilterOptionProps[] = [
  {
    id: 'statusVerified',
    title: { id: 'filter.option.statusVerified' },
  },
  {
    id: 'statusNotVerified',
    title: { id: 'filter.option.statusNotVerified' },
  },
];

export const reputationFilters: FilterOptionProps[] = [
  {
    id: ReputationSort.DESC,
    title: { id: 'filter.option.highestToLowest' },
  },
  {
    id: ReputationSort.ASC,
    title: { id: 'filter.option.lowestToHighest' },
  },
];

export const permissionsFilters: FilterOptionProps[] = [
  {
    id: PermissionsFilter.Root,
    title: { id: 'filter.option.rootPermissions' },
    icon: <Icon name="app-window" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: PermissionsFilter.Administration,
    title: { id: 'filter.option.administration' },
    icon: <Icon name="clipboard-text" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: PermissionsFilter.Arbitration,
    title: { id: 'filter.option.arbitration' },
    icon: <Icon name="scales" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: PermissionsFilter.Architecture,
    title: { id: 'filter.option.architecture' },
    icon: <Icon name="buildings" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: PermissionsFilter.Funding,
    title: { id: 'filter.option.funding' },
    icon: <Icon name="bank" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: PermissionsFilter.Recovery,
    title: { id: 'filter.option.recovery' },
    icon: (
      <Icon
        name="clock-counter-clockwise"
        appearance={{ size: 'extraSmall' }}
      />
    ),
  },
];
