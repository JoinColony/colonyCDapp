import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';
import { UserPermissionsBadgeProps } from '~common/Extensions/UserPermissionsBadge/types';
import { AvatarProps } from '~shared/Extensions/Avatar/types';
import { UserAvatarProps } from '~shared/Extensions/UserAvatar/types';

export interface ColonyReputationItem {
  key: string;
  title: string;
  percentage: string;
  points: string;
}

export interface PermissionsItem extends UserPermissionsBadgeProps {
  key: string;
}

export interface UserInfoProps extends AvatarProps {
  userName?: string;
  isVerified?: boolean;
  copyUrl?: boolean;
  walletAddress: string;
  aboutDescription: MessageDescriptor | string;
  colonyReputation: ColonyReputationItem[];
  permissions: PermissionsItem[];
}

export interface UserAvatarPopoverProps extends Omit<UserAvatarProps, 'isLink'>, Omit<UserInfoProps, 'size'> {
  popperOptions?: PopperOptions;
}
