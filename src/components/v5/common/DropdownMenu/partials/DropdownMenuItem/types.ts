import { type IconProps } from '@phosphor-icons/react';
import { type ButtonHTMLAttributes, type ComponentType } from 'react';

import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';
import { type LinkProps } from '~v5/shared/Link/types.ts';

export type DropdownMenuItemProps = (
  | Omit<LinkProps, 'text' | 'textValues'>
  | ButtonHTMLAttributes<HTMLButtonElement>
) & {
  disabled?: boolean;
  label: string;
  icon?: ComponentType<IconProps>;
  chevronIcon?: ComponentType<IconProps>;
  tooltipProps?: TooltipProps;
  items?: (DropdownMenuItemProps & {
    key: string;
  })[];
};
