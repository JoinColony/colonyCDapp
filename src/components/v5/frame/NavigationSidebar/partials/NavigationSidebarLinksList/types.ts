import { NavigationSidebarLinkProps } from '../NavigationSidebarLink/types';

export interface NavigationSidebarLinksListItem
  extends Omit<NavigationSidebarLinkProps, 'children'> {
  key: string;
  label: string;
}

export interface NavigationSidebarLinksListProps {
  items: NavigationSidebarLinksListItem[];
  className?: string;
}
