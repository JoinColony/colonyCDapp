import clsx from 'clsx';
import React, { type FC } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { type User } from '~types/graphql.ts';
import { calculateLastSliceIndex } from '~utils/avatars.ts';
import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import { type UserAvatarsProps } from './types.ts';

const displayName = 'v5.shared.UserAvatars';

const UserAvatars: FC<UserAvatarsProps> = ({
  items,
  maxAvatarsToShow = 4,
  className,
  showRemainingAvatars = true,
  remainingAvatarsCount: remainingAvatarsCountProp,
  size = 20,
  withThickerBorder,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-shrink-0">
        {Array.from({ length: maxAvatarsToShow }).map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={clsx(
              'z-base -ml-2 overflow-hidden rounded-full border border-base-white',
              {
                'border-2': withThickerBorder,
              },
            )}
            style={{ width: size, height: size }}
          >
            <div className="skeleton" style={{ width: size, height: size }} />
          </div>
        ))}
      </div>
    );
  }

  const slicedAvatars = items.slice(
    0,
    calculateLastSliceIndex(maxAvatarsToShow, items),
  );
  const remainingAvatarsCount =
    items.length > maxAvatarsToShow ? items.length - maxAvatarsToShow : 0;

  return (
    <ul className={clsx(className, 'flex flex-shrink-0')}>
      {slicedAvatars?.map((slicedAvatar: User) => (
        <li key={slicedAvatar.walletAddress} className="-ml-2">
          <UserAvatar
            userAddress={slicedAvatar.walletAddress}
            userAvatarSrc={slicedAvatar.profile?.avatar ?? undefined}
            userName={slicedAvatar.profile?.displayName ?? undefined}
            size={size}
            className={clsx(
              'rounded-full border border-base-white bg-base-white transition-colors duration-normal group-hover:border-blue-400',
              {
                'border-2': withThickerBorder,
              },
            )}
          />
        </li>
      ))}
      {!!(remainingAvatarsCountProp || remainingAvatarsCount) &&
        showRemainingAvatars && (
          <li className="-ml-2 flex items-center justify-center">
            <div className="relative">
              <UserAvatar
                userAddress={ADDRESS_ZERO}
                size={size}
                className={clsx(
                  'rounded-full border border-base-white bg-base-white transition-colors duration-normal group-hover:border-blue-400',
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
