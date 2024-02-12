import { type Icon } from '@phosphor-icons/react';
import { type SyntheticEvent } from 'react';
import { type MessageDescriptor } from 'react-intl';

import { type FilterOptionProps } from '~v5/common/Filter/types.ts';
import { type FilterType } from '~v5/common/TableFiltering/types.ts';

export type SubNavigationItemProps = {
  icon: Icon;
  title: string;
  option?: FilterType;
  shouldBeTooltipVisible?: boolean;
  isCopyTriggered?: boolean;
  tooltipText?: string;
  nestedFilters?: FilterOptionProps[];
  onClick?: (e: SyntheticEvent) => void;
  iconSize?: number;
};

export type NestedOptionsProps = {
  parentOption: string;
  nestedFilters: FilterOptionProps[];
};

export type HeaderProps = {
  title: MessageDescriptor;
  className?: string;
};
