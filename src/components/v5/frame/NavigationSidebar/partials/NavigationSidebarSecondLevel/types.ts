import {
  type ButtonLinkProps,
  type ButtonProps,
} from '~v5/shared/Button/types.ts';

import { type NavigationSidebarLinksListProps } from '../NavigationSidebarLinksList/types.ts';

export interface NavigationSidebarSecondLevelProps {
  title: string;
  content: React.ReactNode | NavigationSidebarLinksListProps['items'];
  additionalContent?: React.ReactNode;
  description?: string;
  onArrowClick?: VoidFunction;
  isExpanded?: boolean;
  bottomActionProps?: ButtonProps | ButtonLinkProps;
}
