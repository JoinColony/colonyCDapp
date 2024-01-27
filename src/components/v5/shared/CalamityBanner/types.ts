import { CalamityBannerContentProps } from './partials/types.ts';

export interface CalamityBannerItemProps extends CalamityBannerContentProps {
  // linkName: string;
  // linkUrl: string;
  // buttonName: string;
  // isButtonDisabled?: boolean;
  // onClick: () => void;
  // mode: CalamityBannerMode;
  // title: MessageDescriptor;
  key: string;
}

export interface CalamityBannerProps {
  items: CalamityBannerItemProps[];
}
