import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { formatText } from '~utils/intl.ts';
import Avatar from '~v5/shared/Avatar/index.ts';

import { SelectedMemberType, type SelectedMember } from '../../types.ts';

export type MembersTableModel = SelectedMember;

const columnHelper = createColumnHelper<SelectedMember>();

export const membersColumns: ColumnDef<SelectedMember>[] = [
  columnHelper.display({
    id: 'members',
    header: () =>
      formatText({
        id: 'actionSidebar.manageVerifiedMembers.table.column.members',
      }),
    cell: ({ row }) => {
      if (row.original.type === SelectedMemberType.USER) {
        return (
          <div className="flex items-center gap-2">
            <Avatar
              size="xs"
              avatar={row.original.data.profile?.avatar ?? undefined}
              seed={row.original.data.walletAddress}
            />
            <p className="text-md font-medium text-gray-900">
              {row.original.data.profile?.displayName ??
                row.original.data.walletAddress}
            </p>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Avatar size="xs" seed={row.original.data.walletAddress} />
          <p className="text-md font-medium text-gray-900">
            {row.original.data.walletAddress}
          </p>
        </div>
      );
    },
  }),
];
