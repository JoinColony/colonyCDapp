import React, { FC } from 'react';
import UserInfo from './UserInfo';
import { UserAvatarContentProps } from '../types';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarContent: FC<UserAvatarContentProps> = ({
  userName,
  user,
  isVerified,
  walletAddress,
  aboutDescription,
  userStatus,
  domains,
  isContributorsList,
}) => {
  const { profile } = user || {};
  const { avatar, thumbnail } = profile || {};

  return (
    <UserInfo
      userName={userName}
      title={userName}
      walletAddress={walletAddress}
      isVerified={isVerified}
      aboutDescription={aboutDescription}
      avatar={thumbnail || avatar || ''}
      userStatus={userStatus}
      domains={domains}
      isContributorsList={isContributorsList}
      avatarSize="md"
    />
  );
};

UserAvatarContent.displayName = displayName;

export default UserAvatarContent;
