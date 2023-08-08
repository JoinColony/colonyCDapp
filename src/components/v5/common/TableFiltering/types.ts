export type TableFilteringProps = {
  selectedParentFilters?: FilterType | FilterType[];
  filterOptions: FilterOption | FilterOption[];
  onClick: () => void;
  className?: string;
};

export type FilterType =
  | 'team'
  | 'reputation'
  | 'latest'
  | 'status'
  | 'contributor'
  | 'permissions';

export type ContributorType =
  | 'top'
  | 'dedicated'
  | 'active'
  | 'contributorVerified'
  | 'general';

export type TeamType =
  | 'Root'
  | 'Business'
  | 'Product'
  | 'Development'
  | 'Design'
  | 'Devops';

export type StatusType = 'banned' | 'notBanned';

export type ReputationType = 'highestToLowest' | 'lowestToHighest';

export type PermissionsType =
  | 'permissionRoot'
  | 'administration'
  | 'arbitration'
  | 'architecture'
  | 'funding'
  | 'recovery';

// @TODO: add more filter options and move it to global types
export type FilterOption =
  | ContributorType
  | ContributorType[]
  | StatusType
  | StatusType[]
  | TeamType
  | TeamType[]
  | ReputationType
  | ReputationType[]
  | PermissionsType
  | PermissionsType[]
  | 'businnes'
  | 'development'
  | 'high to low'
  | 'newest'
  | 'banned'
  | 'general'
  | 'verified'
  | 'top'
  | 'dedicated'
  | 'administration'
  | undefined;
