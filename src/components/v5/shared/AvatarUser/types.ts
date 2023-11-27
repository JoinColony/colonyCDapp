import { UserStatusMode } from '~v5/common/Pills/types';
import { AvatarProps } from '../Avatar/types';

export interface AvatarUserProps extends AvatarProps {
  hasAvatarDecor?: boolean;
  userStatus?: UserStatusMode;
  userName?: string;
  href?: string;
}
