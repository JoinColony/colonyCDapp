import { type MessageDescriptor } from 'react-intl';

import { type IconSize } from '~shared/Icon/Icon.tsx';
import { type FilterOptionProps } from '~v5/common/Filter/types.ts';
import { type FilterType } from '~v5/common/TableFiltering/types.ts';

import type React from 'react';

export type SubNavigationItemProps = {
  iconName: string;
  title: string;
  option?: FilterType;
  shouldBeTooltipVisible?: boolean;
  isCopyTriggered?: boolean;
  tooltipText?: string;
  nestedFilters?: FilterOptionProps[];
  onClick?: (e: React.SyntheticEvent) => void;
  iconSize?: IconSize;
};

export type NestedOptionsProps = {
  parentOption: string;
  nestedFilters: FilterOptionProps[];
};

export type HeaderProps = {
  title: MessageDescriptor;
  className?: string;
};
