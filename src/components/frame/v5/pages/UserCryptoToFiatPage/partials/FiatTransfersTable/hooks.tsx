import { ArrowSquareOut, CaretDown } from '@phosphor-icons/react';
import {
  type ColumnDef,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { SupportedCurrencies, useGetUserDrainsQuery } from '~gql';
import { useMobile } from '~hooks';
import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { type BridgeDrain } from '~types/graphql.ts';
import { getFormattedAmount } from '~utils/getFormattedAmount.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { EXPANDER_COLUMN_ID } from '~v5/common/Table/consts.ts';

import { FiatTransferState, statusPillScheme, STATUS_MSGS } from './consts.ts';

const stateOrder: Record<FiatTransferState, number> = {
  [FiatTransferState.AwaitingFunds]: 1,
  [FiatTransferState.InReview]: 2,
  [FiatTransferState.FundsReceived]: 3,
  [FiatTransferState.PaymentSubmitted]: 4,
  [FiatTransferState.PaymentProcessed]: 5,
  [FiatTransferState.Returned]: 6,
  [FiatTransferState.Refunded]: 7,
  [FiatTransferState.Canceled]: 8,
  [FiatTransferState.Error]: 9,
};

export const useFiatTransfersData = (sorting: SortingState) => {
  const { data, loading } = useGetUserDrainsQuery({});

  const sortedData = useMemo(() => {
    const drains = data?.bridgeGetDrainsHistory ?? [];
    const sorted = [...drains];
    sorting.forEach(({ id, desc }) => {
      sorted.sort((a, b) => {
        const aValue = a[id as keyof any];
        const bValue = b[id as keyof any];
        if (aValue > bValue) return desc ? -1 : 1;
        if (aValue < bValue) return desc ? 1 : -1;
        return 0;
      });
    });
    return sorted;
  }, [data, sorting]);

  return { sortedData, loading };
};

export const useFiatTransfersTableColumns = (
  loading: boolean,
): ColumnDef<BridgeDrain, any>[] => {
  const isMobile = useMobile();
  const columnHelper = useMemo(() => createColumnHelper<BridgeDrain>(), []);

  return useMemo(() => {
    return [
      columnHelper.accessor('amount', {
        header: () => formatText({ id: 'table.row.amount' }),
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-20 skeleton" />;
          }
          return (
            <div>
              {getFormattedAmount(
                row.original.amount,
                SupportedCurrencies[row.original.currency.toUpperCase()] ??
                  SupportedCurrencies.Usd,
              )}
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = parseFloat(rowA.original.amount);
          const b = parseFloat(rowB.original.amount);
          return Math.sign(a - b);
        },
      }),
      columnHelper.accessor('createdAt', {
        header: () => formatText({ id: 'table.row.date' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        staticSize: '150px',
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-20 skeleton" />;
          }
          return <div>{getFormattedDateFrom(row.original.createdAt)}</div>;
        },
      }),
      columnHelper.accessor('state', {
        header: () => formatText({ id: 'table.row.status' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        staticSize: isMobile ? '145px' : '170px',
        cell: ({ row: { original, getIsExpanded } }) => {
          const status = original.state as keyof typeof statusPillScheme;
          const statusScheme =
            statusPillScheme[status] || statusPillScheme.default;
          if (loading) {
            return <div className="h-4 w-12 skeleton" />;
          }
          return getIsExpanded() ? undefined : (
            <PillsBase
              isCapitalized={false}
              className={clsx(
                statusScheme.bgClassName,
                'truncate text-sm font-medium',
              )}
            >
              <span className={statusScheme.textClassName}>
                {formatText(STATUS_MSGS[status as keyof typeof STATUS_MSGS])}
              </span>
            </PillsBase>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.state;
          const b = rowB.original.state;
          const aOrder = stateOrder[a] ?? Infinity;
          const bOrder = stateOrder[b] ?? Infinity;
          return aOrder - bOrder;
        },
      }),
      columnHelper.accessor('receipt', {
        header: () => formatText({ id: 'table.row.receipt' }),
        headCellClassName: isMobile ? 'pr-2 pl-0' : undefined,
        enableSorting: false,
        staticSize: '165px',
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-12 skeleton" />;
          }

          if (!row.original.receipt) {
            return (
              <div className="text-gray-400">
                {formatText({ id: 'table.content.receiptGenerating' })}
              </div>
            );
          }

          return (
            <ExternalLink
              href={row.original.receipt.url}
              key={row.original.receipt.url}
              className="flex items-center gap-2 text-sm text-gray-700 underline transition-colors hover:text-blue-400"
            >
              <ArrowSquareOut size={18} />
              {formatText({ id: 'table.content.viewReceipt' })}
            </ExternalLink>
          );
        },
      }),
      columnHelper.display({
        id: EXPANDER_COLUMN_ID,
        staticSize: '2.25rem',
        header: () => null,
        enableSorting: false,
        cell: ({ row: { getIsExpanded, toggleExpanded } }) => {
          return (
            <button type="button" onClick={() => toggleExpanded()}>
              <CaretDown
                size={18}
                className={clsx('transition', {
                  'rotate-180': getIsExpanded(),
                })}
              />
            </button>
          );
        },
        cellContentWrapperClassName: 'pl-0',
      }),
    ];
  }, [isMobile, columnHelper, loading]);
};
