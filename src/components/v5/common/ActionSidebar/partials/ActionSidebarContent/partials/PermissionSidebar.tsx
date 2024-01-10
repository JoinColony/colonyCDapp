import React, { FC } from 'react';

import { useGetColonyAction } from '~common/ColonyActions';
import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow';
import { formatText } from '~utils/intl';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

import { PermissionSidebarProps } from '../types';

const PermissionSidebar: FC<PermissionSidebarProps> = ({ transactionId }) => {
  const { action } = useGetColonyAction(transactionId);

  const { initiatorAddress } = action || {};

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: 'info',
        children: formatText({
          id: 'action.executed.permissions.description',
        }),
        iconAlignment: 'top',
        textClassName: 'text-4',
      }}
      sections={[
        {
          key: '1',
          content: (
            <>
              <h4 className="text-1">
                {formatText({
                  id: 'action.executed.permissions.overview',
                })}
              </h4>
              {initiatorAddress && (
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.member',
                    })}
                  </span>
                  <UserAvatarPopover walletAddress={initiatorAddress || ''} />
                </div>
              )}
              {initiatorAddress && (
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.permission',
                    })}
                  </span>
                  <PermissionRow contributorAddress={initiatorAddress} />
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default PermissionSidebar;
