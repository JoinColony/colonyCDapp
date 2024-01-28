import { type UserFragment } from '~gql';

import { type AvatarSize } from '../Avatar/types.ts';

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
  withThickerBorder?: boolean;
}
