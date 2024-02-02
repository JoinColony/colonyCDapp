import { type Message } from '~types/index.ts';

import {
  type ContributorType,
  type FilterType,
  type StatusType,
  type ReputationType,
  type PermissionsType,
  type TeamType,
} from '../TableFiltering/types.ts';

import { type FilterOptionsProps } from './partials/types.ts';

export type AccordionProps = {
  items: ParentFilterOption[];
};

export type ParentFilterOption = {
  id: number;
  title: string;
  filterType: FilterType;
  iconName: string;
  content: FilterOptionProps[];
};

export type FilterPopoverProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NestedFilterOption =
  | ContributorType
  | StatusType
  | ReputationType
  | PermissionsType
  | TeamType;

export type FilterOptionProps = {
  id: NestedFilterOption;
  title: Message;
  icon?: JSX.Element;
  nestedOptions?: FilterOptionProps[];
};

export type AccordionItemProps = {
  title: string;
  option: FilterType;
  nestedFilters: FilterOptionProps[];
};

export interface FilterProps extends FilterOptionsProps {
  searchInputPlaceholder: string;
  searchInputLabel: string;
  customLabel?: string;
}
