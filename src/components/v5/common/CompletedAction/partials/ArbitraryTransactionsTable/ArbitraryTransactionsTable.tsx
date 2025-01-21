import React, { type FC } from 'react';

import {
  type ColonyActionArbitraryTransaction,
  type ColonyActionFragment,
} from '~gql';
import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import { useModifyArbitraryTransaction } from '../ArbitraryTransaction/hooks.ts';

import { displayName } from './const.ts';
import { useArbitraryTxsTableColumns } from './hooks.tsx';

export type ArbitraryTransactionsTableItem =
  ColonyActionArbitraryTransaction & {
    action: ColonyActionFragment;
  };
interface ArbitraryTransactionsTableProps {
  action: ColonyActionFragment;
}

const ArbitraryTransactionsTable: FC<ArbitraryTransactionsTableProps> = ({
  action,
}) => {
  const isTablet = useTablet();

  const columns = useArbitraryTxsTableColumns();

  const data = useModifyArbitraryTransaction(
    action.arbitraryTransactions || [],
    action,
  );

  return (
    <div className="pt-4">
      <h5 className="mb-4 text-2">
        {formatText({ id: 'actionSidebar.transactions' })}
      </h5>
      <Table<ArbitraryTransactionsTableItem>
        layout={isTablet ? 'vertical' : 'horizontal'}
        className="mb-6"
        columns={columns}
        borders={{
          type: 'unset',
          visible: true,
        }}
        rows={{ getRowClassName: () => 'align-top' }}
        data={data.length === 0 ? [{} as ArbitraryTransactionsTableItem] : data}
      />
    </div>
  );
};

ArbitraryTransactionsTable.displayName = displayName;

export default ArbitraryTransactionsTable;
