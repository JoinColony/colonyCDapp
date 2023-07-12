import { FilterOptionProps } from '../types';

export const contributorTypes: FilterOptionProps[] = [
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
    id: 'verified',
    title: { id: 'filter.option.verified' },
  },
  {
    id: 'general',
    title: { id: 'filter.option.general' },
  },
];

export const statusTypes: FilterOptionProps[] = [
  {
    id: 'banned',
    title: { id: 'filter.option.banned' },
  },
  {
    id: 'notBanned',
    title: { id: 'filter.option.notBanned' },
  },
];
