import { NavigationSidebarProps } from '../NavigationSidebar/types';

export interface PageLayoutProps {
  navigationSidebarProps: NavigationSidebarProps;
  headerContent: React.ReactNode;
  topContent?: React.ReactNode;
}
