import { NavigationSidebarLinkProps } from '../NavigationSidebarLink/types.ts';

export interface NavigationSidebarLinksListItem
  extends Omit<NavigationSidebarLinkProps, 'children'> {
  key: string;
  label: string;
}

export interface NavigationSidebarLinksListProps {
  items: NavigationSidebarLinksListItem[];
  className?: string;
}
