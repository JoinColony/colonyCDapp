import React, { useMemo } from 'react';

import { type User } from '~types/graphql.ts';
import Table from '~v5/common/Table/Table.tsx';

import { type MembersTableModel, membersColumns } from './tableFixtures.tsx';

interface MembersTableProps {
  members: User[];
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
