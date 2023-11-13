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
  showRemainingAvatars = true,
  size = 'sm',
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
            size={size}
            className={clsx('border-base-white border rounded-full', {
              'border-2': size === 'xms',
            })}
          />
        </li>
      ))}
      {!!remainingAvatarsCount && showRemainingAvatars && (
        <li
          className={clsx(
            'flex items-center justify-center border border-base-white rounded-full bg-gray-50 text-5 text-gray-700 -ml-3 z-10',
            {
              'w-[1.875rem] h-[1.875rem]': size === 'sm',
              'w-[2.375rem] h-[2.375rem]': size === 'xms',
            },
          )}
        >
          {`+ ${remainingAvatarsCount}`}
        </li>
      )}
    </ul>
  );
};

UserAvatars.displayName = displayName;

export default UserAvatars;
