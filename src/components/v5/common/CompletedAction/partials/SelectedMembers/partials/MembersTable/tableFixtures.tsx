import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { type User } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import Avatar from '~v5/shared/Avatar/index.ts';

export type MembersTableModel = User;

const columnHelper = createColumnHelper<User>();

export const membersColumns: ColumnDef<User>[] = [
  columnHelper.display({
    id: 'members',
    header: () =>
      formatText({
        id: 'actionSidebar.manageVerifiedMembers.table.column.members',
      }),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar
          size="xs"
          avatar={row.original.profile?.avatar ?? undefined}
          seed={row.original.walletAddress}
        />
        <p className="text-md font-medium text-gray-900">
          {row.original.profile?.displayName ?? row.original.walletAddress}
        </p>
      </div>
    ),
  }),
];
