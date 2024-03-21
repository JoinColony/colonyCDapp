import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import { AvatarWithStatusBadge } from '~v5/shared/Avatar/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import ExtensionStatusBadge from '../Pills/ExtensionStatusBadge/ExtensionStatusBadge.tsx';

import { type MemberCardProps } from './types.ts';

const displayName = 'v5.common.SimpleMemberCard';

const SimpleMemberCard: FC<MemberCardProps> = ({
  userAvatarProps,
  meatBallMenuProps,
  isExtension,
}) => {
  const { userName, isVerified, ...restUserAvatarProps } = userAvatarProps;

  return (
    <div className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25">
      <div className="w-full flex items-center justify-between gap-4">
        {isExtension ? (
          <div className="flex items-center gap-2 justify-between truncate">
            <span className="inline-block w-full text-1 truncate">
              {userName}
            </span>
            <ExtensionStatusBadge
              mode="extension"
              text={formatText({ id: 'permissionsPage.extension' })}
            />
          </div>
        ) : (
          <UserInfoPopover
            {...userAvatarProps}
            withVerifiedBadge={false}
            popperOptions={{
              placement: 'bottom-start',
            }}
            className="flex items-center text-gray-900 gap-2.5 w-[calc(100%-18px-24px)]"
          >
            <AvatarWithStatusBadge
              size="sm"
              mode={undefined}
              isFilled
              {...restUserAvatarProps}
            />
            <p className="flex items-center justify-center text-center text-1 truncate">
              <span className="truncate inline-block w-full">{userName}</span>
              {isVerified && (
                <SealCheck
                  size={14}
                  className="text-blue-400 ml-1 flex-shrink-0"
                />
              )}
            </p>
          </UserInfoPopover>
        )}
        <div className="flex-shrink-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
    </div>
  );
};

SimpleMemberCard.displayName = displayName;

export default SimpleMemberCard;
