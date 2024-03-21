import { type ContributorType } from '~gql';

export interface UserDetailsProps {
  userAvatarSrc?: string;
  userName?: string | null;
  isVerified?: boolean;
  walletAddress: string;
  contributorType?: ContributorType;
}
