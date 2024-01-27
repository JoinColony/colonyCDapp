import { UserRoleMeta } from '~constants/permissions.ts';
import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { UserPopoverProps } from '~v5/shared/UserPopover/types.ts';

export interface MemberCardProps {
  userAvatarProps: UserPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isSimple?: boolean;
}
