import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyContributorQuery } from '~gql';
import { getColonyContributorId } from '~utils/members.ts';
import { type ContributorTypeFilter } from '~v5/common/TableFiltering/types.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import UserPopover from '../UserPopover/index.ts';

import { type UserAvatarPopoverProps } from './types.ts';

const displayName = 'v5.UserAvatarPopover';

const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  size,
  additionalContent,
  ...props
}) => {
  const { walletAddress, isContributorsList } = props;
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

  const userStatus = (contributor?.type?.toLowerCase() ??
    null) as ContributorTypeFilter | null;

  return (
    <UserPopover
      userName={userDisplayName}
      user={user}
      className={clsx({
        skeleton: loading,
      })}
      additionalContent={additionalContent}
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
