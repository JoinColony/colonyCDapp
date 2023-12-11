import { AvatarProps } from '~v5/shared/Avatar/types';
import { UserStatusMode } from '~v5/common/Pills/types';
import { User } from '~types';

export interface UserAvatarDetailsProps extends AvatarProps {
  user?: User | null;
  userName?: string | null;
  isVerified?: boolean;
  walletAddress?: string;
  userStatus?: UserStatusMode | null;
  isContributorsList?: boolean;
  isBordered?: boolean;
}
