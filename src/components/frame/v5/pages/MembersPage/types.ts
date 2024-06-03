import { type UserRoleMeta } from '~constants/permissions.ts';
import { type ContributorType } from '~gql';
import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface MemberItem {
  user?: User | null;
  walletAddress: string;
  role?: UserRoleMeta;
  multiSigRole?: UserRoleMeta;
  isVerified: boolean;
  reputation?: number;
  contributorType?: ContributorType;
}

export interface MemberCardItem {
  member: MemberItem;
  meatBallMenuProps: MeatBallMenuProps;
}
