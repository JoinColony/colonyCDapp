import React, { useMemo } from 'react';

import Table from '~v5/common/Table/Table.tsx';

import {
  type MembersLoadingTableModel,
  membersLoadingColumns,
} from './tableFixtures.tsx';

const LOADING_ROWS = [
  { key: 'membersLoading.row.0' },
  { key: 'membersLoading.row.1' },
  { key: 'membersLoading.row.2' },
];
const displayName =
  'v5.common.CompletedAction.partials.SelectedMembers.partials.MembersLoadingTable';

const MembersLoadingTable = () => {
  const columns = useMemo(() => membersLoadingColumns, []);

  return (
    <Table<MembersLoadingTableModel>
      data={LOADING_ROWS}
      columns={columns}
      verticalOnMobile
    />
  );
};

MembersLoadingTable.displayName = displayName;
export default MembersLoadingTable;
