import { MessageDescriptor } from 'react-intl';

import { ParentFilterOption } from '~v5/common/Filter/types';
import { FilterType, FilterOption } from '~v5/common/TableFiltering/types';

export type SubNavigationItemProps = {
  iconName: string;
  title: string;
  options?: ParentFilterOption[];
  option?: FilterType;
  shouldBeTooltipVisible?: boolean;
  onClick?: () => void;
  isCopyTriggered?: boolean;
  tooltipText?: string[];
  onSelectParentFilter?: (option?: string) => void;
  shouldBeActionOnHover?: boolean;
  onSelectNestedOption?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedChildOption?: FilterOption;
  checkedItems?: Map<string, boolean>;
};

export type NestedOptionsProps = {
  selectedParentOption?: FilterType;
  selectedChildOption?: FilterOption;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkedItems?: Map<string, boolean>;
};

export type HeaderProps = {
  title: MessageDescriptor;
};
