import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
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
    colony,
    colony: { expendituresGlobalClaimDelay },
  } = useColonyContext();
  const isMobile = useMobile();
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
        hasMoreThanOneToken && !isMobile
          ? () => {
              const selectedTokens = dataRef.current?.reduce(
                (result: ExpenditurePayout[], { amount }) => {
                  if (!amount || !amount[0].token) {
                    return result;
                  }

                  const tokenData = getSelectedToken(colony, amount[0].token);

                  if (!tokenData) {
                    return result;
                  }

                  return [
                    {
                      tokenAddress: amount[0].token,
                      amount: BigNumber.from(result[0]?.amount || '0')
                        .add(BigNumber.from(amount[0].amount || '0'))
                        .toString(),
                      isClaimed: false,
                    },
                  ];
                },
                [],
              );

              return <PaymentBuilderPayoutsTotal payouts={selectedTokens} />;
            }
          : undefined,
      cell: ({ row }) => (
        <AmountField
          amount={row.original.amount[0].amount}
          token={row.original.amount[0].token}
        />
      ),
    }),
    paymentBuilderColumnHelper.accessor('claimDelay', {
      enableSorting: false,
      header: formatText({ id: 'table.column.claimDelay' }),
      footer:
        hasMoreThanOneToken && isMobile
          ? () => {
              const selectedTokens = dataRef.current?.reduce(
                (result: ExpenditurePayout[], { amount }) => {
                  if (!amount) {
                    return result;
                  }

                  if (!amount[0].token) {
                    return result;
                  }

                  const tokenData = getSelectedToken(colony, amount[0].token);

                  if (!tokenData) {
                    return result;
                  }

                  return [
                    {
                      tokenAddress: amount[0].token,
                      amount: BigNumber.from(result[0]?.amount || '0')
                        .add(BigNumber.from(amount[0].amount || '0'))
                        .toString(),
                      isClaimed: false,
                    },
                  ];
                },
                [],
              );

              return <PaymentBuilderPayoutsTotal payouts={selectedTokens} />;
            }
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
    key: item.id.toString(),
    recipient: item.recipientAddress || '',
    claimDelay: item.claimDelay || '0',
    amount:
      item?.payouts?.map((payout) => ({
        amount: payout.amount,
        token: payout.tokenAddress,
      })) || [],
  }));
  const columns = useGetPaymentBuilderColumns(data);

  return (
    <div className="mt-7">
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<PaymentBuilderTableModel>
        className={clsx(
          'sm:[&_tbody>td>div]:p-[1.1rem] sm:[&_tbody>tr>td]:!border-none [&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 sm:[&_tfoot>tr>td]:border-t',
        )}
        data={data}
        columns={columns}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
