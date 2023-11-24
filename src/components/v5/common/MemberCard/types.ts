import { UserRoleMeta } from '~constants/permissions';
import { MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types';
import { UserPopoverProps } from '~v5/shared/UserPopover/types';

export interface MemberCardProps {
  userAvatarProps: UserPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isSimple?: boolean;
}
