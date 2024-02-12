import { type Icon } from '@phosphor-icons/react';
import { type ButtonHTMLAttributes } from 'react';

export interface NavigationSidebarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  label: string;
  isActive?: boolean;
  isExpanded?: boolean;
  hideMobile?: boolean;
  hasSecondLevel?: boolean;
  className?: string;
  isHighlighted?: boolean;
}
