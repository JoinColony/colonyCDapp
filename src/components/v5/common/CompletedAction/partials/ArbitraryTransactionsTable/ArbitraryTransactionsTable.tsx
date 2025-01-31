import React, { type FC } from 'react';

import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import { type CompletedArbitraryTransactions } from '../ArbitraryTransaction/hooks.ts';

import { displayName } from './const.ts';
import { useArbitraryTxsTableColumns } from './hooks.tsx';

interface ArbitraryTransactionsTableProps {
  data: CompletedArbitraryTransactions[];
}

const ArbitraryTransactionsTable: FC<ArbitraryTransactionsTableProps> = ({
  data,
}) => {
  const isTablet = useTablet();

  const columns = useArbitraryTxsTableColumns();

  return (
    <div className="pt-4">
      <h5 className="mb-4 text-2">
        {formatText({ id: 'actionSidebar.transactions' })}
      </h5>
      <Table<CompletedArbitraryTransactions>
        layout={isTablet ? 'vertical' : 'horizontal'}
        className="mb-6"
        columns={columns}
        borders={{
          type: 'unset',
          visible: true,
        }}
        rows={{ getRowClassName: () => 'align-top' }}
        data={data.length === 0 ? [{} as CompletedArbitraryTransactions] : data}
      />
    </div>
  );
};

ArbitraryTransactionsTable.displayName = displayName;

export default ArbitraryTransactionsTable;
