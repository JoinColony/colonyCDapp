import { getPaginationRowModel } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import { type MembersTableModel, membersColumns } from './tableFixtures.tsx';
import { SelectedMemberType, type SelectedMember } from './types.ts';

interface SelectedMembersProps {
  memberAddresses: string[];
}

const displayName = 'v5.common.CompletedAction.partials.SelectedMembers';

const SelectedMembers = ({ memberAddresses }: SelectedMembersProps) => {
  const { membersByAddress } = useMemberContext();
  const isMobile = useMobile();

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
      <h5 className="mb-3 text-md font-bold">
        {formatText({ id: 'actionSidebar.manageVerifiedMembers.table.title' })}
      </h5>
      <Table<MembersTableModel>
        className={clsx({
          'pb-4': members.length > 10,
        })}
        data={members}
        columns={membersColumns}
        layout={isMobile ? 'vertical' : 'horizontal'}
        overrides={{
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          },
          getPaginationRowModel: getPaginationRowModel(),
        }}
      />
    </div>
  );
};

SelectedMembers.displayName = displayName;
export default SelectedMembers;
