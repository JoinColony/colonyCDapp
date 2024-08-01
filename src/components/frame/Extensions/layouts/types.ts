import type { CalamityBannerItemProps } from '~v5/shared/CalamityBanner/types.ts';

export interface UseCalamityBannerInfoReturnType {
  canUpgrade?: boolean;
  calamityBannerItems: CalamityBannerItemProps[];
}
