import { type UserDisplayFragment } from '~gql';

export interface UserAvatarsItem {
  address: string;
  vote?: number;
  voteCount?: string;
}

export interface UserAvatarsProps {
  maxAvatarsToShow?: number;
  className?: string;
  items: UserDisplayFragment[];
  size?: number;
  showRemainingAvatars?: boolean;
  remainingAvatarsCount?: number;
  withThickerBorder?: boolean;
  isLoading?: boolean;
}
