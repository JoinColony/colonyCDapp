import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ExpenditureSlotFragment, ExpenditureStatus } from '~gql';
import { useTablet } from '~hooks';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
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

const useGetPaymentBuilderColumns = (
  data: PaymentBuilderTableModel[],
  status: ExpenditureStatus,
  slots: ExpenditureSlotFragment[],
  finalizedTimestamp?: number | null,
) => {
  const isTablet = useTablet();
  const dataRef = useWrapWithRef(data);
  const hasMoreThanOneToken = data.length > 1;
  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();

  const claimablePayouts = useMemo(
    () => getClaimableExpenditurePayouts(slots, blockTime, finalizedTimestamp),
    [blockTime, finalizedTimestamp, slots],
  );

  return useMemo(
    () => [
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
        footer: hasMoreThanOneToken
          ? () => (
              <PaymentBuilderPayoutsTotal
                data={dataRef.current}
                itemClassName="justify-end md:justify-start"
                buttonClassName="justify-end md:justify-start"
              />
            )
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
        staticSize:
          status === ExpenditureStatus.Finalized ? '6.875rem' : undefined,
        cell: ({ row }) => {
          const formattedHours = Math.floor(
            Number(row.original.claimDelay) / 3600,
          );

          return (
            <span className="text-md text-gray-900">
              {formatText(
                { id: 'table.column.claimDelayField' },
                {
                  hours: formattedHours,
                },
              )}
            </span>
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
    [
      claimablePayouts,
      dataRef,
      fetchCurrentBlockTime,
      finalizedTimestamp,
      hasMoreThanOneToken,
      isTablet,
      status,
    ],
  );
};

const PaymentBuilderTable: FC<PaymentBuilderTableProps> = ({
  items,
  status,
  finalizedTimestamp,
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

  const columns = useGetPaymentBuilderColumns(
    data,
    status,
    items,
    finalizedTimestamp,
  );

  return (
    <div className="mt-7">
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<PaymentBuilderTableModel>
        className={clsx(
          '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
          {
            '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.125rem]': isTablet,
            '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
              !isTablet,
          },
        )}
        data={data}
        columns={columns}
        renderCellWrapper={(_, content) => content}
        verticalLayout={isTablet}
        withBorder={false}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
