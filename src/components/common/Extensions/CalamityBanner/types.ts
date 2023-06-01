import { DialogType } from '~shared/Dialog';

export interface CalamityBannerProps {
  linkName: string;
  buttonName: string;
  isButtonDisabled?: boolean;
  onUpgrade: () => DialogType<object> | undefined;
}
