import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import ExtensionStatusBadge from '../Pills/ExtensionStatusBadge/ExtensionStatusBadge.tsx';

import { type SimpleMemberCardProps } from './types.ts';

const displayName = 'v5.common.SimpleMemberCard';

// @TODO lets get rif of isExtension and try to create a separate component for that
const SimpleMemberCard: FC<SimpleMemberCardProps> = ({
  userAvatarProps,
  meatBallMenuProps,
  isExtension,
}) => {
  const { userName, walletAddress } = userAvatarProps;

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
          <UserPopover
            walletAddress={walletAddress}
            size={30}
            popperOptions={{
              placement: 'bottom-start',
            }}
          />
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
