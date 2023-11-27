import { AvatarSize } from '~v5/shared/Avatar/types';
import { UserPopoverProps } from '../UserPopover/types';

export interface UserAvatarPopoverProps extends UserPopoverProps {
  avatarSize?: AvatarSize;
}

export type UserAvatarContentProps = UserAvatarPopoverProps;
