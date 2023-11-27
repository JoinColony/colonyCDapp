import React, { FC } from 'react';

import clsx from 'clsx';
import { UserAvatarPopoverProps } from './types';
import UserAvatar from '~v5/shared/UserAvatar';
import UserPopover from '../UserPopover';
import { useColonyContext } from '~hooks';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { useGetColonyContributorQuery } from '~gql';
import { getColonyContributorId } from '~utils/members';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({ size, ...props }) => {
  const { walletAddress, isContributorsList } = props;
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony || {};
  const { data } = useGetColonyContributorQuery({
    variables: {
      id: getColonyContributorId(colonyAddress, walletAddress),
      colonyAddress,
    },
  });

  const contributor = data?.getColonyContributor;
  const { user } = contributor ?? {};
  const { bio, displayName: userDisplayName } = user?.profile || {};

  const splitAddress = splitWalletAddress(user?.walletAddress || '');
  const userStatus = (contributor?.type?.toLowerCase() ??
    null) as ContributorTypeFilter | null;

  return (
    <UserPopover
      userName={userDisplayName ?? splitAddress}
      aboutDescription={bio || ''}
      user={user}
      colonyAddress={colonyAddress}
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
