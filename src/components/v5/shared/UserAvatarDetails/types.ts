import { AvatarProps } from '~v5/shared/Avatar/types';

export interface UserAvatarDetailsProps extends AvatarProps {
  userName?: string;
  isVerified?: boolean;
  walletAddress?: string;
}
