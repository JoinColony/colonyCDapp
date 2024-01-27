import { Message } from '~types/index.ts';

import {
  ContributorType,
  FilterType,
  StatusType,
  ReputationType,
  PermissionsType,
  TeamType,
} from '../TableFiltering/types.ts';

import { FilterOptionsProps } from './partials/types.ts';

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
  customLabel?: string;
}
