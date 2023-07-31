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
    id: 'contributorVerified',
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

export const teamTypes: FilterOptionProps[] = [
  {
    id: 'Root',
    title: { id: 'filter.option.root' },
  },
  {
    id: 'Business',
    title: { id: 'filter.option.business' },
  },
  {
    id: 'Product',
    title: { id: 'filter.option.product' },
  },
  {
    id: 'Development',
    title: { id: 'filter.option.development' },
  },
  {
    id: 'Design',
    title: { id: 'filter.option.productDesign' },
  },
  {
    id: 'Devops',
    title: { id: 'filter.option.devops' },
  },
];

export const reputationType: FilterOptionProps[] = [
  {
    id: 'highestToLowest',
    title: { id: 'filter.option.highest.to.lowest' },
  },
  {
    id: 'lowestToHighest',
    title: { id: 'filter.option.lowest.to.highest' },
  },
];

export const permissionsTypes: FilterOptionProps[] = [
  {
    id: 'permissionRoot',
    title: { id: 'filter.option.root' },
  },
  {
    id: 'administration',
    title: { id: 'filter.option.administration' },
  },
  {
    id: 'arbitration',
    title: { id: 'filter.option.arbitration' },
  },
  {
    id: 'architecture',
    title: { id: 'filter.option.architecture' },
  },
  {
    id: 'funding',
    title: { id: 'filter.option.funding' },
  },
  {
    id: 'recovery',
    title: { id: 'filter.option.recovery' },
  },
];
