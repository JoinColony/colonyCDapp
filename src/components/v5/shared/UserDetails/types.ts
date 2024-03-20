import { type UserStatusMode } from '~v5/common/Pills/types.ts';

export interface UserDetailsProps {
  size: number;
  userAvatarSrc?: string;
  userName?: string | null;
  isVerified?: boolean;
  walletAddress: string;
  userStatus?: UserStatusMode | null;
}
