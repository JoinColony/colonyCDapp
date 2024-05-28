import { type User } from '~types/graphql.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

export interface SimpleMemberCardProps {
  userAddress: string;
  user?: User;
  meatBallMenuProps: MeatBallMenuProps;
}
