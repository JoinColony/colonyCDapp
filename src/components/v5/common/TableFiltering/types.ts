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

// @TODO: add more filter options and move it to global types
export type FilterOption =
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
