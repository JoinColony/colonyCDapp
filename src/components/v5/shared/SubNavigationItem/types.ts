import { MessageDescriptor } from 'react-intl';

import { FilterOptionProps, ParentFilterOption } from '~v5/common/Filter/types';
import { FilterType, FilterOption } from '~v5/common/TableFiltering/types';

export type SubNavigationItemProps = {
  iconName: string;
  title: string;
  options?: ParentFilterOption[];
  option?: FilterType;
  shouldBeTooltipVisible?: boolean;
  isCopyTriggered?: boolean;
  tooltipText?: string[];
  onSelectNestedOption?: (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedParentOption?: FilterType,
  ) => void;
  selectedChildOption?: FilterOption;
  checkedItems?: Map<string | undefined, boolean>;
  nestedFilters?: FilterOptionProps[];
  onClick?: () => void;
};

export type NestedOptionsProps = {
  selectedParentOption?: FilterType;
  selectedChildOption?: FilterOption;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    selectedParentOption?: FilterType,
  ) => void;
  checkedItems?: Map<string | undefined, boolean>;
  nestedFilters?: FilterOptionProps[];
};

export type HeaderProps = {
  title: MessageDescriptor;
};
