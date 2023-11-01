import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { EnterRecoveryModeFormValues } from './consts';

export const enterRecoveryModeDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EnterRecoveryModeFormValues>
> = async (_, { currentUser }) => {
  return (
    <>
      Enter recovery mode
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
