import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import MaskedAddress from '~shared/MaskedAddress/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.CurrentUser';
const CurrentUser = () => {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  return (
    <UserPopover
      userName={user.profile?.displayName}
      walletAddress={user.walletAddress}
      aboutDescription={user.profile?.bio || ''}
      user={user}
      wrapperClassName="!inline-flex"
      withVerifiedBadge={false}
    >
      <span className="text-gray-900">
        {user.profile ? (
          user.profile.displayName
        ) : (
          <MaskedAddress address={user.walletAddress} />
        )}
      </span>
    </UserPopover>
  );
};

CurrentUser.displayName = displayName;
export default CurrentUser;
