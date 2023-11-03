import { NavigationSidebarProps } from '../NavigationSidebar/types';
import { PageHeaderProps } from './partials/PageHeader/types';

export interface PageLayoutProps {
  navigationSidebarProps: NavigationSidebarProps;
  headerProps: PageHeaderProps;
  topContent?: React.ReactNode;
}
