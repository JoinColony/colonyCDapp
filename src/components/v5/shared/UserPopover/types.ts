import { type PopperOptions } from 'react-popper-tooltip';

export interface UserPopoverProps {
  size: number;
  walletAddress: string;
  popperOptions?: PopperOptions;
  textClassName?: string;
  withVerifiedBadge?: boolean;
  additionalContent?: JSX.Element;
  className?: string;
}
