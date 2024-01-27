import React from 'react';
import { MessageDescriptor } from 'react-intl';

import { IconSize } from '~shared/Icon/Icon.tsx';
import { FilterOptionProps } from '~v5/common/Filter/types.ts';
import { FilterType } from '~v5/common/TableFiltering/types.ts';

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
