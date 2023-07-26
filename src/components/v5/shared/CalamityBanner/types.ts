import { MessageDescriptor } from 'react-intl';

export interface CalamityBannerProps {
  items: CalamityBannerItemProps[];
}

export type CalamityBannerMode = 'error' | 'info';

export interface CalamityBannerItemProps {
  linkName: string;
  linkUrl: string;
  buttonName: string;
  isButtonDisabled?: boolean;
  onClick: () => void;
  mode: CalamityBannerMode;
  title: MessageDescriptor;
  id: string;
}

export interface CalamityBannerContentProps extends CalamityBannerItemProps {
  index: number;
  activeElement: number;
  handleBannerChange: () => void;
  setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
  itemsLength: number;
}
