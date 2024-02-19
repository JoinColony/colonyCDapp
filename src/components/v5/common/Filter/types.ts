import { type Icon } from '@phosphor-icons/react';

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
  icon: Icon;
  content: FilterOptionProps[];
  header?: string;
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
  icon?: Icon;
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
