export type TableFilteringProps = {
  filterType?: FilterType | FilterType[];
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
  | 'verified'
  | 'general';

export type TeamType =
  | 'root'
  | 'business'
  | 'product'
  | 'development'
  | 'productDesign'
  | 'devops';

export type StatusType = 'banned' | 'notBanned';

export type ReputationType = 'highestToLowest' | 'lowestToHighest';

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
  | 'administration';
