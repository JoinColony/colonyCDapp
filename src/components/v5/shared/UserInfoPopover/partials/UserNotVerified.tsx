import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import {
  ActionSidebarMode,
  useActionSidebarContext,
} from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { ManageVerifiedMembersOperation } from '~types';
import { formatText } from '~utils/intl.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName = 'v5.UserInfoPopover.partials.UserNotVerified';

export interface UserNotVerifiedProps {
  description?: React.ReactNode;
  walletAddress: string;
  onClick?: () => void;
}

const UserNotVerified: FC<UserNotVerifiedProps> = ({
  description,
  walletAddress,
  onClick,
}) => {
  const { isActionSidebarOpen, showActionSidebar, hideActionSidebar } =
    useActionSidebarContext();

  return (
    <NotificationBanner
      status="warning"
      description={description}
      callToAction={
        <button
          type="button"
          onClick={() => {
            const timeout = isActionSidebarOpen ? 500 : 0;

            if (isActionSidebarOpen) {
              hideActionSidebar();
            }

            setTimeout(() => {
              onClick?.();
              showActionSidebar(ActionSidebarMode.CreateAction, {
                action: Action.ManageVerifiedMembers,
                initialValues: {
                  members: [{ value: walletAddress }],
                  manageMembers: ManageVerifiedMembersOperation.Add,
                },
              });
            }, timeout);
          }}
        >
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
