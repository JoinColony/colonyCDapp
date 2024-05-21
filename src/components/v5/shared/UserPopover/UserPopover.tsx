import clsx from 'clsx';
import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyContributorQuery } from '~gql';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import { getColonyContributorId } from '~utils/members.ts';

import { UserAvatar } from '../UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '../UserInfoPopover/index.ts';

import { type UserPopoverProps } from './types.ts';

const displayName = 'v5.UserPopover';

const UserPopover: FC<UserPopoverProps> = ({
  size,
  popperOptions,
  walletAddress,
  withVerifiedBadge,
  additionalContent,
  className,
  textClassName = 'text-md',
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

  return (
    <UserInfoPopover
      walletAddress={walletAddress}
      user={user}
      className={clsx({
        'flex-1 skeleton': loading,
        className,
      })}
      popperOptions={popperOptions}
      withVerifiedBadge={withVerifiedBadge}
    >
      <div className="flex items-center">
        <UserAvatar
          size={size}
          userAvatarSrc={user?.profile?.avatar ?? undefined}
          userName={displayName ?? undefined}
          userAddress={walletAddress}
        />
        <p className={clsx('ml-2 truncate font-medium', textClassName)}>
          {userDisplayName ?? (
            <MaskedAddress
              address={walletAddress}
              className={`!${textClassName} !font-medium`}
            />
          )}
        </p>
        {additionalContent}
      </div>
    </UserInfoPopover>
  );
};

UserPopover.displayName = displayName;

export default UserPopover;
