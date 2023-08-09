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
  onMobileSelectParentFilter?: (option?: string) => void;
  onSelectNestedOption?: (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedNestedOption: FilterType,
  ) => void;
  checkedItems: Map<string | undefined, boolean>;
};

export type ParentFilterOption = {
  id: number;
  title: string;
  option: FilterType;
  iconName: string;
  content: FilterOptionProps[];
};

export type FilterPopoverProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FilterOptionProps = {
  value?:
    | ContributorType
    | StatusType
    | TeamType
    | ReputationType
    | PermissionsType
    | string;
  color?: string;
  isDisabled?: boolean;
  label?: string | MessageDescriptor;
};

export type AccordionProps = Omit<FilterOptionsProps, 'options'> & {
  items: ParentFilterOption[];
  selectedChildOption?: FilterOption;
};

export type AccordionItemProps = Omit<AccordionProps, 'items'> & {
  title: string;
  option: FilterType;
  nestedFilters?: FilterOptionProps[];
};
