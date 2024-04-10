import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import Table from '~v5/common/Table/index.ts';

import AmountField from './AmountField.tsx';
import RecipientField from './RecipientField.tsx';
import {
  type PaymentBuilderTableModel,
  type PaymentBuilderTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.PaymentBuilderTable';

const paymentBuilderColumnHelper =
  createColumnHelper<PaymentBuilderTableModel>();

const useGetPaymentBuilderColumns = (data: PaymentBuilderTableModel[]) => {
  const dataRef = useWrapWithRef(data);
  const hasMoreThanOneToken = data.length > 1;
  const {
    colony: { expendituresGlobalClaimDelay },
  } = useColonyContext();
  const isTablet = useTablet();
  const expendituresGlobalClaimDelayHours = useMemo(() => {
    if (typeof expendituresGlobalClaimDelay !== 'number') {
      return null;
    }

    return expendituresGlobalClaimDelay / (60 * 60);
  }, [expendituresGlobalClaimDelay]);

  return [
    paymentBuilderColumnHelper.accessor('recipient', {
      enableSorting: false,
      header: formatText({ id: 'table.row.recipient' }),
      cell: ({ row }) => <RecipientField address={row.original.recipient} />,
      footer: hasMoreThanOneToken
        ? () => (
            <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
              {formatText({ id: 'table.footer.total' })}
            </span>
          )
        : undefined,
    }),
    paymentBuilderColumnHelper.accessor('amount', {
      enableSorting: false,
      header: formatText({ id: 'table.row.amount' }),
      footer:
        hasMoreThanOneToken && !isTablet
          ? () => <PaymentBuilderPayoutsTotal data={dataRef.current} />
          : undefined,
      cell: ({ row }) => (
        <AmountField
          amount={row.original.amount}
          tokenAddress={row.original.tokenAddress}
        />
      ),
    }),
    paymentBuilderColumnHelper.accessor('claimDelay', {
      enableSorting: false,
      header: formatText({ id: 'table.column.claimDelay' }),
      footer:
        hasMoreThanOneToken && isTablet
          ? () => <PaymentBuilderPayoutsTotal data={dataRef.current} />
          : undefined,
      cell: ({ row }) => {
        const formattedHours = Math.floor(
          Number(row.original.claimDelay) / 3600,
        );

        return (
          <span className="text-md text-gray-900">
            {formattedHours}{' '}
            {formatText(
              { id: 'table.column.claimDelayFieldSuffix' },
              {
                hours: formattedHours,
              },
            )}
          </span>
        );
      },
    }),
    ...(expendituresGlobalClaimDelayHours !== null
      ? [
          paymentBuilderColumnHelper.display({
            id: 'totalDelay',
            header: () => formatText({ id: 'table.column.totalDelay' }),
            cell: ({ row }) => {
              const totalHours =
                expendituresGlobalClaimDelayHours +
                (Number(dataRef.current[row.index]?.claimDelay) || 0);

              const formattedHours = totalHours / 60;

              return (
                <span className="text-gray-300">
                  {formattedHours}{' '}
                  {formatText(
                    { id: 'table.column.claimDelayFieldSuffix' },
                    {
                      hours: formattedHours,
                    },
                  )}
                </span>
              );
            },
          }),
        ]
      : []),
  ];
};

const PaymentBuilderTable = ({ items }: PaymentBuilderTableProps) => {
  const data: PaymentBuilderTableModel[] = items.map((item) => ({
    recipient: item.recipientAddress || '',
    claimDelay: item.claimDelay || '0',
    amount: item.payouts?.[0].amount || '0',
    tokenAddress: item.payouts?.[0].tokenAddress || '',
  }));
  const columns = useGetPaymentBuilderColumns(data);
  const isTablet = useTablet();

  return (
    <div className="mt-7">
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<PaymentBuilderTableModel>
        className={clsx(
          'md:[&_tbody>td>div]:p-[1.1rem] md:[&_tbody>tr>td]:!border-none [&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
        )}
        verticalLayout={isTablet}
        data={data}
        columns={columns}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
