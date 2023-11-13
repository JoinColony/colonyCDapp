import { ButtonProps } from '~v5/shared/Button/types';
import { LinkProps } from '~v5/shared/Link/types';

export enum CalamityBannerModeEnum {
  error = 'error',
  info = 'info',
}

export type CalamityBannerMode = keyof typeof CalamityBannerModeEnum;

export interface CalamityBannerContentProps {
  title: string;
  mode: CalamityBannerMode;
  linkProps: LinkProps;
  buttonProps: ButtonProps;
  onCloseClick?: VoidFunction;
  onCaretClick?: VoidFunction;
  className?: string;
}
