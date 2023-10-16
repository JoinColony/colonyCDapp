import React from 'react';
import { DeepPartial } from 'utility-types';
import { ColonyFragment } from '~gql';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import UserPopover from '~v5/shared/UserPopover';
import { EditTeamFormValues } from './consts';

const getTeamName = (
  teamId: string | undefined,
  colony: ColonyFragment | undefined,
): string | undefined =>
  colony?.domains?.items.find((domain) => domain?.nativeId === Number(teamId))
    ?.metadata?.name;

export const editTeamDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EditTeamFormValues>
> = async ({ team }, { currentUser, colony }) => {
  const currentTeamName = getTeamName(team, colony);

  return (
    <>
      Change {currentTeamName ? `${currentTeamName} team` : 'team'} details
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
