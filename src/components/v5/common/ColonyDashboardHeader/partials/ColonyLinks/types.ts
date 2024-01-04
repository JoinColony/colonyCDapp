import { IconProps } from 'phosphor-react';
import { ComponentType } from 'react';

import { TooltipProps } from '~shared/Extensions/Tooltip/types';
import { DropdownMenuProps } from '~v5/common/DropdownMenu/types';

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
