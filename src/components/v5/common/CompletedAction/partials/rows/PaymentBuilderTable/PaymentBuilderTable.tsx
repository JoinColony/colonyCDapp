import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderTokensTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderTokensTotal/PaymentBuilderTokensTotal.tsx';
import { type PaymentBuilderTokenItem } from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderTokensTotal/types.ts';
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
    colony: { expendituresGlobalClaimDelay, tokens },
  } = useColonyContext();
  const colonyTokens =
    tokens?.items.filter(notNull).map((colonyToken) => colonyToken.token) || [];
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
            <span className="text-xs text-gray-400 flex items-center min-h-[1.875rem]">
              {formatText({ id: 'table.footer.total' })}
            </span>
          )
        : undefined,
    }),
    paymentBuilderColumnHelper.accessor('amount', {
      enableSorting: false,
      header: formatText({ id: 'table.row.amount' }),
      cell: ({ row }) => (
        <AmountField
          amount={row.original.amount[0].amount}
          token={row.original.amount[0].token}
        />
      ),
      footer: hasMoreThanOneToken
        ? () => {
            const selectedTokens = dataRef.current?.reduce(
              (result, { amount }) => {
                if (!amount) {
                  return result;
                }

                if (!amount[0].token) {
                  return result;
                }

                const tokenData = colonyTokens.find(
                  (colonyToken) => colonyToken.tokenAddress === amount[0].token,
                );

                if (!tokenData) {
                  return result;
                }

                return {
                  ...result,
                  [amount[0].token]: {
                    ...tokenData,
                    amount: BigNumber.from(
                      result[amount[0].token]?.amount || '0',
                    )
                      .add(BigNumber.from(amount[0].amount || '0'))
                      .toString(),
                  },
                };
              },
              {},
            );

            const selectedTokensData = Object.values(selectedTokens);

            return (
              <PaymentBuilderTokensTotal
                tokens={selectedTokensData as PaymentBuilderTokenItem[]}
              />
            );
          }
        : undefined,
    }),
    paymentBuilderColumnHelper.accessor('claimDelay', {
      enableSorting: false,
      header: formatText({ id: 'table.column.claimDelay' }),
      cell: ({ row }) => {
        const formattedHours = Math.floor(row.original.claimDelay / 3600);

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
                (dataRef.current[row.index]?.claimDelay || 0);

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
    claimDelay: item.claimDelay || 0,
    amount:
      item?.payouts?.map((payout) => ({
        amount: payout.amount,
        token: payout.tokenAddress,
      })) || [],
  }));
  const columns = useGetPaymentBuilderColumns(data);

  return (
    <div className="mt-7">
      <h5 className="text-2 mb-3 mt-6">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<PaymentBuilderTableModel>
        className={clsx(
          'sm:[&_td>div]:py-2 sm:[&_td>div]:min-h-[2.875rem] sm:[&_tr>td]:border-none',
        )}
        data={data}
        columns={columns}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
