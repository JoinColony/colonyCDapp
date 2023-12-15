import { ComponentType } from 'react';
import { IconProps } from '@phosphor-icons/react';

import { DropdownMenuProps } from '~v5/common/DropdownMenu/types';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

export interface ColonyLinksItem {
  key: string;
  label?: string;
  to?: string;
  onClick?: VoidFunction;
  icon: ComponentType<IconProps>;
  tooltipProps?: TooltipProps;
}

export interface ColonyLinksProps {
  items: ColonyLinksItem[];
  dropdownMenuProps: DropdownMenuProps;
}
