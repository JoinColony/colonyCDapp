import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import { type AvatarProps } from '~v5/shared/Avatar/types.ts';

export interface UserAvatarDetailsProps extends AvatarProps {
  userName?: string | null;
  isVerified?: boolean;
  walletAddress: string;
  userStatus?: UserStatusMode | null;
  isContributorsList?: boolean;
  isBordered?: boolean;
  additionalContent?: React.ReactNode;
}
