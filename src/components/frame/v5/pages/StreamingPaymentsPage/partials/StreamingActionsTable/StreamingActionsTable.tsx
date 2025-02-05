import { ArrowCircleDown } from '@phosphor-icons/react';
import {
  type SortingState,
  type Row,
  getPaginationRowModel,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useState, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile, useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import {
  EXPANDER_COLUMN_ID,
  MEATBALL_MENU_COLUMN_ID,
} from '~v5/common/Table/consts.ts';
import { Table } from '~v5/common/Table/Table.tsx';

import {
  type StreamingTableFieldModel,
  type StreamingActionTableFieldModel,
} from '../StreamingPaymentsTable/types.ts';

import { useStreamingActionsTableColumns } from './hooks.tsx';
import useRenderSubComponent from './partials/StreamingActionMobileItem/hooks.tsx';
import useRenderRowLink from './useRenderRowLink.tsx';
import { orderActions } from './utils.ts';

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingActionsTable.StreamingActionsTable';

const MSG = defineMessages({
  loadMoreStreams: {
    id: `${displayName}.loadMoreStreams`,
    defaultMessage: 'Load more streams',
  },
});

interface StreamingActionsTableProps {
  actionRow: Row<StreamingTableFieldModel>;
  isLoading: boolean;
}

const StreamingActionsTable: FC<StreamingActionsTableProps> = ({
  actionRow,
  isLoading,
}) => {
  const { colony } = useColonyContext();

  const { original } = actionRow;
  const isTablet = useTablet();
  const isMobile = useMobile();
  const columns = useStreamingActionsTableColumns();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'totalStreamedAmount',
      desc: true,
    },
  ]);

  const renderSubComponent = useRenderSubComponent();
  const renderRowLink = useRenderRowLink(isLoading);

  const orderedActions = orderActions(original.actions, sorting, colony);

  return (
    <Table<StreamingActionTableFieldModel>
      data={isLoading ? [] : orderedActions}
      columns={columns}
      renderCellWrapper={isMobile ? undefined : renderRowLink}
      className={clsx(
        'rounded-none border-none [&_td:first-child]:!pl-0 [&_td:nth-child(2)>a]:px-2 [&_td>a]:px-[1.125rem] [&_td>a]:py-2 [&_td>div]:px-[1.125rem] [&_td>div]:py-2 [&_td]:border-b [&_td]:border-gray-100 [&_td]:!pr-0 [&_th:not(:first-child)]:sm:text-left [&_th:nth-child(2)]:px-2 [&_th]:!rounded-none [&_th]:!border-b [&_th]:!border-solid [&_th]:border-gray-200 [&_tr.expanded-below_td]:border-none sm:[&_tr:hover]:bg-gray-25 [&_tr:last-child_td]:border-none',
        {
          '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[100px] [&_td:not(:first-child)>a]:p-0 [&_td:nth-child(2)>a]:items-end [&_td:nth-child(2)>a]:pr-8 [&_th:not(:first-child)]:p-0 [&_th:nth-child(2)]:pr-8 [&_th:nth-child(2)]:text-right':
            !isTablet,
        },
      )}
      overrides={{
        enableSorting: true,
        initialState: {
          pagination: {
            pageIndex: 0,
            pageSize: 1000000,
          },
        },
        loadMoreProps: {
          renderContent: (loadMore) => (
            <button
              type="button"
              onClick={loadMore}
              className="flex h-full w-full items-center justify-center gap-1 transition-colors text-3 hover:text-blue-400"
            >
              <ArrowCircleDown size={16} />
              {formatText(MSG.loadMoreStreams)}
            </button>
          ),
          itemsPerPage: 5,
        },
        state: {
          sorting,
          columnVisibility: isMobile
            ? {
                title: true,
                streamed: true,
                token: true,
                team: false,
                status: false,
                [MEATBALL_MENU_COLUMN_ID]: false,
              }
            : {
                [EXPANDER_COLUMN_ID]: false,
              },
        },
        getRowId: (row) => row.transactionId,
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
      }}
      pagination={{
        visible: false,
      }}
      rows={{
        canExpand: () => true,
        renderSubComponent,
      }}
      tableClassName="border-none"
    />
  );
};

StreamingActionsTable.displayName = displayName;

export default StreamingActionsTable;
