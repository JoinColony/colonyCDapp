import React, { FC } from 'react';
import { isHexString } from 'ethers/lib/utils';
import UserInfo from './UserInfo';
import { UserAvatarContentProps } from '~v5/shared/UserAvatarPopover/types';

const displayName = 'v5.UserAvatarPopover.partials.UserAvatarContent';

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
      userName={profile?.displayName || walletAddress}
      title={userName}
      walletAddress={isHexString(walletAddress) ? walletAddress : ''}
      isVerified={isVerified}
      aboutDescription={aboutDescription}
      avatar={thumbnail || avatar || ''}
      userStatus={userStatus}
      domains={domains}
      isContributorsList={isContributorsList}
      size="md"
    />
  );
};

UserAvatarContent.displayName = displayName;

export default UserAvatarContent;
