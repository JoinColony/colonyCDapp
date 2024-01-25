import { Optional } from 'utility-types';

import { User } from '~types';
import { UserStatusMode } from '~v5/common/Pills/types';

import { AvatarSize } from '../Avatar/types';

export interface UserAvatarProps {
  avatar?: string | null;
  avatarSize?: AvatarSize;
  className?: string;
  isContributorsList?: boolean;
  isLink?: boolean;
  preferThumbnail?: boolean;
  showUsername?: boolean;
  size?: AvatarSize;
  // This is deliberately brief to easily support stories
  user: (Optional<User, 'profile'> & Pick<User, 'walletAddress'>) | string;
  userStatus?: UserStatusMode | null;
}
