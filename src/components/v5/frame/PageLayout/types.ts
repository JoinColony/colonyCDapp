import { type ReactNode } from 'react';

import { type PageHeaderProps } from './partials/PageHeader/types.ts';

export interface PageLayoutProps {
  sidebar: ReactNode;
  headerProps?: PageHeaderProps;
  topContent?: ReactNode;
  header?: ReactNode;
  // When set to true, the PageLayout will apply sm vs desktop styles. As opposed to md vs desktop styles.
  enableMobileAndDesktopLayoutBreakpoints?: boolean;
}
