import React, { FC } from 'react';

import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { UserPopoverAdditionalContentProps } from './types.ts';

const displayName = 'v5.UserPopoverAdditionalContent';

const UserPopoverAdditionalContent: FC<UserPopoverAdditionalContentProps> = ({
  description,
}) => {
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
      className="text-left text-warning-400 !border-warning-400"
      descriptionClassName="text-warning-400 font-semibold pb-3 border-b border-warning-200"
    >
      <span className="text-sm">
        {formatText({ id: 'user.not.verified.warning' })}
      </span>
    </NotificationBanner>
  );
};

UserPopoverAdditionalContent.displayName = displayName;

export default UserPopoverAdditionalContent;
