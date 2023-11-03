import { NavigationSidebarProps } from '~v5/frame/NavigationSidebar/types';
import type { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types';

export interface UseCalamityBannerInfoReturnType {
  canUpgrade?: boolean;
  calamityBannerItems: CalamityBannerItemProps[];
}

export interface SharedLayoutProps {
  mobileBottomContent?: NavigationSidebarProps['mobileBottomContent'];
  hamburgerLabel?: NavigationSidebarProps['hamburgerLabel'];
  mainMenuItems?: NavigationSidebarProps['mainMenuItems'];
}
