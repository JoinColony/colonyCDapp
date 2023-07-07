import React, { FC } from 'react';

import Icon from '~shared/Icon';
import UserStatus from '~v5/common/Pills/UserStatus';
import Tooltip from '~shared/Extensions/Tooltip';
import { UserStatusComponentProps } from '../types';

const displayName = 'v5.CardWithBios.partials.UserStatusComponent';

const UserStatusComponent: FC<UserStatusComponentProps> = ({
  userStatus,
  userStatusTooltipDetails,
}) => (
  <UserStatus mode={userStatus}>
    <Tooltip
      tooltipContent={
        <>
          <span className="mb-2.5">
            <span
              className={`flex items-center text-center px-3 py-1.5 
            rounded-3xl border border-base-white h-[1.875rem] shrink-0`}
            >
              <Icon
                name={userStatusTooltipDetails.name}
                appearance={{ size: 'extraTiny' }}
              />
              <span className="ml-1.5">{userStatusTooltipDetails.text}</span>
            </span>
          </span>
          <span className="text-left normal-case">
            {userStatusTooltipDetails.description}
          </span>
        </>
      }
    >
      {userStatus}
    </Tooltip>
  </UserStatus>
);

UserStatusComponent.displayName = displayName;

export default UserStatusComponent;
