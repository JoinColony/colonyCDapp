import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { Avatar } from '../Avatar/Avatar.tsx';

const displayName = 'v5.shared.UserAvatar';

const MSG = defineMessages({
  defaultAlt: {
    id: `${displayName}.userAvatarAlt`,
    defaultMessage: 'Avatar of user {name}',
  },
});

export interface UserAvatarProps {
  className?: string;
  size: number;
  userAddress: string;
  userAvatarSrc?: string;
  userName?: string;
  testId?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({
  className,
  size,
  userAddress,
  userAvatarSrc,
  userName,
  testId,
}) => {
  return (
    <Avatar
      className={className}
      size={size}
      alt={formatText(MSG.defaultAlt, { name: userName ?? userAddress })}
      src={userAvatarSrc}
      address={userAddress}
      testId={testId}
    />
  );
};

UserAvatar.displayName = displayName;

export default UserAvatar;
