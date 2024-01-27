import { UserStatusMode } from '~v5/common/Pills/types.ts';

import { AvatarProps } from '../Avatar/types.ts';

export interface AvatarUserProps extends AvatarProps {
  hasAvatarDecor?: boolean;
  userStatus?: UserStatusMode;
  userName?: string;
  href?: string;
}
