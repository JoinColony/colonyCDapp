import { type UserRoleMeta } from '~constants/permissions.ts';
import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface MemberItem {
  user?: User | null;
  walletAddress: string;
  role?: UserRoleMeta;
  isVerified: boolean;
  reputation?: number;
}

export interface ExtensionItem {
  name: string;
  meatBallMenuProps: MeatBallMenuProps;
}
