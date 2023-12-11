import { User } from '~types';
import { UserStatusMode } from '~v5/common/Pills/types';
import { AvatarSize } from '../Avatar/types';

export interface UserAvatarProps {
  avatarSize?: AvatarSize;
  className?: string;
  isContributorsList?: boolean;
  isLink?: boolean;
  preferThumbnail?: boolean;
  showUsername?: boolean;
  size?: AvatarSize;
  user?: User | null;
  walletAddress?: string;
  userStatus?: UserStatusMode | null;
}
