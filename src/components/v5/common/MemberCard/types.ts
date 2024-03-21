import { type UserRoleMeta } from '~constants/permissions.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { type UserInfoPopoverProps } from '~v5/shared/UserInfoPopover/types.ts';

export interface MemberCardProps {
  userAvatarProps: UserInfoPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isSimple?: boolean;
  isExtension?: boolean;
}
