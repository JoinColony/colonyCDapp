import React, { useMemo } from 'react';

import Table from '~v5/common/Table/Table.tsx';

import { type SelectedMember } from '../../types.ts';

import { type MembersTableModel, membersColumns } from './tableFixtures.tsx';

interface MembersTableProps {
  members: SelectedMember[];
}

const displayName =
  'v5.common.CompletedAction.partials.SelectedMembers.partials.MembersTable';

const MembersTable = ({ members }: MembersTableProps) => {
  const columns = useMemo(() => membersColumns, []);

  return (
    <Table<MembersTableModel>
      data={members}
      columns={columns}
      verticalOnMobile
    />
  );
};

MembersTable.displayName = displayName;
export default MembersTable;
