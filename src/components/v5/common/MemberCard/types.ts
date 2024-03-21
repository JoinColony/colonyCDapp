import { type UserRoleMeta } from '~constants/permissions.ts';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';
import { type UserInfoPopoverProps } from '~v5/shared/UserInfoPopover/types.ts';

import { type UserStatusMode } from '../Pills/types.ts';

export interface MemberCardProps {
  userAvatarProps: UserInfoPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  role?: UserRoleMeta;
  reputation?: number;
  isExtension?: boolean;
  isVerified?: boolean;
  mode?: UserStatusMode;
}

export interface SimpleMemberCardProps {
  userAvatarProps: UserInfoPopoverProps;
  meatBallMenuProps: MeatBallMenuProps;
  isExtension?: boolean;
}
