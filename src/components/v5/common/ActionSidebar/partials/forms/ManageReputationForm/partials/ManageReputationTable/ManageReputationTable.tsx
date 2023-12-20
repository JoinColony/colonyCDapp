import React, { FC } from 'react';
import Table from '~v5/common/Table';
import { useManageReputationTableColumns } from './hooks';

const ManageReputationTable: FC = () => {
  const columns = useManageReputationTableColumns('amount');

  return (
    <Table
      columns={columns}
      data={[
        {
          key: '1',
        },
      ]}
    />
  );
};

export default ManageReputationTable;
