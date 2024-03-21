import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName = 'v5.UserInfoPopover.partials.UserNotVerified';

export interface UserNotVerifiedProps {
  description?: React.ReactNode;
}
// rename to UserNotVerified??
const UserNotVerified: FC<UserNotVerifiedProps> = ({ description }) => {
  return (
    <NotificationBanner
      status="warning"
      description={description}
      callToAction={
        <button type="button">
          {/* @TODO: add action */}
          {formatText({ id: 'add.verified.member' })}
        </button>
      }
      className="!border-warning-400 text-left text-warning-400"
      descriptionClassName="text-warning-400 font-semibold pb-3 border-b border-warning-200"
    >
      <span className="text-sm">
        {formatText({ id: 'user.not.verified.warning' })}
      </span>
    </NotificationBanner>
  );
};

UserNotVerified.displayName = displayName;

export default UserNotVerified;
