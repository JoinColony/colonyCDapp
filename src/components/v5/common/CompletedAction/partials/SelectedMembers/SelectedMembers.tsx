import React from 'react';

import useUsersByAddresses from '~hooks/useUsersByAddresses.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';

import MembersLoadingTable from './partials/MembersLoadingTable/MembersLoadingTable.tsx';
import MembersTable from './partials/MembersTable/MembersTable.tsx';

interface SelectedMembersProps {
  members: string[];
}

const displayName = 'v5.common.CompletedAction.partials.SelectedMembers';

const SelectedMembers = ({ members }: SelectedMembersProps) => {
  const { error, loading, users } = useUsersByAddresses(members);

  if (error) {
    console.warn('Error while loading users', error);
    return null;
  }

  const getContent = () => {
    if (loading || !users) {
      return <MembersLoadingTable />;
    }

    return <MembersTable members={users.filter(notNull)} />;
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
