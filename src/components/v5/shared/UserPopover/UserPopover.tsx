import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ContributorType, useGetColonyContributorQuery } from '~gql';
import { getColonyContributorId } from '~utils/members.ts';

import ContributorTypeWrapper from '../ContributorTypeWrapper/ContributorTypeWrapper.tsx';
import { UserAvatar2 } from '../UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '../UserInfoPopover/index.ts';

import { type UserPopoverProps } from './types.ts';

const displayName = 'v5.UserPopover';

// AVATAR: ta stvar naj sam nrdi avatar + username je lhk composan in
// DEFAULT JE BIU xs
const UserPopover: FC<UserPopoverProps> = ({
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
  const { user, type: contributorType } = contributor ?? {};
  const { displayName: userDisplayName } = user?.profile || {};

  return (
    <UserInfoPopover
      walletAddress={walletAddress}
      userName={userDisplayName ?? undefined}
      user={user}
      className={clsx({
        skeleton: loading,
      })}
      popperOptions={popperOptions}
    >
      <div className="flex items-center">
        <ContributorTypeWrapper
          contributorType={contributorType || ContributorType.General}
        >
          <UserAvatar2
            size={size}
            userAvatarSrc={user?.profile?.avatar ?? undefined}
            userName={displayName ?? undefined}
            userAddress={walletAddress}
          />
        </ContributorTypeWrapper>
        <p
          className={clsx(
            'font-medium truncate text-md ml-2',
            userNameClassName,
          )}
        >
          {userDisplayName ?? walletAddress}
        </p>
      </div>
    </UserInfoPopover>
  );
};

UserPopover.displayName = displayName;

export default UserPopover;
