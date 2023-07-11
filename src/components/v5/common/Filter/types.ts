import { MessageDescriptor } from 'react-intl';

import { ContributorType, FilterType } from '../TableFiltering/types';

export type FilterOptionsProps = {
  options: FilterOption[];
  onSaveSelectedFilters: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type FilterOption = {
  id: number;
  title: string;
  option: FilterType;
  iconName: string;
  content: unknown[];
};

export type FilterPopoverProps = {
  isOpened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ContributorTypesProps = {
  id: ContributorType;
  title: MessageDescriptor;
};
