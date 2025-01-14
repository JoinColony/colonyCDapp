import { type UserRoleMeta } from '~constants/permissions.ts';
import { type ContributorType } from '~gql';
import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface MemberItem {
  user?: User | null;
  domains: DomainWithPermissionsAndReputation[];
  walletAddress: string;
  role?: UserRoleMeta;
  isRoleInherited?: boolean;
  multiSigRole?: UserRoleMeta;
  isMultiSigRoleInherited?: boolean;
  isVerified: boolean;
  reputation?: number;
  contributorType?: ContributorType;
}

export interface MemberCardItem {
  member: MemberItem;
  meatBallMenuProps: MeatBallMenuProps;
}
