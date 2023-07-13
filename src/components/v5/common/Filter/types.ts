import { MessageDescriptor } from 'react-intl';

import {
  ContributorType,
  FilterType,
  StatusType,
  FilterOption,
  TeamType,
  ReputationType,
  PermissionsType,
} from '../TableFiltering/types';

export type FilterOptionsProps = {
  options: ParentFilterOption[];
  filterOption?: string;
  selectedChildOption?: FilterOption;
  onSelectParentFilter?: (option?: string) => void;
  onSelectNestedOption?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkedItems: Map<string, boolean>;
};

export type ParentFilterOption = {
  id: number;
  title: string;
  option: FilterType;
  iconName: string;
  content: string | unknown[];
};

export type FilterPopoverProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FilterOptionProps = {
  id:
    | ContributorType
    | StatusType
    | TeamType
    | ReputationType
    | PermissionsType;
  title: MessageDescriptor;
};

export type AccordionProps = Omit<FilterOptionsProps, 'options'> & {
  items: ParentFilterOption[];
  selectedChildOption?: FilterOption;
};

export type AccordionItemProps = Omit<AccordionProps, 'items'> & {
  title: string;
  option: FilterType;
};
