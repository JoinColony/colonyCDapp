import React, { type FC } from 'react';

import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow/index.ts';
import { formatText } from '~utils/intl.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import FormatDate from '../FormatDate/FormatDate.tsx';

import { type ActionWithPermissionsInfoProps } from './types.ts';

const ActionWithPermissionsInfo: FC<ActionWithPermissionsInfoProps> = ({
  action,
  title,
}) => {
  if (!action) {
    return null;
  }

  const { createdAt, initiatorAddress } = action ?? {};

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
          iconSize={16}
          iconClassName="text-gray-500"
        >
          {title ||
            formatText({
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
                <>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText({
                        id: 'action.executed.permissions.member',
                      })}
                    </span>
                    <div className="ml-auto">
                      <UserPopover
                        size={18}
                        textClassName="text-sm"
                        walletAddress={initiatorAddress}
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText({
                        id: 'action.executed.permissions.permission',
                      })}
                    </span>
                    <PermissionRow contributorAddress={initiatorAddress} />
                  </div>
                </>
              )}
              {createdAt && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.permissions.date',
                    })}
                  </span>
                  <span className="text-sm text-gray-900">
                    <FormatDate value={createdAt} />
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

export default ActionWithPermissionsInfo;
