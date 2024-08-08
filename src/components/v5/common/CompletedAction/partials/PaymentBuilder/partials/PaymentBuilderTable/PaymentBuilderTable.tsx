import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type ExpenditureSlotFragment, ExpenditureStatus } from '~gql';
import { useTablet } from '~hooks';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
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
  isLoading,
}: {
  data: PaymentBuilderTableModel[];
  status: ExpenditureStatus;
  slots: ExpenditureSlotFragment[];
  finalizedTimestamp?: number | null;
  isLoading?: boolean;
}) => {
  const isTablet = useTablet();
  const dataRef = useWrapWithRef(data);
  const hasMoreThanOneToken = data.length > 1;
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const claimablePayouts = useMemo(
    () => getClaimableExpenditurePayouts(slots, blockTime, finalizedTimestamp),
    [blockTime, finalizedTimestamp, slots],
  );

  const { loading: isColonyContributorDataLoading } = useMemberContext();

  const isDataLoading = isLoading || isColonyContributorDataLoading;

  return useMemo(
    () => [
      paymentBuilderColumnHelper.accessor('recipient', {
        enableSorting: false,
        header: formatText({ id: 'table.row.recipient' }),
        cell: ({ row }) => (
          <RecipientField
            isLoading={!!isLoading}
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
                      { payments: data.length },
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
              <>
                {isLoading ? (
                  <div className="flex w-3/4 items-center">
                    <div className="h-4 w-full overflow-hidden rounded skeleton" />
                  </div>
                ) : (
                  <PaymentBuilderPayoutsTotal
                    data={dataRef.current}
                    itemClassName="justify-end md:justify-start"
                    buttonClassName="justify-end md:justify-start"
                  />
                )}
              </>
            )
          : undefined,
        cell: ({ row }) => (
          <AmountField
            isLoading={isDataLoading}
            amount={row.original.amount}
            tokenAddress={row.original.tokenAddress}
          />
        ),
      }),
      paymentBuilderColumnHelper.accessor('claimDelay', {
        enableSorting: false,
        header: formatText({ id: 'table.column.claimDelay' }),
        staticSize:
          status === ExpenditureStatus.Finalized ? '6.875rem' : undefined,
        cell: ({ row }) => {
          const formattedHours = convertPeriodToHours(row.original.claimDelay);

          return !isDataLoading ? (
            <span className="text-md text-gray-900">
              {formatText(
                { id: 'table.column.claimDelayField' },
                {
                  hours: formattedHours,
                },
              )}
            </span>
          ) : (
            <div className="flex w-[4rem] items-center">
              <div className="h-4 w-full overflow-hidden rounded skeleton" />
            </div>
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
      fetchCurrentBlockTime,
      finalizedTimestamp,
      hasMoreThanOneToken,
      isDataLoading,
      isLoading,
      isTablet,
      status,
    ],
  );
};

const PaymentBuilderTable: FC<PaymentBuilderTableProps> = ({
  items,
  status,
  finalizedTimestamp,
  isLoading,
}) => {
  const isTablet = useTablet();
  const {
    colony: { expendituresGlobalClaimDelay },
  } = useColonyContext();

  const data = useMemo<PaymentBuilderTableModel[]>(
    () =>
      items.flatMap(
        (item) =>
          item.payouts?.map((payout) => ({
            recipient: item.recipientAddress || '',
            claimDelay: BigNumber.from(item.claimDelay || '0')
              .add(expendituresGlobalClaimDelay ?? '0')
              .toString(),

            amount: payout.amount || '0',
            tokenAddress: payout.tokenAddress || '',
            isClaimed: payout.isClaimed || false,
            id: item.id,
          })) || [],
      ) || [],
    [expendituresGlobalClaimDelay, items],
  );

  const columns = useGetPaymentBuilderColumns({
    data,
    status,
    slots: items,
    finalizedTimestamp,
    isLoading: isLoading || !data.length,
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
            '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.125rem]': isTablet,
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
                },
                {
                  recipient: '0x000',
                  claimDelay: '0',
                  amount: '0',
                  tokenAddress: '0x000',
                  isClaimed: false,
                  id: 1,
                },
                {
                  recipient: '0x000',
                  claimDelay: '0',
                  amount: '0',
                  tokenAddress: '0x000',
                  isClaimed: false,
                  id: 2,
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
