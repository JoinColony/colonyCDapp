import { ButtonLinkProps, ButtonProps } from '~v5/shared/Button/types';
import { NavigationSidebarLinksListProps } from '../NavigationSidebarLinksList/types';

export interface NavigationSidebarSecondLevelProps {
  title: string;
  content: React.ReactNode | NavigationSidebarLinksListProps['items'];
  additionalContent?: React.ReactNode;
  description?: string;
  onArrowClick?: VoidFunction;
  isExpanded?: boolean;
  bottomActionProps?: ButtonProps | ButtonLinkProps;
}
