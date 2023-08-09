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

export type TeamType = number;

export type ContributorType =
  | 'top'
  | 'dedicated'
  | 'active'
  | 'verified'
  | 'general';

export type StatusType = 'banned' | 'notBanned';

export enum ReputationSortTypes {
  DESC = 'highestToLowest',
  ASC = 'lowestToHighest',
}

export type ReputationType = `${ReputationSortTypes}`;

export type PermissionsType =
  | 'root'
  | 'administration'
  | 'arbitration'
  | 'architecture'
  | 'funding'
  | 'recovery';

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
