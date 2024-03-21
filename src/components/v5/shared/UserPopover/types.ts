import { type PopperOptions } from 'react-popper-tooltip';

export interface UserPopoverProps {
  size: number;
  walletAddress: string;
  popperOptions?: PopperOptions;
  userNameClassName?: string;
}
