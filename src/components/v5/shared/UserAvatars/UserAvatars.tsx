import React, { FC } from 'react';
import clsx from 'clsx';
import UserAvatar from '~v5/shared/UserAvatar';
import { UserAvatarsProps } from './types';
import { User } from '~types';
import { useUserAvatars } from '~hooks/useUserAvatars';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep.partials.MembersAvatars';

const UserAvatars: FC<UserAvatarsProps> = ({
  items,
  maxAvatarsToShow = 4,
  className,
}) => {
  const { registeredUsers, remainingAvatarsCount } = useUserAvatars(
    maxAvatarsToShow,
    items,
  );

  return (
    <ul className={clsx(className, 'flex')}>
      {registeredUsers?.map((registeredVoter: User) => (
        <li key={registeredVoter.walletAddress} className="-ml-3">
          <UserAvatar
            user={registeredVoter}
            size="sm"
            className="border-base-white border rounded-full"
          />
        </li>
      ))}
      {!!remainingAvatarsCount && (
        <li
          className={`flex items-center justify-center w-[1.875rem] h-[1.875rem] border border-base-white
              rounded-full bg-gray-50 text-xs font-semibold text-gray-700 -ml-3 z-10`}
        >
          {`+ ${remainingAvatarsCount}`}
        </li>
      )}
    </ul>
  );
};

UserAvatars.displayName = displayName;

export default UserAvatars;
