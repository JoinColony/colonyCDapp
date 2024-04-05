import clsx from 'clsx';
import React, { type FC } from 'react';

import { type User } from '~types/graphql.ts';
import { calculateLastSliceIndex } from '~utils/avatars.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { type UserAvatarsProps } from './types.ts';

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
              'rounded-full border border-base-white bg-base-white',
              {
                'border-2': withThickerBorder,
              },
            )}
          />
        </li>
      ))}
      {!!(remainingAvatarsCountProp || remainingAvatarsCount) &&
        showRemainingAvatars && (
          <li className="-ml-3 flex items-center justify-center">
            <div className="relative">
              <UserAvatar
                user={{
                  walletAddress: '0x0',
                }}
                size={size}
                className={clsx(
                  'rounded-full border border-base-white bg-base-white',
                  {
                    'border-2': withThickerBorder,
                  },
                )}
              />
              <div
                className={clsx(
                  'placeholder absolute inset-0 z-base flex items-center justify-center rounded-full border border-base-white bg-gray-50 text-center text-gray-700 text-5',
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
