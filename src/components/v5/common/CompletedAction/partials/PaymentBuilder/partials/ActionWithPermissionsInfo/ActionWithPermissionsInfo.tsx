import { isToday, isYesterday } from 'date-fns';
import React, { type FC } from 'react';
import { FormattedDate, defineMessages } from 'react-intl';

import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow/index.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type ActionWithPermissionsInfoProps } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.ActionWithPermissionsInfoProps';

const MSG = defineMessages({
  todayAt: {
    id: `${displayName}.todayAt`,
    defaultMessage: 'Today at',
  },
  yestardayAt: {
    id: `${displayName}.yestardayAt`,
    defaultMessage: 'Yesterday at',
  },
  at: {
    id: `${displayName}.at`,
    defaultMessage: 'at',
  },
});

const formatDate = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (isToday(date)) {
    return (
      <>
        {formatText(MSG.todayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  if (isYesterday(date)) {
    return (
      <>
        {formatText(MSG.yestardayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  return (
    <>
      {getFormattedDateFrom(value)} {formatText(MSG.at)}{' '}
      <FormattedDate value={date} hour="numeric" minute="numeric" />
    </>
  );
};

const ActionWithPermissionsInfo: FC<ActionWithPermissionsInfoProps> = ({
  userAdddress,
  createdAt,
}) => {
  const formattedDate = formatDate(createdAt);

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText({
          id: 'action.executed.permissions.description',
        }),
        textClassName: 'text-4 text-gray-900',
        iconAlignment: 'top',
        iconSize: 16,
        iconClassName: 'text-gray-500',
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
              {userAdddress && (
                <>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText({
                        id: 'action.executed.permissions.member',
                      })}
                    </span>
                    <UserPopover size={18} walletAddress={userAdddress || ''} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText({
                        id: 'action.executed.permissions.permission',
                      })}
                    </span>
                    <PermissionRow contributorAddress={userAdddress} />
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
                  <span className="text-sm text-gray-900">{formattedDate}</span>
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
