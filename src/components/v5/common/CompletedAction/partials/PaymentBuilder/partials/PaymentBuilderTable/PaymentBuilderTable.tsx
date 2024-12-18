import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useMemo, useState, useEffect } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ExpenditureSlotFragment, ExpenditureStatus } from '~gql';
import { useTablet } from '~hooks';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import Table from '~v5/common/Table/index.ts';

import AmountField from './partials/AmountField/AmountField.tsx';
import ClaimStatusBadge from './partials/ClaimStatusBadge/ClaimStatusBadge.tsx';
import RecipientField from './partials/RecipientField/RecipientField.tsx';
import {
  type PaymentBuilderTableModel,
  type PaymentBuilderTableProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.PaymentBuilderTable';

const paymentBuilderColumnHelper =
  createColumnHelper<PaymentBuilderTableModel>();

const useGetPaymentBuilderColumns = ({
  data,
  status,
  slots,
  finalizedTimestamp,
  expectedNumberOfPayouts,
}: {
  data: PaymentBuilderTableModel[];
  status: ExpenditureStatus;
  slots: ExpenditureSlotFragment[];
  finalizedTimestamp?: number | null;
  expectedNumberOfPayouts?: number | null;
}) => {
  const isTablet = useTablet();
  const hasMoreThanOneToken = data.length > 1;
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const [claimablePayouts, setClaimablePayouts] = useState<
    ExpenditurePayoutWithSlotId[]
  >([]);

  useEffect(() => {
    if (finalizedTimestamp !== null) {
      fetchCurrentBlockTime();
      setClaimablePayouts(
        getClaimableExpenditurePayouts(slots, blockTime, finalizedTimestamp),
      );
    }
  }, [slots, blockTime, finalizedTimestamp, fetchCurrentBlockTime]);

  const allPaymentsLoaded = data.filter((item) => item.isLoading).length === 0;

  let totalNumberOfPayments = data.length;

  if (expectedNumberOfPayouts && expectedNumberOfPayouts > data.length) {
    totalNumberOfPayments = expectedNumberOfPayouts;
  }

  return useMemo(
    () => [
      paymentBuilderColumnHelper.accessor('recipient', {
        enableSorting: false,
        header: formatText({ id: 'table.row.recipient' }),
        cell: ({ row }) => (
          <RecipientField
            isLoading={row.original.isLoading ?? true}
            address={row.original.recipient}
          />
        ),
        footer: hasMoreThanOneToken
          ? () => (
              <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                {data.length <= 7
                  ? formatText({ id: 'table.footer.total' })
                  : formatText(
                      { id: 'table.footer.totalPayments' },
                      { payments: totalNumberOfPayments },
                    )}
              </span>
            )
          : undefined,
      }),
      paymentBuilderColumnHelper.accessor('amount', {
        enableSorting: false,
        header: formatText({ id: 'table.row.amount' }),
        footer: hasMoreThanOneToken
          ? () => (
              <LoadingSkeleton
                isLoading={!allPaymentsLoaded}
                className="h-4 w-3/4 rounded"
              >
                <PaymentBuilderPayoutsTotal
                  data={data}
                  itemClassName="justify-end md:justify-start"
                  buttonClassName="justify-end md:justify-start"
                />
              </LoadingSkeleton>
            )
          : undefined,
        cell: ({ row }) => (
          <AmountField
            isLoading={row.original.isLoading ?? false}
            amount={row.original.amount}
            tokenAddress={row.original.tokenAddress}
          />
        ),
      }),
      paymentBuilderColumnHelper.accessor('claimDelay', {
        enableSorting: false,
        header: formatText({ id: 'table.column.claimDelay' }),
        staticSize: status === ExpenditureStatus.Finalized ? '7rem' : undefined,
        cell: ({ row }) => {
          const formattedHours = convertPeriodToHours(row.original.claimDelay);

          return (
            <LoadingSkeleton
              isLoading={row.original.isLoading}
              className="h-4 w-[4rem] rounded"
            >
              <span className="text-md text-gray-900">
                {formatText(
                  { id: 'table.column.claimDelayField' },
                  {
                    hours: formattedHours,
                  },
                )}
              </span>
            </LoadingSkeleton>
          );
        },
      }),
      ...(status === ExpenditureStatus.Finalized
        ? [
            paymentBuilderColumnHelper.display({
              id: 'claimStatus',
              header: () => null,
              staticSize: !isTablet ? '7.8125rem' : undefined,
              cell: ({ row }) => {
                const { claimDelay, isClaimed, id } = row.original;

                return (
                  <div className="md:text-right">
                    <ClaimStatusBadge
                      claimDelay={claimDelay}
                      finalizedTimestamp={finalizedTimestamp}
                      isClaimed={isClaimed}
                      isClaimable={
                        !!claimablePayouts.find(({ slotId }) => slotId === id)
                      }
                      onTimeEnd={fetchCurrentBlockTime}
                    />
                  </div>
                );
              },
            }),
          ]
        : []),
    ],
    // Rule added so that we won't have to pass data or dataRef as dependencies to avoid unnecesary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      claimablePayouts,
      data,
      fetchCurrentBlockTime,
      finalizedTimestamp,
      hasMoreThanOneToken,
      totalNumberOfPayments,
      isTablet,
      status,
    ],
  );
};

