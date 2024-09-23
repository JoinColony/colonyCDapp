import React, { type FC } from 'react';

import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow/index.ts';
import { formatText } from '~utils/intl.ts';
import useGetColonyAction from '~v5/common/ActionSidebar/hooks/useGetColonyAction.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import RelativeDate from '~v5/shared/RelativeDate/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { type PermissionSidebarProps } from '../types.ts';

const displayName = 'v5.PermissionSidebar';

const PermissionSidebar: FC<PermissionSidebarProps> = ({ transactionId }) => {
  const { action } = useGetColonyAction(transactionId);

  const { initiatorAddress, createdAt } = action || {};

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
        >
          {formatText({
            id: 'action.executed.permissions.description',
          })}
        </StatusText>
      }
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
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.member',
                    })}
                  </span>
                  <div className="ml-auto">
                    <UserPopover
                      size={20}
                      textClassName="text-sm"
                      walletAddress={initiatorAddress || ''}
                    />
                  </div>
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
              {createdAt && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.date',
                    })}
                  </span>
                  <span className="text-sm text-gray-900">
                    <RelativeDate value={createdAt} />
                  </span>
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

PermissionSidebar.displayName = displayName;

export default PermissionSidebar;
