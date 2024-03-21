import { type ContributorType } from '~gql';

export interface UserDetailsProps {
  size: number;
  userAvatarSrc?: string;
  userName?: string | null;
  isVerified?: boolean;
  walletAddress: string;
  contributorType?: ContributorType;
}
