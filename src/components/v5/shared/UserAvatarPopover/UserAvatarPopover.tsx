import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyContributorQuery } from '~gql';
import { getColonyContributorId } from '~utils/members.ts';

import UserPopover from '../UserPopover/index.ts';

import { type UserAvatarPopoverProps } from './types.ts';
import { UserAvatar2 } from '../UserAvatar/UserAvatar.tsx';
import UserStatusWrapper from '../UserStatusWrapper/UserStatusWrapper.tsx';

const displayName = 'v5.UserAvatarPopover';

// AVATAR: ta stvar naj sam nrdi avatar + username je lhk composan in
// DEFAULT JE BIU xs
const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  size,
  popperOptions,
  walletAddress,
  userNameClassName,
}) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { data, loading } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
  });

  const contributor = data?.getColonyContributor;
  const { user } = contributor ?? {};
  const { displayName: userDisplayName } = user?.profile || {};

  const userStatus = contributor?.type;

  const getUserAvatarWrapper = () => {
    const userAvatar = (
      <UserAvatar2
        size={size}
        userAvatarSrc={user?.profile?.avatar ?? undefined}
        userName={displayName ?? undefined}
        userAddress={walletAddress}
      />
    );
    if (userStatus === null || userStatus === undefined) {
      return userAvatar;
    }

    if (userStatus === 'general') {
      return userAvatar;
    }

    return (
      <UserStatusWrapper userStatus={userStatus}>
        {userAvatar}
      </UserStatusWrapper>
    );
  };

  return (
    <UserPopover
      size={size}
      walletAddress={walletAddress}
      userName={userDisplayName ?? undefined}
      user={user}
      className={clsx({
        skeleton: loading,
      })}
      popperOptions={popperOptions}
    >
      <div className="flex items-center">
        {getUserAvatarWrapper()}
        <p
          className={clsx(
            'font-medium truncate text-md ml-2',
            userNameClassName,
          )}
        >
          {displayName ?? walletAddress}
        </p>
      </div>
    </UserPopover>
  );
};

UserAvatarPopover.displayName = displayName;

export default UserAvatarPopover;
