import { Permissions, ReputationSort } from '~v5/common/TableFiltering/types';

import { FilterOptionProps } from '../types';

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
    id: Permissions.Mod,
    title: { id: 'filter.option.mod' },
  },
  {
    id: Permissions.Payer,
    title: { id: 'filter.option.payer' },
  },
  {
    id: Permissions.Admin,
    title: { id: 'filter.option.admin' },
  },
  {
    id: Permissions.Owner,
    title: { id: 'filter.option.owner' },
  },
  {
    id: Permissions.Custom,
    title: { id: 'filter.option.custom' },
    nestedOptions: [
      {
        id: Permissions.Root,
        title: { id: 'filter.option.rootPermissions' },
      },
      {
        id: Permissions.Administration,
        title: { id: 'filter.option.administration' },
      },
      {
        id: Permissions.Arbitration,
        title: { id: 'filter.option.arbitration' },
      },
      {
        id: Permissions.Architecture,
        title: { id: 'filter.option.architecture' },
      },
      {
        id: Permissions.Funding,
        title: { id: 'filter.option.funding' },
      },
      {
        id: Permissions.Recovery,
        title: { id: 'filter.option.recovery' },
      },
    ],
  },
];
