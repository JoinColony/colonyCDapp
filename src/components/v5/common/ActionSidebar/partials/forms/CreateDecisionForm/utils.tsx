import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { CreateDecisionFormValues } from './consts';

export const createDecisionDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<CreateDecisionFormValues>
> = async (_, { currentUser }) => {
  return (
    <>
      New decision
      {currentUser?.profile?.displayName && (
        <>
          by{' '}
          <UserPopover
            userName={currentUser?.profile?.displayName}
            walletAddress={currentUser.walletAddress}
            aboutDescription={currentUser.profile?.bio || ''}
            user={currentUser}
          >
            <span className="text-blue-400">
              {currentUser.profile.displayName}
            </span>
          </UserPopover>
        </>
      )}
    </>
  );
};
