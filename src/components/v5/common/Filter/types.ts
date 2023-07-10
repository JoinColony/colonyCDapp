import { MessageDescriptor } from 'react-intl';
import { UserStatusMode } from '../Pills/types';
import { FilterType } from '../TableFiltering/types';

export type FilterOptionsProps = {
  options: FilterOption[];
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
  id: UserStatusMode;
  title: MessageDescriptor;
};
