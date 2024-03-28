import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import { AvatarWithStatusBadge } from '~v5/shared/Avatar/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import ExtensionStatusBadge from '../Pills/ExtensionStatusBadge/ExtensionStatusBadge.tsx';

import { type MemberCardProps } from './types.ts';

const displayName = 'v5.common.MemberCard';

const MemberCard: FC<MemberCardProps> = ({
  userAvatarProps,
  meatBallMenuProps,
  reputation,
  role,
  isSimple,
  isExtension,
}) => {
  const { userName, isVerified, mode, ...restUserAvatarProps } =
    userAvatarProps;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div
        className={clsx('flex w-full items-center', {
          'justify-between gap-4': isSimple,
          'relative flex-grow flex-col justify-center': !isSimple,
        })}
      >
        {isExtension ? (
          <div className="flex items-center justify-between gap-2 truncate">
            <span className="inline-block w-full truncate text-1">
              {userName}
            </span>
            <ExtensionStatusBadge
              mode="extension"
              text={formatText({ id: 'permissionsPage.extension' })}
            />
          </div>
        ) : (
          <UserPopover
            {...userAvatarProps}
            withVerifiedBadge={false}
            isContributorsList={!isSimple}
            className={clsx('flex items-center text-gray-900', {
              'w-[calc(100%-18px-24px)] gap-2.5': isSimple,
              'w-full flex-grow flex-col items-center justify-between gap-2':
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
              <span className="inline-block w-full truncate">{userName}</span>
              {isVerified && (
                <SealCheck
                  size={14}
                  className="ml-1 flex-shrink-0 text-blue-400"
                />
              )}
            </p>
          </UserPopover>
        )}
        <div
          className={clsx({
            'absolute right-0 top-0': !isSimple,
            'flex-shrink-0': isSimple,
          })}
        >
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {(reputation !== undefined || role) && !isSimple && (
        <div className="mt-[.6875rem] flex w-full items-center justify-between gap-4 border-t border-t-gray-200 pt-[.6875rem]">
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
