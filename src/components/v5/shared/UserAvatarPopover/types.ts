import { type PopperOptions } from 'react-popper-tooltip';

export interface UserAvatarPopoverProps {
  size: number;
  walletAddress: string;
  popperOptions?: PopperOptions;
  userNameClassName?: string;
}
