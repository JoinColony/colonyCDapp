import { Binoculars } from '@phosphor-icons/react';
import { getPaginationRowModel } from '@tanstack/react-table';
import React from 'react';

import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import Table from '~v5/common/Table/Table.tsx';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import {
  useRenderSubComponent,
  useStreamingPaymentTable,
  useStreamingTableColumns,
} from './hooks.tsx';
import { type StreamingTableFieldModel } from './types.ts';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable';

const StreamingPaymentsTable = () => {
  const { searchFilter, selectedFiltersCount } = useStreamingFiltersContext();
  const { items, loading } = useStreamingPaymentTable();

  const columns = useStreamingTableColumns(loading);
  const renderSubComponent = useRenderSubComponent();

  return (
    <Table<StreamingTableFieldModel>
      className="[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:border-gray-100 [&_td]:pr-4 [&_th]:border-none [&_tr.expanded-below+tr_td]:pl-0 [&_tr.expanded-below+tr_td]:pr-0 [&_tr.expanded-below_td]:border-gray-200 [&_tr:not(:last-child)_td]:border-b"
      data={loading ? Array(4).fill({}) : items}
      columns={columns}
      renderCellWrapper={(_, content) => content}
      withBorder={false}
      renderSubComponent={renderSubComponent}
      paginationDisabled={loading}
      showTotalPagesNumber={false}
      getPaginationRowModel={getPaginationRowModel()}
      initialState={{
        pagination: {
          pageSize: 10,
        },
      }}
      emptyContent={
        <EmptyContent
          icon={Binoculars}
          title={{ id: 'streamingPayment.table.emptyContent.title' }}
          description={{
            id:
              searchFilter || selectedFiltersCount
                ? 'streamingPayment.table.emptyContent.search.description'
                : 'streamingPayment.table.emptyContent.description',
          }}
          withoutButtonIcon
          className="px-6 pb-9 pt-10"
        />
      }
    />
  );
};

StreamingPaymentsTable.displayName = displayName;

export default StreamingPaymentsTable;
