import { Binoculars } from '@phosphor-icons/react';
import { getPaginationRowModel } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import { Table } from '~v5/common/Table/Table.tsx';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import {
  useStreamingPaymentTable,
  useStreamingTableColumns,
} from './hooks.tsx';
import { type StreamingTableFieldModel } from './types.ts';
import { useRenderSubComponent } from './useRenderSubComponent.tsx';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingPaymentsTable';

const StreamingPaymentsTable = () => {
  const { searchFilter, selectedFiltersCount } = useStreamingFiltersContext();
  const { items, loading } = useStreamingPaymentTable();

  const columns = useStreamingTableColumns(loading);
  const renderSubComponent = useRenderSubComponent(loading);

  return (
    <Table<StreamingTableFieldModel>
      className={clsx(
        'overflow-hidden [&_table]:table-auto [&_table]:overflow-hidden lg:[&_table]:table-fixed [&_tbody_td]:h-[57px] [&_td:first-child]:pl-0 [&_td:last-child]:pr-0 [&_td]:border-gray-100 [&_td]:pr-0 [&_th]:border-none [&_tr.expanded-below+tr_td]:pl-0 [&_tr.expanded-below+tr_td]:pr-0 [&_tr.expanded-below>td]:border-gray-200 [&_tr.expanded-below_td]:h-[57px] [&_tr.expanded-item_td]:h-auto [&_tr.table-item:hover_td]:bg-gray-25 [&_tr:hover_.toggler]:text-blue-400 [&_tr:not(:last-child)_td]:border-b',
        { 'pb-6': items.length > 10 },
      )}
      data={loading ? Array(4).fill({}) : items}
      columns={columns}
      renderCellWrapper={(_, content) => content}
      rows={{
        canExpand: () => true,
        renderSubComponent,
      }}
      pagination={{
        disabled: loading,
      }}
      overrides={{
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
          pagination: {
            pageSize: 10,
            pageIndex: 0,
          },
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