const PaymentBuilderTable: FC<PaymentBuilderTableProps> = ({
  items,
  status,
  finalizedTimestamp,
  expectedNumberOfPayouts,
}) => {
  const isTablet = useTablet();
  const {
    colony: { expendituresGlobalClaimDelay },
  } = useColonyContext();

  const data = useMemo<PaymentBuilderTableModel[]>(() => {
    const populatedItems = items.flatMap((item) => {
      if (!item.payouts) {
        return {
          recipient: item.recipientAddress || '',
          claimDelay: BigNumber.from(item.claimDelay || '0')
            .add(expendituresGlobalClaimDelay ?? '0')
            .toString(),

          amount: '0',
          tokenAddress: '',
          isClaimed: false,
          id: item.id,
          isLoading: true,
        };
      }
      return item.payouts.map((payout) => {
        return {
          recipient: item.recipientAddress || '',
          claimDelay: BigNumber.from(item.claimDelay || '0')
            .add(expendituresGlobalClaimDelay ?? '0')
            .toString(),

          amount: payout.amount || '0',
          tokenAddress: payout.tokenAddress || '',
          isClaimed: payout.isClaimed || false,
          id: item.id,
          isLoading: false,
        };
      });
    });

    const numberOfMissingItems = expectedNumberOfPayouts
      ? expectedNumberOfPayouts - items.length
      : 0;

    const placeholderItems = Array.from(
      { length: numberOfMissingItems },
      (_, index) => ({
        recipient: '',
        claimDelay: '0',
        amount: '0',
        tokenAddress: '',
        isClaimed: false,
        id: items.length + index + 1, // Calculate the next available item.id
        isLoading: true,
      }),
    );

    return [...populatedItems, ...placeholderItems];
  }, [expendituresGlobalClaimDelay, items, expectedNumberOfPayouts]);

  const columns = useGetPaymentBuilderColumns({
    data,
    status,
    slots: items,
    finalizedTimestamp,
    expectedNumberOfPayouts,
  });

  return (
    <div className="mt-7">
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<PaymentBuilderTableModel>
        virtualizedProps={
          data.length > 10
            ? {
                virtualizedRowHeight: isTablet ? 46 : 54,
              }
            : undefined
        }
        className={clsx(
          '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
          {
            '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.25rem]': isTablet,
            '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
              !isTablet,
          },
        )}
        data={
          !data.length
            ? [
                {
                  recipient: '0x000',
                  claimDelay: '0',
                  amount: '0',
                  tokenAddress: '0x000',
                  isClaimed: false,
                  id: 0,
                  isLoading: true,
                },
                {
                  recipient: '0x000',
                  claimDelay: '0',
                  amount: '0',
                  tokenAddress: '0x000',
                  isClaimed: false,
                  id: 1,
                  isLoading: true,
                },
                {
                  recipient: '0x000',
                  claimDelay: '0',
                  amount: '0',
                  tokenAddress: '0x000',
                  isClaimed: false,
                  id: 2,
                  isLoading: true,
                },
              ]
            : data
        }
        columns={columns}
        renderCellWrapper={(_, content) => content}
        verticalLayout={isTablet}
        withBorder={false}
        initialState={{
          pagination: {
            pageSize: 400,
          },
        }}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
