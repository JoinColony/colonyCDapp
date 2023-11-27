import React, { FC } from 'react';

import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~v5/shared/UserAvatar';
import UserPopover from '../UserPopover';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({ size, ...props }) => {
  const { user, walletAddress, userStatus, isContributorsList } = props;

  return (
    <UserPopover {...props}>
      <UserAvatar
        size={size || 'xs'}
        user={user || walletAddress}
        showUsername
        userStatus={userStatus}
        isContributorsList={isContributorsList}
      />
    </UserPopover>
  );
};

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
