import { ReactNode } from 'react';

import { PageHeaderProps } from './partials/PageHeader/types.ts';

export interface PageLayoutProps {
  sidebar: ReactNode;
  headerProps: PageHeaderProps;
  topContent?: ReactNode;
  hasWideSidebar?: boolean;
}
