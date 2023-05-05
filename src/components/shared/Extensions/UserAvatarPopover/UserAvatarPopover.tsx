import React, { FC } from 'react';
import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~shared/Extensions/UserAvatar';
import Card from '~shared/Extensions/Card';
import Popover from '~shared/Extensions/Popover';
import Avatar from '~shared/Extensions/Avatar/Avatar';

const displayName = 'Extensions.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({ popperOptions, userName, ...rest }) => (
  <Popover
    renderContent={
      <Card>
        <Avatar size="m" title={userName} />
      </Card>
    }
    popperOptions={popperOptions}
    trigger="click"
    placement="bottom"
  >
    <button
      type="button"
      className="popover inline-flex transition-all duration-normal text-gray-900  hover:text-blue-400"
    >
      <UserAvatar {...rest} size="xs" userName={userName} />
    </button>
  </Popover>
);

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
