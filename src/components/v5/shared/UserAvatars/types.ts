import { UserFragment } from '~gql';
import { AvatarSize } from '../Avatar/types';

export interface UserAvatarsItem {
  address: string;
  vote?: number;
  voteCount?: string;
}

export interface UserAvatarsProps {
  maxAvatarsToShow?: number;
  className?: string;
  items: UserFragment[];
  size?: AvatarSize;
  showRemainingAvatars?: boolean;
  remainingAvatarsCount?: number;
}
