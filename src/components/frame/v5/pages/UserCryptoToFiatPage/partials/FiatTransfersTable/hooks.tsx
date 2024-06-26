import { ArrowSquareOut } from '@phosphor-icons/react';
import {
  type ColumnDef,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo, useEffect, useState } from 'react';

import { useMobile } from '~hooks';
import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { formatText } from '~utils/intl.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { FiatTransferState, statusPillScheme, STATUS_MSGS } from './consts.ts';
import { mockTransfers } from './mockData.ts';

import type { Transfer, FormattedTransfer } from './types';

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
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setLoading(true);
    setTimeout(() => {
      setTransfers(mockTransfers);
      setLoading(false);
    }, 1000);
  }, []);

  const formattedData: FormattedTransfer[] = useMemo(() => {
    return transfers.map((transfer) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: transfer.receipt.destination_currency,
        minimumFractionDigits: 2,
      });

      const amountFormatted = `${formatter.format(parseFloat(transfer.receipt.outgoing_amount))} ${transfer.receipt.destination_currency.toUpperCase()}`;

      return {
        id: transfer.id,
        amount: amountFormatted,
        amountNumeric: parseFloat(transfer.receipt.outgoing_amount),
        state: transfer.state,
        createdAt: new Date(transfer.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        receiptUrl: transfer.receipt.url,
      };
    });
  }, [transfers]);

  const sortedData = useMemo(() => {
    const sorted = [...formattedData];
    sorting.forEach(({ id, desc }) => {
      sorted.sort((a, b) => {
        const aValue = a[id as keyof FormattedTransfer];
        const bValue = b[id as keyof FormattedTransfer];
        if (aValue > bValue) return desc ? -1 : 1;
        if (aValue < bValue) return desc ? 1 : -1;
        return 0;
      });
    });
    return sorted;
  }, [formattedData, sorting]);

  return { sortedData, loading };
};

export const useFiatTransfersTableColumns = (
  loading: boolean,
): ColumnDef<FormattedTransfer, any>[] => {
  const isMobile = useMobile();
  const columnHelper = createColumnHelper<FormattedTransfer>();

  return useMemo(() => {
    return [
      columnHelper.accessor('amount', {
        header: () => formatText({ id: 'table.row.amount' }),
        headCellClassName: clsx({
          'pl-0 pr-2': isMobile,
        }),
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-20 skeleton" />;
          }
          return <div>{row.original.amount}</div>;
        },
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.amountNumeric;
          const b = rowB.original.amountNumeric;
          return Math.sign(a - b);
        },
      }),
      columnHelper.accessor('createdAt', {
        header: () => formatText({ id: 'table.row.date' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        staticSize: '180px',
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-20 skeleton" />;
          }
          return <div>{row.original.createdAt}</div>;
        },
      }),
      columnHelper.accessor('state', {
        header: () => formatText({ id: 'table.row.status' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        staticSize: '180px',
        cell: ({ row }) => {
          const status = row.original.state as keyof typeof statusPillScheme;
          const statusScheme =
            statusPillScheme[status] || statusPillScheme.default;
          if (loading) {
            return <div className="h-4 w-12 skeleton" />;
          }
          return (
            <PillsBase
              className={clsx(statusScheme.bgClassName, 'text-sm font-medium')}
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
      columnHelper.accessor('receiptUrl', {
        header: () => formatText({ id: 'table.row.receipt' }),
        headCellClassName: isMobile ? 'pr-2 pl-0' : undefined,
        staticSize: '180px',
        cell: ({ row }) => {
          if (loading) {
            return <div className="h-4 w-12 skeleton" />;
          }
          return (
            <ExternalLink
              href={row.original.receiptUrl}
              key={row.original.receiptUrl}
              className="flex items-center gap-2 text-md text-gray-700 underline"
            >
              <ArrowSquareOut size={18} />
              {formatText({ id: 'table.content.viewReceipt' })}
            </ExternalLink>
          );
        },
      }),
    ];
  }, [isMobile, columnHelper, loading]);
};
