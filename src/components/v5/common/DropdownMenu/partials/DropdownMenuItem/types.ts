import { IconProps } from 'phosphor-react';
import { ButtonHTMLAttributes, ComponentType } from 'react';

import { TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { LinkProps } from '~v5/shared/Link/types.ts';

export type DropdownMenuItemProps = (
  | Omit<LinkProps, 'text' | 'textValues'>
  | ButtonHTMLAttributes<HTMLButtonElement>
) & {
  label: string;
  icon?: ComponentType<IconProps>;
  chevronIcon?: ComponentType<IconProps>;
  tooltipProps?: TooltipProps;
  items?: (DropdownMenuItemProps & {
    key: string;
  })[];
};
