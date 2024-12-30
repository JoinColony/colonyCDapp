import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { ExpenditureStatus } from '~gql';
import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import SplitPaymentPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/partials/SplitPaymentPayoutsTotal/SplitPaymentPayoutsTotal.tsx';
import { calculatePercentageValue } from '~v5/common/ActionSidebar/partials/forms/SplitPaymentForm/partials/SplitPaymentRecipientsField/utils.ts';
import AmountField from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderTable/partials/AmountField/AmountField.tsx';
import RecipientField from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderTable/partials/RecipientField/RecipientField.tsx';

import { type SplitPaymentTableModel } from './types.ts';

export const useGetSplitPaymentColumns = (
  data: SplitPaymentTableModel[],
  status: ExpenditureStatus,
  isLoading?: boolean,
) => {
  const isTablet = useTablet();
  const splitPaymentColumnHelper = createColumnHelper<SplitPaymentTableModel>();
  const { colony } = useColonyContext();
  const { loading: isColonyContributorDataLoading } = useMemberContext();
  const isDataLoading = isLoading || isColonyContributorDataLoading;

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
          <LoadingSkeleton isLoading={isLoading} className="h-4 w-full rounded">
            <RecipientField
              address={row.original.recipient}
              isLoading={!!isLoading}
            />
          </LoadingSkeleton>
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

          return (
            <LoadingSkeleton
              isLoading={isDataLoading}
              className="h-4 w-full rounded"
            >
              {token ? (
                <div className="flex items-center justify-end gap-9 md:justify-start">
                  <SplitPaymentPayoutsTotal data={data} token={token} />
                  {isTablet && (
                    <span className="text-md font-medium text-gray-900">
                      100%
                    </span>
                  )}
                </div>
              ) : null}
            </LoadingSkeleton>
          );
        },
        cell: ({ row }) => (
          <AmountField
            isLoading={isDataLoading}
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
            <LoadingSkeleton
              isLoading={isDataLoading}
              className="h-4 w-full rounded"
            >
              <div className="flex items-center gap-2 text-md font-medium text-gray-900">
                {parseFloat(percentCalculated.toFixed(4))}
                <span>%</span>
              </div>
            </LoadingSkeleton>
          );
        },
        footer: !isTablet
          ? () => (
              <LoadingSkeleton
                isLoading={isDataLoading}
                className="h-4 w-full rounded"
              >
                <span className="text-md font-medium text-gray-900">100%</span>
              </LoadingSkeleton>
            )
          : undefined,
      }),
    ],
    [
      amount,
      colony,
      data,
      isDataLoading,
      isLoading,
      isTablet,
      splitPaymentColumnHelper,
      status,
    ],
  );
};
