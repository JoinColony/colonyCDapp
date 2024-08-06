import { type ReactNode } from 'react';

import { type NavigationSidebarProps } from '~v5/frame/NavigationSidebar/types.ts';
import type { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

export interface UseCalamityBannerInfoReturnType {
  canUpgrade?: boolean;
  calamityBannerItems: CalamityBannerItemProps[];
}

export interface MainLayoutProps {
  mobileBottomContent?: NavigationSidebarProps['mobileBottomContent'];
  hamburgerLabel?: NavigationSidebarProps['hamburgerLabel'];
  mainMenuItems?: NavigationSidebarProps['mainMenuItems'];
  sidebar?: ReactNode;
  header?: ReactNode;
}

export type ColonyLayoutProps = Omit<
  MainLayoutProps,
  'calamityBannerItems' | 'header' | 'sidebar'
>;
