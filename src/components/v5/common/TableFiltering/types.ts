import { ColonyRole } from '@colony/colony-js';

export type TableFilteringProps = {
  onClick?: (e: React.SyntheticEvent) => void;
  className?: string;
};

export enum FilterTypes {
  Team = 'team',
  Reputation = 'reputation',
  Latest = 'latest',
  Status = 'status',
  Contributor = 'contributor',
  Permissions = 'permissions',
}

export type FilterType = `${FilterTypes}`;

export type TeamType = `${number}_domain`;

export enum ContributorTypeFilter {
  Top = 'top',
  Dedicated = 'dedicated',
  Active = 'active',
  General = 'general',
  New = 'new',
}

export type ContributorType = `${ContributorTypeFilter}`;

export enum StatusFilter {
  Verified = 'statusVerified',
  NotVerified = 'statusNotVerified',
}

export type StatusType = `${StatusFilter}`;

export enum ReputationSort {
  DESC = 'highestToLowest',
  ASC = 'lowestToHighest',
}

export type ReputationType = `${ReputationSort}`;

export enum Permissions {
  Mod = 'mod',
  Payer = 'payer',
  Admin = 'admin',
  Owner = 'owner',
  Custom = 'custom',
  Root = 'rootPermissions',
  Administration = 'administration',
  Arbitration = 'arbitration',
  Architecture = 'architecture',
  Funding = 'funding',
  Recovery = 'recovery',
}

export const PermissionToNetworkIdMap = {
  [Permissions.Root]: ColonyRole.Root,
  [Permissions.Administration]: ColonyRole.Administration,
  [Permissions.Architecture]: ColonyRole.Architecture,
  [Permissions.Funding]: ColonyRole.Funding,
  [Permissions.Recovery]: ColonyRole.Recovery,
  [Permissions.Arbitration]: ColonyRole.Arbitration,
};

export type PermissionsType = `${Permissions}`;

// @TODO: add more filter options and move it to global types
export type FilterOption =
  | ContributorType
  | StatusType
  | ReputationType
  | PermissionsType
  | 'business'
  | 'development'
  | 'high to low'
  | 'newest'
  | 'banned'
  | 'general'
  | 'verified'
  | 'top'
  | 'dedicated'
  | 'administration';
