export type TableFilteringProps = {
  filterType: FilterType;
  filterOptions: FilterOption | FilterOption[];
  onClick: () => void;
  className?: string;
};

export type FilterType =
  | 'team'
  | 'reputation'
  | 'latest'
  | 'statuses'
  | 'contributor'
  | 'permissions';

export type ContributorType =
  | 'top'
  | 'dedicated'
  | 'active'
  | 'verified'
  | 'general';

export type StatusType = 'banned' | 'notBanned';

// @TODO: add more filter options and move it to global types
export type FilterOption =
  | ContributorType
  | ContributorType[]
  | StatusType
  | StatusType[]
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
