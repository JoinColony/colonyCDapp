import { UserStatusMode } from '../Pills/types';

export interface MemberSignatureProps extends AvatarProps {
  isChecked: boolean;
}

export interface AvatarProps {
  walletAddress: string;
  avatar?: string;
  isContributorsList?: boolean;
  userStatus?: UserStatusMode;
  userName?: string;
}
