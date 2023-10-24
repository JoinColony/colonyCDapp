import type { ReactNode } from 'react';

import type { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';

export interface MainLayoutProps {
  calamityBannerItems?: CalamityBannerItemProps[];
  header?: ReactNode;
  hideColonies?: boolean;
  sidebar?: ReactNode;
}

export type ColonyLayoutProps = Omit<
  MainLayoutProps,
  'calamityBannerItems' | 'header' | 'sidebar'
>;

export interface HeaderProps {
  extra?: ReactNode;
  navBar?: ReactNode;
  txButtons?: ReactNode;
  userHub?: ReactNode;
}
