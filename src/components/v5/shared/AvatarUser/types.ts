import { UserStatusMode } from '~v5/common/Pills/types';
import { AvatarSize } from '../Avatar/types';

export interface AvatarUserProps {
  walletAddress: string;
  avatar?: string;
  isContributorsList?: boolean;
  userStatus?: UserStatusMode;
  userName?: string;
  size: AvatarSize;
  isLink?: boolean;
}
