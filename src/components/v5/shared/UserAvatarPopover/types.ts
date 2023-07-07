import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

import { UserPermissionsBadgeProps } from '~common/Extensions/UserPermissionsBadge/types';
import { UserStatusMode } from '~v5/common/Pills/types';
import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';
import { AvatarProps, AvatarSize } from '~v5/shared/Avatar/types';
import { UserAvatarProps } from '~v5/shared/UserAvatar/types';

export interface ColonyReputationItem {
  key: string;
  title: string;
  percentage: string;
  points?: string;
}

export interface PermissionsItem extends UserPermissionsBadgeProps {
  key: string;
}

export interface UserInfoProps extends AvatarProps, UserAvatarDetailsProps {
  aboutDescription: MessageDescriptor | string;
  colonyReputation?: ColonyReputationItem[];
  permissions?: PermissionsItem[];
}

export interface UserAvatarPopoverProps
  extends Omit<UserAvatarProps, 'isLink'>,
    Omit<UserInfoProps, 'size'> {
  popperOptions?: PopperOptions;
  userStatus?: UserStatusMode;
  avatarSize?: AvatarSize;
}
