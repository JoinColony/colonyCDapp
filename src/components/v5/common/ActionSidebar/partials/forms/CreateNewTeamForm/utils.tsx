import React from 'react';
import { DeepPartial } from 'utility-types';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { CreateNewTeamFormValues } from './consts';

export const createNewTeamDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<CreateNewTeamFormValues>
> = async ({ teamName }, { currentUser }) => {
  return (
    <>
      Create new {teamName ? `${teamName} team` : 'team'}
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
            <span className="text-gray-900">
              {currentUser.profile.displayName}
            </span>
          </UserPopover>
        </>
      )}
    </>
  );
};
