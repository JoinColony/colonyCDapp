import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { UpgradeColonyFormValues } from './consts';

export const upgradeColonyDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UpgradeColonyFormValues>
> = async (_, { colony, currentUser }) => {
  return (
    <>
      Upgrade Colony version from v{colony?.version || 0} to v
      {(colony?.version || 0) + 1}
      {currentUser?.profile?.displayName && (
        <>
          {' '}
          by{' '}
          <UserPopover
            userName={currentUser?.profile?.displayName}
            walletAddress={currentUser.walletAddress}
            aboutDescription={currentUser.profile?.bio || ''}
            user={currentUser}
          >
            <span className="text-blue-400 font-medium">
              {currentUser.profile.displayName}
            </span>
          </UserPopover>
        </>
      )}
    </>
  );
};
