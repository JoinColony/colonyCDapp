import { type Icon } from '@phosphor-icons/react';

import {
  type TeamsPageFiltersField,
  type TeamsPageFilters,
} from '~frame/v5/pages/TeamsPage/types.ts';
import { type ModelSortDirection } from '~gql';

export interface RootItem {
  name: TeamsPageFiltersField;
  label: React.ReactNode;
  items: {
    label: React.ReactNode;
    value: ModelSortDirection;
  }[];
  icon: Icon;
  title: React.ReactNode;
  filterName: string;
}

export interface TeamsPageFilterProps {
  items: RootItem[];
  onChange: React.Dispatch<React.SetStateAction<TeamsPageFilters>>;
  searchValue: string;
  onSearch: (value: string) => void;
  filterValue: TeamsPageFilters;
  hasFilterChanged: boolean;
}

export interface TeamsPageFilterRootProps extends RootItem {
  onChange: React.Dispatch<React.SetStateAction<TeamsPageFilters>>;
  filterValue: TeamsPageFilters;
}
