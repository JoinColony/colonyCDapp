import clsx from 'clsx';
import React, { FC } from 'react';

import { useGetColonyContributorQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { getColonyContributorId } from '~utils/members';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';
import UserAvatar from '~v5/shared/UserAvatar';

import UserPopover from '../UserPopover';

import { UserAvatarPopoverProps } from './types';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({ size, ...props }) => {
  const { walletAddress, isContributorsList } = props;
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { data } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
  });

  const contributor = data?.getColonyContributor;
  const { user } = contributor ?? {};
  const { displayName: userDisplayName } = user?.profile || {};

  const splitAddress = splitWalletAddress(user?.walletAddress || '');
  const userStatus = (contributor?.type?.toLowerCase() ??
    null) as ContributorTypeFilter | null;

  return (
    <UserPopover
      userName={userDisplayName ?? splitAddress}
      user={user}
      className={clsx({
        skeleton: !user,
      })}
      {...props}
    >
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
