import { type UserRoleMeta } from '~constants/permissions.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { type UserPopoverProps } from '~v5/shared/UserPopover/types.ts';

export interface MemberCardProps {
  userAvatarProps: UserPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isSimple?: boolean;
}
