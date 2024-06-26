import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ExpenditureStatus } from '~gql';
import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import SplitPaymentPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/partials/SplitPaymentPayoutsTotal/SplitPaymentPayoutsTotal.tsx';
import { calculatePercentageValue } from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/partials/SplitPaymentRecipientsField/utils.ts';

import AmountField from '../../../PaymentBuilder/partials/PaymentBuilderTable/partials/AmountField/AmountField.tsx';
import RecipientField from '../../../PaymentBuilder/partials/PaymentBuilderTable/partials/RecipientField/RecipientField.tsx';

import { type SplitPaymentTableModel } from './types.ts';

export const useGetSplitPaymentColumns = (
  data: SplitPaymentTableModel[],
  status: ExpenditureStatus,
  isLoading?: boolean,
) => {
  const isTablet = useTablet();
  const splitPaymentColumnHelper = createColumnHelper<SplitPaymentTableModel>();
  const { colony } = useColonyContext();

  const amount = data.reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }

    return BigNumber.from(acc)
      .add(BigNumber.from(curr?.amount || '0'))
      .toString();
  }, '0');

  return useMemo(
    () => [
      splitPaymentColumnHelper.accessor('recipient', {
        enableSorting: false,
        header: formatText({ id: 'table.row.recipient' }),
        cell: ({ row }) => (
          <RecipientField
            isLoading={isLoading}
            address={row.original.recipient}
          />
        ),
        footer: () => (
          <span className="flex min-h-[1.875rem] items-center text-gray-400 text-4">
            {formatText({ id: 'table.footer.total' })}
          </span>
        ),
      }),
      splitPaymentColumnHelper.accessor('amount', {
        enableSorting: false,
        header: formatText({ id: 'table.row.amount' }),
        footer: () => {
          const token = getSelectedToken(colony, data[0]?.tokenAddress);

          return token ? (
            <div className="flex items-center justify-end gap-9 md:justify-start">
              <SplitPaymentPayoutsTotal data={data} token={token} />
              {isTablet && (
                <span className="text-md font-medium text-gray-900">100%</span>
              )}
            </div>
          ) : null;
        },
        cell: ({ row }) => (
          <AmountField
            isLoading={isLoading}
            amount={row.original.amount}
            tokenAddress={row.original.tokenAddress}
          />
        ),
      }),
      splitPaymentColumnHelper.accessor('percent', {
        enableSorting: false,
        header: formatText({ id: 'table.row.percent' }),
        staticSize:
          status === ExpenditureStatus.Finalized ? '6.875rem' : undefined,
        cell: ({ row }) => {
          const percentCalculated = data?.[row.index]?.amount
            ? calculatePercentageValue(data?.[row.index].amount, amount)
            : 0;

          return (
            <span className="text-md font-medium text-gray-900">
              {parseFloat(percentCalculated.toFixed(4))}%
            </span>
          );
        },
        footer: !isTablet
          ? () => (
              <span className="text-md font-medium text-gray-900">100%</span>
            )
          : undefined,
      }),
    ],
    [
      amount,
      colony,
      data,
      isLoading,
      isTablet,
      splitPaymentColumnHelper,
      status,
    ],
  );
};
