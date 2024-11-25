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
  buttonClassName?: ((isMenuOpen: boolean) => string) | string;
  contentWrapperClassName?: string;
  className?: string;
  renderItemWrapper?: RenderMeatBallItemWrapper;
  withVerticalIcon?: boolean;
  iconSize?: number;
  hasLeftAlignment?: boolean;
}

export interface MeatBallMenuItemsProps {
  items: MeatBallMenuItem[];
  renderItemWrapper: RenderMeatBallItemWrapper;
  onClose: () => void;
}

export interface MeatBallMenuCloseTriggerProps {
  onClick: () => void;
}
