import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';

import { UserAvatarDetailsProps } from '~v5/shared/UserAvatarDetails/types';
import { AvatarProps, AvatarSize } from '~v5/shared/Avatar/types';
import { UserAvatarProps } from '~v5/shared/UserAvatar/types';
import { DomainWithPermissionsAndReputation } from '~hooks/members/types';

export interface UserInfoProps extends AvatarProps, UserAvatarDetailsProps {
  aboutDescription: MessageDescriptor | string;
  domains?: DomainWithPermissionsAndReputation[];
  avatarSize?: AvatarSize;
}

export interface UserAvatarPopoverProps
  extends Omit<UserAvatarProps, 'isLink'>,
    Omit<UserInfoProps, 'size'> {
  popperOptions?: PopperOptions;
  avatarSize?: AvatarSize;
  isContributorsList?: boolean;
}

export type UserAvatarContentProps = UserAvatarPopoverProps;
