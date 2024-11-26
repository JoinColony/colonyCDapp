import { Binoculars } from '@phosphor-icons/react';
import {
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useMobile } from '~hooks/index.ts';
import { type BridgeDrain } from '~types/graphql.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';

import FiatTransferDescription from './FiatTransferDescription.tsx';
import {
  useFiatTransfersData,
  useFiatTransfersTableColumns,
} from './hooks.tsx';

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

  const isMobile = useMobile();
  const { sortedData, loading } = useFiatTransfersData(sorting);

  const columns = useFiatTransfersTableColumns(loading);

  return (
    <div>
      <TableHeader title={formatMessage(MSG.tableTitle)} />
      <Table<BridgeDrain>
        columns={columns}
        data={loading ? Array(3).fill({}) : sortedData}
        state={{
          columnVisibility: isMobile
            ? {
                createdAt: false,
                receipt: false,
              }
            : {
                expander: false,
              },
          sorting,
        }}
        getRowId={(row) => row.id}
        initialState={{ pagination: { pageSize: 10 } }}
        showPageNumber={sortedData.length >= 10}
        onSortingChange={setSorting}
        getSortedRowModel={getSortedRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        getRowCanExpand={() => isMobile}
        renderSubComponent={({ row }) => (
          <FiatTransferDescription actionRow={row} loading={loading} />
        )}
        className="pb-5 [&_td:nth-child(1)>div]:font-medium [&_td:nth-child(1)>div]:text-gray-900 [&_td:nth-child(2)>div]:text-gray-600 [&_tr.expanded-below:not(last-child)_td>*:not(.expandable)]:!pb-2 [&_tr.expanded-below_td]:border-none"
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
