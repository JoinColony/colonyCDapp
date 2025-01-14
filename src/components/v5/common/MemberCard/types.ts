import { type ContributorType } from '~gql';
import { type DomainWithPermissionsAndReputation } from '~hooks/members/types.ts';
import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface MemberCardProps {
  userAddress: string;
  user?: User;
  domains: DomainWithPermissionsAndReputation[];
  meatBallMenuProps: MeatBallMenuProps;
  reputation?: number;
  isVerified?: boolean;
  contributorType?: ContributorType;
}
