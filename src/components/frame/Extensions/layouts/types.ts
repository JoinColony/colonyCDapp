import { type ReactNode } from 'react';

import type { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

export interface UseCalamityBannerInfoReturnType {
  canUpgrade?: boolean;
  calamityBannerItems: CalamityBannerItemProps[];
}

export interface MainLayoutProps {
  sidebar?: ReactNode;
  header?: ReactNode;
}

export type ColonyLayoutProps = Omit<
  MainLayoutProps,
  'calamityBannerItems' | 'header' | 'sidebar'
>;
