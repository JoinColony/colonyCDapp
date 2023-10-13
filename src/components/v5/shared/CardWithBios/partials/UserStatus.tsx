import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import UserStatus from '~v5/common/Pills/UserStatus';
import Tooltip from '~shared/Extensions/Tooltip';
import { UserStatusComponentProps } from '../types';
import {
  ACTIVE_CONTRIBUTOR_PERCENT,
  DEDICATED_CONTRIBUTOR_PERCENT,
  TOP_CONTRIBUTOR_PERCENT,
  getIconName,
} from './consts';
import { formatText } from '~utils/intl';

const displayName = 'v5.CardWithBios.partials.UserStatusComponent';

const UserStatusComponent: FC<UserStatusComponentProps> = ({ userStatus }) => {
  const { formatMessage } = useIntl();
  const percentNum = useMemo(
    () =>
      (userStatus === 'top' && TOP_CONTRIBUTOR_PERCENT) ||
      (userStatus === 'dedicated' && DEDICATED_CONTRIBUTOR_PERCENT) ||
      (userStatus === 'active' && ACTIVE_CONTRIBUTOR_PERCENT) ||
      0,
    [userStatus],
  );

  return (
    <Tooltip
      interactive
      tooltipContent={
        <>
          <span className="mb-2.5">
            <span
              className="flex items-center text-center px-3 py-1.5 
            rounded-3xl border border-base-white h-[1.875rem] shrink-0 capitalize"
            >
              <Icon
                name={getIconName(userStatus)}
                appearance={{ size: 'extraTiny' }}
              />
              <span className="ml-1.5">{userStatus}</span>
            </span>
          </span>
          <span className="text-left normal-case">
            {formatMessage({ id: 'user.status.tooltip.desc' }, { percentNum })}
          </span>
        </>
      }
    >
      <UserStatus mode={userStatus} text={formatText({ id: userStatus })}>
        {userStatus}
      </UserStatus>
    </Tooltip>
  );
};

UserStatusComponent.displayName = displayName;

export default UserStatusComponent;
