import { type UserFragment } from '~gql';

export interface UserAvatarsItem {
  address: string;
  vote?: number;
  voteCount?: string;
}

export interface UserAvatarsProps {
  maxAvatarsToShow?: number;
  className?: string;
  items: UserFragment[];
  size?: number;
  showRemainingAvatars?: boolean;
  remainingAvatarsCount?: number;
  withThickerBorder?: boolean;
  isLoading?: boolean;
}
