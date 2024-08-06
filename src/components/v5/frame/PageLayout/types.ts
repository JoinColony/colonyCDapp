import { type ReactNode } from 'react';

import { type PageHeaderProps } from './partials/PageHeader/types.ts';

export interface PageLayoutProps {
  sidebar: ReactNode;
  headerProps: PageHeaderProps;
  topContent?: ReactNode;
  header?: ReactNode;
}
