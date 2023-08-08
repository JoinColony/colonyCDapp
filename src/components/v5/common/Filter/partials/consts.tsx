import React from 'react';
import {
  FilterTypes,
  ReputationSortTypes,
} from '~v5/common/TableFiltering/types';
import { FilterOptionProps } from '../types';
import Icon from '~shared/Icon/Icon';

export const contributorTypes: FilterOptionProps[] = [
  {
    id: `${FilterTypes.Contributor}.top`,
    title: { id: 'filter.option.top' },
  },
  {
    id: `${FilterTypes.Contributor}.dedicated`,
    title: { id: 'filter.option.dedicated' },
  },
  {
    id: `${FilterTypes.Contributor}.active`,
    title: { id: 'filter.option.active' },
  },
  {
    id: `${FilterTypes.Contributor}.verified`,
    title: { id: 'filter.option.verified' },
  },
  {
    id: `${FilterTypes.Contributor}.general`,
    title: { id: 'filter.option.general' },
  },
];

export const statusTypes: FilterOptionProps[] = [
  {
    id: `${FilterTypes.Status}.banned`,
    title: { id: 'filter.option.banned' },
  },
  {
    id: `${FilterTypes.Status}.notBanned`,
    title: { id: 'filter.option.notBanned' },
  },
];

export const reputationType: FilterOptionProps[] = [
  {
    id: `${FilterTypes.Reputation}.${ReputationSortTypes.DESC}`,
    title: { id: 'filter.option.highestToLowest' },
  },
  {
    id: `${FilterTypes.Reputation}.${ReputationSortTypes.ASC}`,
    title: { id: 'filter.option.lowestToHighest' },
  },
];

export const permissionsTypes: FilterOptionProps[] = [
  {
    id: `${FilterTypes.Permissions}.root`,
    title: { id: 'filter.option.root' },
    icon: <Icon name="app-window" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: `${FilterTypes.Permissions}.administration`,
    title: { id: 'filter.option.administration' },
    icon: <Icon name="clipboard-text" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: `${FilterTypes.Permissions}.arbitration`,
    title: { id: 'filter.option.arbitration' },
    icon: <Icon name="scales" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: `${FilterTypes.Permissions}.architecture`,
    title: { id: 'filter.option.architecture' },
    icon: <Icon name="buildings" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: `${FilterTypes.Permissions}.funding`,
    title: { id: 'filter.option.funding' },
    icon: <Icon name="bank" appearance={{ size: 'extraSmall' }} />,
  },
  {
    id: `${FilterTypes.Permissions}.recovery`,
    title: { id: 'filter.option.recovery' },
    icon: (
      <Icon
        name="clock-counter-clockwise"
        appearance={{ size: 'extraSmall' }}
      />
    ),
  },
];
