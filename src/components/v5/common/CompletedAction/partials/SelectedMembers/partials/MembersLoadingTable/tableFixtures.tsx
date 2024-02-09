import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { formatText } from '~utils/intl.ts';

export type MembersLoadingTableModel = { key: string };

const columnHelper = createColumnHelper<MembersLoadingTableModel>();

export const membersLoadingColumns: ColumnDef<MembersLoadingTableModel>[] = [
  columnHelper.display({
    id: 'memberLoadingItem',
    header: () =>
      formatText({
        id: 'actionSidebar.manageVerifiedMembers.table.column.members',
      }),
    cell: () => (
      <div className="flex items-center gap-2">
        <div className="rounded-full w-5 h-5 skeleton overflow-hidden" />
        <div className="w-20 h-4 skeleton" />
      </div>
    ),
  }),
];
