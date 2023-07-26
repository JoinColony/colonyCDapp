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
