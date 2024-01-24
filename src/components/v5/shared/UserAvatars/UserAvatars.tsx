import clsx from 'clsx';
import React, { FC } from 'react';

import { User } from '~types/graphql';
import { calculateLastSliceIndex } from '~utils/avatars';
import UserAvatar from '~v5/shared/UserAvatar';

import { UserAvatarsProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.Motion.steps.OutcomeStep.partials.MembersAvatars';

const UserAvatars: FC<UserAvatarsProps> = ({
  items,
  maxAvatarsToShow = 4,
  className,
  showRemainingAvatars = true,
  remainingAvatarsCount: remainingAvatarsCountProp,
  size = 'sm',
  withThickerBorder,
}) => {
  const slicedAvatars = items.slice(
    0,
    calculateLastSliceIndex(maxAvatarsToShow, items),
  );
  const remainingAvatarsCount =
    items.length > maxAvatarsToShow ? items.length - maxAvatarsToShow : 0;

  return (
    <ul className={clsx(className, 'flex')}>
      {slicedAvatars?.map((slicedAvatar: User) => (
        <li key={slicedAvatar.walletAddress} className="-ml-3">
          <UserAvatar
            user={slicedAvatar}
            size={size}
            className={clsx(
              'border-base-white bg-base-white border rounded-full',
              {
                'border-2': withThickerBorder,
              },
            )}
          />
        </li>
      ))}
      {!!(remainingAvatarsCountProp || remainingAvatarsCount) &&
        showRemainingAvatars && (
          <li className="flex items-center justify-center -ml-3 z-10">
            <div className="relative">
              <UserAvatar
                user={{
                  walletAddress: '0x0',
                }}
                size={size}
                className={clsx(
                  'border-base-white bg-base-white border rounded-full',
                  {
                    'border-2': withThickerBorder,
                  },
                )}
              />
              <div
                className={clsx(
                  'placeholder absolute inset-0 rounded-full z-[1] bg-gray-50 flex items-center justify-center text-5 text-gray-700 border border-base-white text-center',
                  {
                    'border-2': withThickerBorder,
                  },
                )}
              >
                {`+${remainingAvatarsCountProp || remainingAvatarsCount}`}
              </div>
            </div>
          </li>
        )}
    </ul>
  );
};

UserAvatars.displayName = displayName;

export default UserAvatars;
