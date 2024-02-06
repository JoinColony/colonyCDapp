import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

export interface RenderMeatBallItemWrapperProps {
  className?: string;
  onClick?: () => void;
}

export type RenderMeatBallItemWrapper = (
  props: RenderMeatBallItemWrapperProps,
  children: ReactNode,
) => ReactNode;

export interface MeatBallMenuItem {
  key: string;
  label: ReactNode;
  icon?: Icon;
  onClick?: () => void | boolean;
  renderItemWrapper?: RenderMeatBallItemWrapper;
  className?: string;
}

export interface MeatBallMenuProps {
  disabled?: boolean;
  items: MeatBallMenuItem[];
  buttonClassName?: string;
  contentWrapperClassName?: string;
  className?: string;
  renderItemWrapper?: RenderMeatBallItemWrapper;
  withVerticalIcon?: boolean;
  dropdownPlacementProps?: {
    top?: number;
    withAutoTopPlacement?: boolean;
  };
}
