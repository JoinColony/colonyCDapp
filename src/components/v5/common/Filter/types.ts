import {
  ContributorType,
  FilterType,
  StatusType,
  ReputationType,
  PermissionsType,
  TeamType,
  FilterTypes,
} from '../TableFiltering/types';
import { Message } from '~types';

export type AccordionProps = {
  items: ParentFilterOption[];
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

export type NestedFilterOption =
  | `${FilterTypes.Contributor}.${ContributorType}`
  | `${FilterTypes.Status}.${StatusType}`
  | `${FilterTypes.Reputation}.${ReputationType}`
  | `${FilterTypes.Permissions}.${PermissionsType}`
  | `${FilterTypes.Team}.${TeamType}`;

export type FilterOptionProps = {
  id: NestedFilterOption;
  title: Message;
  icon?: JSX.Element;
};

export type AccordionItemProps = {
  title: string;
  option: FilterType;
  nestedFilters: FilterOptionProps[];
};
