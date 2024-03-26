import React from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/Table.tsx';

import { type MembersTableModel, membersColumns } from './tableFixtures.tsx';
import { SelectedMemberType, type SelectedMember } from './types.ts';

interface SelectedMembersProps {
  memberAddresses: string[];
}

const displayName = 'v5.common.CompletedAction.partials.SelectedMembers';

const SelectedMembers = ({ memberAddresses }: SelectedMembersProps) => {
  const { membersByAddress } = useMemberContext();

  const members = memberAddresses.reduce<SelectedMember[]>(
    (selectedMembers, address) => {
      const member = membersByAddress[address];

      if (member?.user) {
        return [
          ...selectedMembers,
          {
            type: SelectedMemberType.USER,
            data: member.user,
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

  return (
    <div className="mt-4">
      <h5 className="text-md font-bold mb-3">
        {formatText({ id: 'actionSidebar.manageVerifiedMembers.table.title' })}
      </h5>
      <Table<MembersTableModel>
        data={members}
        columns={membersColumns}
        verticalOnMobile
      />
    </div>
  );
};

SelectedMembers.displayName = displayName;
export default SelectedMembers;
