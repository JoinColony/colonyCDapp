import React, { type FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';

import { type UserStatusComponentProps } from '../types.ts';

import {
  ACTIVE_CONTRIBUTOR_PERCENT,
  DEDICATED_CONTRIBUTOR_PERCENT,
  TOP_CONTRIBUTOR_PERCENT,
  getIcon,
} from './consts.ts';

const displayName = 'v5.CardWithBios.partials.UserStatusComponent';

const UserStatusComponent: FC<UserStatusComponentProps> = ({
  userStatus,
  pillSize,
}) => {
  const { formatMessage } = useIntl();
  const percentNum = useMemo(
    () =>
      (userStatus === 'top' && TOP_CONTRIBUTOR_PERCENT) ||
      (userStatus === 'dedicated' && DEDICATED_CONTRIBUTOR_PERCENT) ||
      (userStatus === 'active' && ACTIVE_CONTRIBUTOR_PERCENT) ||
      0,
    [userStatus],
  );

  const Icon = getIcon(userStatus);

  return (
    <Tooltip
      interactive
      tooltipContent={
        <>
          <span className="mb-2.5">
            <span
              className="flex h-[1.875rem] shrink-0 items-center rounded-3xl border
            border-base-white px-3 py-1.5 text-center text-sm capitalize"
            >
              {Icon ? <Icon size={12} /> : null}
              <span className="ml-1.5 text-sm">{userStatus}</span>
            </span>
          </span>
          <span className="text-left normal-case">
            {formatMessage({ id: 'user.status.tooltip.desc' }, { percentNum })}
          </span>
        </>
      }
    >
      <UserStatus
        mode={userStatus}
        text={formatText({ id: userStatus })}
        pillSize={pillSize}
      >
        {userStatus}
      </UserStatus>
    </Tooltip>
  );
};

UserStatusComponent.displayName = displayName;

export default UserStatusComponent;
