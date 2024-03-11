import React from 'react';

import useUsersByAddresses from '~hooks/useUsersByAddresses.ts';
import { formatText } from '~utils/intl.ts';

import MembersLoadingTable from './partials/MembersLoadingTable/MembersLoadingTable.tsx';
import MembersTable from './partials/MembersTable/MembersTable.tsx';
import { SelectedMemberType, type SelectedMember } from './types.ts';

interface SelectedMembersProps {
  memberAddresses: string[];
}

const displayName = 'v5.common.CompletedAction.partials.SelectedMembers';

const SelectedMembers = ({ memberAddresses }: SelectedMembersProps) => {
  const { error, users } = useUsersByAddresses(memberAddresses);

  if (error) {
    console.warn('Error while loading users', error);
    return null;
  }

  const getContent = () => {
    // We display users when we have them, so when we refetch queries in the background,
    // the table doesn't go into loading state
    if (users) {
      const members = memberAddresses.reduce<SelectedMember[]>(
        (selectedMembers, address) => {
          const existingUser = users.find(
            (user) => user?.walletAddress === address,
          );

          if (existingUser) {
            return [
              ...selectedMembers,
              {
                type: SelectedMemberType.USER,
                data: existingUser,
              },
            ];
          }

          return [
            ...selectedMembers,
            {
              type: SelectedMemberType.ADDRESS,
              data: {
                walletAddress: address,
              },
            },
          ];
        },
        [],
      );

      return <MembersTable members={members} />;
    }

    return <MembersLoadingTable />;
  };

  return (
    <div className="mt-4">
      <h5 className="text-md font-bold mb-3">
        {formatText({ id: 'actionSidebar.manageVerifiedMembers.table.title' })}
      </h5>
      {getContent()}
    </div>
  );
};

SelectedMembers.displayName = displayName;
export default SelectedMembers;
