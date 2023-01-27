import { defineMessages, MessageDescriptor } from 'react-intl';

import { Appearance, SelectOption } from './types';

const displayName = 'common.ColonyMembers.MembersFilter';

const MSG = defineMessages({
  allMembers: {
    id: `${displayName}.allMembers`,
    defaultMessage: 'All members',
  },
  any: {
    id: `${displayName}.allMembers`,
    defaultMessage: 'Any',
  },
  contributors: {
    id: `${displayName}.contributors`,
    defaultMessage: 'Contributors',
  },
  watchers: {
    id: `${displayName}.watchers`,
    defaultMessage: 'Watchers',
  },
  verified: {
    id: `${displayName}.verified`,
    defaultMessage: 'Verified',
  },
  unverified: {
    id: `${displayName}.unverified`,
    defaultMessage: 'Unverified',
  },
  banned: {
    id: `${displayName}.banned`,
    defaultMessage: 'Banned',
  },
  notBanned: {
    id: `${displayName}.notBanned`,
    defaultMessage: 'Not banned',
  },
  memberType: {
    id: `${displayName}.memberType`,
    defaultMessage: 'Member type',
  },
  bannedStatus: {
    id: `${displayName}.bannedStatus`,
    defaultMessage: 'Banned status',
  },
  verificationType: {
    id: `${displayName}.verificationType`,
    defaultMessage: 'Verification type',
  },
});

export enum MemberType {
  All = 'all',
  Contributers = 'contributors',
  Watchers = 'watchers',
}

export enum VerificationType {
  All = 'all',
  Verified = 'verified',
  Unverified = 'unverified',
}

export enum BannedStatus {
  All = 'all',
  Banned = 'banned',
  NotBanned = 'notBanned',
}

const memberTypes = [
  { label: MSG.allMembers, value: MemberType.All },
  { label: MSG.contributors, value: MemberType.Contributers },
  { label: MSG.watchers, value: MemberType.Watchers },
];

const verificationTypes = [
  { label: MSG.any, value: VerificationType.All },
  { label: MSG.verified, value: VerificationType.Verified },
  { label: MSG.unverified, value: VerificationType.Unverified },
];

const bannedStatuses = [
  { label: MSG.any, value: BannedStatus.All },
  { label: MSG.banned, value: BannedStatus.Banned },
  { label: MSG.notBanned, value: BannedStatus.NotBanned },
];

export type filterItem = {
  appearance?: Appearance;
  name: string;
  options?: SelectOption[];
  label: string | MessageDescriptor;
  isRootRequired: boolean;
};

export const filterItems: filterItem[] = [
  {
    appearance: { theme: 'grey' },
    name: 'memberType',
    options: memberTypes,
    label: MSG.memberType,
    isRootRequired: true,
  },
  {
    appearance: { theme: 'grey' },
    name: 'verificationType',
    options: verificationTypes,
    label: MSG.verificationType,
    isRootRequired: false,
  },
  {
    appearance: { theme: 'grey' },
    name: 'bannedStatus',
    options: bannedStatuses,
    label: MSG.bannedStatus,
    isRootRequired: false,
  },
];
