import React, { FC } from 'react';
// import { popper } from '@popperjs/core';
import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~shared/Extensions/UserAvatar';

const displayName = 'Extensions.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({ popperOptions, userName, ...rest }) => (
  <button type="button" className="popover" {...{ popperOptions }}>
    <UserAvatar {...rest} size="xs" userName={userName} />
  </button>
);

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
