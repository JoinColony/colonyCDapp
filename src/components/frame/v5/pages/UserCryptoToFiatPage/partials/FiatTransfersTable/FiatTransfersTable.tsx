import { Binoculars } from '@phosphor-icons/react';
import {
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';

import {
  useFiatTransfersData,
  useFiatTransfersTableColumns,
} from './hooks.tsx';

import type { FormattedTransfer } from './types.ts';

const displayName = 'v5.pages.FiatTransfersTable';

const MSG = defineMessages({
  tableTitle: {
    id: `${displayName}.tableTitle`,
    defaultMessage: 'Transfer history',
  },
  emptyTitle: {
    id: `${displayName}.emptyTitle`,
    defaultMessage: 'No transfers to display',
  },
  emptyDescription: {
    id: `${displayName}.emptyDescription`,
    defaultMessage:
      'There have not been any crypto to fiat transfers created yet, or we are not able to load them at the moment.',
  },
});

const FiatTransfersTable = () => {
  const { formatMessage } = useIntl();
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: 'createdAt' },
  ]);
  const { sortedData, loading } = useFiatTransfersData(sorting);

  const columns = useFiatTransfersTableColumns(loading);

  return (
    <div>
      <TableHeader title={formatMessage(MSG.tableTitle)} />
      <Table<FormattedTransfer>
        columns={columns}
        data={loading ? Array(3).fill({}) : sortedData}
        state={{ sorting }}
        getRowId={(row) => row.id}
        initialState={{ pagination: { pageSize: 10 } }}
        showPageNumber={sortedData.length >= 10}
        onSortingChange={setSorting}
        getSortedRowModel={getSortedRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        className="[&_td:nth-child(1)>div]:font-medium [&_td:nth-child(1)>div]:text-gray-900 [&_td:nth-child(2)>div]:text-gray-600"
        emptyContent={
          !sortedData.length &&
          !loading && (
            <EmptyContent
              icon={Binoculars}
              title={MSG.emptyTitle}
              description={MSG.emptyDescription}
              withoutButtonIcon
              className="px-6 pb-9 pt-10"
            />
          )
        }
      />
    </div>
  );
};

FiatTransfersTable.displayName = displayName;

export default FiatTransfersTable;
