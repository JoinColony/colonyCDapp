import { MessageDescriptor } from 'react-intl';

import {
  ContributorType,
  FilterType,
  StatusType,
  FilterOption,
} from '../TableFiltering/types';

export type FilterOptionsProps = {
  options: ParentFilterOption[];
  filterOption?: string;
  selectedChildOption?: FilterOption;
  onSelectParentFilter?: (option?: string) => void;
  onSelectNestedOption?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  id: ContributorType | StatusType;
  title: MessageDescriptor;
};

export type AccordionProps = Omit<FilterOptionsProps, 'options'> & {
  items: ParentFilterOption[];
  selectedChildOption?: FilterOption;
};

export type AccordionItemProps = Omit<AccordionProps, 'items'> & {
  item: ParentFilterOption;
};
