import React, { type FC } from 'react';

import { Avatar } from '../Avatar/Avatar.tsx';

const displayName = 'v5.UserAvatar';

interface UserAvatarProps {
  className?: string;
  size: number;
  userAddress: string;
  userAvatarSrc?: string;
  userName?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({
  className,
  size,
  userAddress,
  userAvatarSrc,
  userName,
}) => {
  return (
    <Avatar
      className={className}
      size={size}
      alt={`Avatar of user ${userName ?? userAddress}`}
      src={userAvatarSrc}
      address={userAddress}
    />
  );
};

UserAvatar.displayName = displayName;

export default UserAvatar;
