import React, { type FC } from 'react';

import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow/index.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { type PermissionSidebarProps } from '../types.ts';

const PermissionSidebar: FC<PermissionSidebarProps> = ({ transactionId }) => {
  const { action } = useGetColonyAction(transactionId);

  const { initiatorAddress } = action || {};

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
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
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.member',
                    })}
                  </span>
                  <UserPopover
                    size={20}
                    walletAddress={initiatorAddress || ''}
                  />
                </div>
              )}
              {initiatorAddress && (
                <div className="mt-2 flex items-center justify-between gap-2">
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
