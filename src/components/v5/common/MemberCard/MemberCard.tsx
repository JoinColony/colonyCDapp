import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon/index.ts';
import { AvatarWithStatusBadge } from '~v5/shared/Avatar/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { MemberCardProps } from './types.ts';

const displayName = 'v5.common.MemberCard';

const MemberCard: FC<MemberCardProps> = ({
  userAvatarProps,
  meatBallMenuProps,
  reputation,
  role,
  isSimple,
}) => {
  const { userName, isVerified, mode, ...restUserAvatarProps } =
    userAvatarProps;

  return (
    <div className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25">
      <div
        className={clsx('w-full flex items-center', {
          'justify-between gap-4': isSimple,
          'relative flex-grow justify-center flex-col': !isSimple,
        })}
      >
        <UserPopover
          {...userAvatarProps}
          withVerifiedBadge={false}
          isContributorsList={!isSimple}
          className={clsx('flex items-center text-gray-900', {
            'gap-2.5 w-[calc(100%-18px-24px)]': isSimple,
            'flex-col items-center justify-between flex-grow gap-2 w-full':
              !isSimple,
          })}
        >
          <AvatarWithStatusBadge
            size={isSimple ? 'sm' : 'm'}
            mode={!isSimple ? mode : undefined}
            isFilled
            {...restUserAvatarProps}
          />
          <p
            className={clsx(
              'flex items-center justify-center text-center text-1',
              {
                'max-w-full': !isSimple,
                truncate: isSimple,
              },
            )}
          >
            <span className="truncate inline-block w-full">{userName}</span>
            {isVerified && (
              <Icon
                name="verified"
                appearance={{ size: 'tiny' }}
                className="text-blue-400 ml-1 flex-shrink-0"
              />
            )}
          </p>
        </UserPopover>
        <div
          className={clsx({
            'absolute top-0 right-0': !isSimple,
            'flex-shrink-0': isSimple,
          })}
        >
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {(reputation !== undefined || role) && !isSimple && (
        <div className="w-full pt-[.6875rem] mt-[.6875rem] border-t border-t-gray-200 flex items-center justify-between gap-4">
          {reputation !== undefined && (
            <ReputationBadge
              className="min-h-[1.625rem]"
              reputation={reputation}
            />
          )}
          {role && (
            <div className="ml-auto">
              <RolesTooltip role={role} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MemberCard.displayName = displayName;

export default MemberCard;
