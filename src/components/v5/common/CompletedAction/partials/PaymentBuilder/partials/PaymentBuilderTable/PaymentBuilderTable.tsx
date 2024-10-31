import { CaretDown, WarningCircle } from '@phosphor-icons/react';
import { type Row, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useMemo, useEffect } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { type ExpenditureSlotFragment, ExpenditureStatus } from '~gql';
import { useMobile, useTablet } from '~hooks';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import Table from '~v5/common/Table/index.ts';

import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';

import AmountField from './partials/AmountField/AmountField.tsx';
import ClaimStatusBadge from './partials/ClaimStatusBadge/ClaimStatusBadge.tsx';
import EditContent from './partials/EditContent/EditContent.tsx';
import RecipientField from './partials/RecipientField/RecipientField.tsx';
import {
  type PaymentBuilderTableModel,
  type PaymentBuilderTableProps,
} from './types.ts';
import { getChangedSlots } from './utils.ts';

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
  const { selectedEditingAction, currentStep } = usePaymentBuilderContext();
  const isEditStepActive =
    currentStep?.startsWith(ExpenditureStep.Edit) && !!selectedEditingAction;

  const claimablePayouts = useMemo(
    () => getClaimableExpenditurePayouts(slots, blockTime, finalizedTimestamp),
    [blockTime, finalizedTimestamp, slots],
  );

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
        footer:
          hasMoreThanOneToken && !isEditStepActive
            ? ({ table }) => {
                const { length: dataLength } = table.getRowModel().rows;

                return (
                  <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                    {dataLength <= 7
                      ? formatText({ id: 'table.footer.total' })
                      : formatText(
                          { id: 'table.footer.totalPayments' },
                          { payments: dataLength },
                        )}
                  </span>
                );
              }
            : undefined,
      }),
      paymentBuilderColumnHelper.accessor('amount', {
        enableSorting: false,
        header: formatText({ id: 'table.row.amount' }),
        footer:
          hasMoreThanOneToken && !isEditStepActive
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
          const hasChanges =
            !!row.original.oldValues || !!row.original.newValues;

          const { toggleExpanded, getIsExpanded } = row;

          return (
            <div className="flex items-center justify-between gap-4">
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
              {hasChanges && isEditStepActive && (
                <div className="absolute right-4 top-4 flex gap-2 sm:static">
                  <button
                    type="button"
                    onClick={() => toggleExpanded()}
                    aria-label={formatText({ id: 'ariaLabel.showChanges' })}
                  >
                    <span className="text-gray-400">
                      <CaretDown
                        size={14}
                        className={clsx('transition', {
                          'rotate-180': getIsExpanded(),
                        })}
                      />
                    </span>
                  </button>
                  <span className="hidden text-blue-400 sm:block">
                    <WarningCircle size={16} />
                  </span>
                </div>
              )}
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
      totalNumberOfPayments,
      isTablet,
      status,
      isEditStepActive,
    ],
  );
};

const useRenderSubComponent = () => {
  return ({ row }: { row: Row<PaymentBuilderTableModel> }) => (
    <EditContent actionRow={row} />
  );
};

const PaymentBuilderTable: FC<PaymentBuilderTableProps> = ({
  items,
  status,
  finalizedTimestamp,
  expectedNumberOfPayouts,
}) => {
  const isTablet = useTablet();
  const isMobile = useMobile();
  const {
    colony: { expendituresGlobalClaimDelay },
  } = useColonyContext();
  const { selectedEditingAction, currentStep } = usePaymentBuilderContext();
  const { expenditureSlotChanges } = selectedEditingAction || {};
  const isEditStepActive =
    !!selectedEditingAction && currentStep?.startsWith(ExpenditureStep.Edit);

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

  const dataWithChanges = useMemo(() => {
    if (!expenditureSlotChanges) {
      return data;
    }

    const { newSlots, oldSlots } = expenditureSlotChanges;

    const changedSlots = getChangedSlots(newSlots, oldSlots);
    const changedData = data
      .filter((item) => changedSlots.map((slot) => slot.id).includes(item.id))
      .map((item) => {
        const newSlot = newSlots.find((slot) => slot.id === item.id);
        const oldSlot = oldSlots.find((slot) => slot.id === item.id);

        return {
          ...item,
          newValues: newSlot,
          oldValues: oldSlot,
        };
      });

    const unchangedData = data.filter(
      (item) => !changedSlots.map((slot) => slot.id).includes(item.id),
    );

    return [...changedData, ...unchangedData];
  }, [data, expenditureSlotChanges]);

  const filteredData = dataWithChanges.filter((item) =>
    BigNumber.from(item.amount).gt(0),
  );
  const tableData = isEditStepActive ? dataWithChanges : filteredData;

  const columns = useGetPaymentBuilderColumns({
    data: filteredData,
    status,
    slots: items,
    finalizedTimestamp,
    expectedNumberOfPayouts,
  });

  const renderSubComponent = useRenderSubComponent();
  const tableRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tableRefCurrent = tableRef.current;

    if (isEditStepActive && tableRefCurrent) {
      const tableRows = tableRefCurrent.querySelectorAll('tbody>tr');
      const changedItemsCount = dataWithChanges.filter(
        (item) => item.newValues,
      ).length;

      const lastChangedTableRow = tableRows[changedItemsCount - 1];
      const hasAllRowsChanged = changedItemsCount === dataWithChanges.length;
      const rowsBeforeLastChanged = Array.from(tableRows).slice(
        0,
        changedItemsCount - 1,
      );

      if (rowsBeforeLastChanged.length) {
        rowsBeforeLastChanged.forEach((row) => {
          row.classList.add('previous-row');
        });
      }

      if (lastChangedTableRow) {
        lastChangedTableRow.classList.add('last-edited-row');

        if (hasAllRowsChanged) {
          lastChangedTableRow.classList.add('last-row');
        }
      }
    }

    return () => {
      if (tableRefCurrent) {
        const tableRows = tableRefCurrent.querySelectorAll('tbody>tr');
        tableRows.forEach((row) => {
          row.classList.remove('previous-row', 'last-edited-row', 'last-row');
        });
      }
    };
  }, [isEditStepActive, dataWithChanges, selectedEditingAction]);

  return (
    <div className="mt-7" ref={tableRef}>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      {isEditStepActive && isMobile && (
        <div className="mb-2 flex items-center gap-2 text-blue-400 text-2">
          <WarningCircle size={16} />
          <p>
            {formatText({
              id: selectedEditingAction?.motionData
                ? 'paymentBuilder.table.proposedChanges'
                : 'paymentBuilder.table.changes',
            })}
          </p>
        </div>
      )}
      <Table<PaymentBuilderTableModel>
        virtualizedProps={
          data.length > 10
            ? {
                virtualizedRowHeight: isTablet ? 46 : 54,
              }
            : undefined
        }
        className={clsx(
          '[&_tbody]:relative [&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
          {
            '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.25rem]': isTablet,
            '[&_table]:table-auto lg:[&_table]:table-fixed [&_tbody_td]:h-[54px] [&_td:first-child]:pl-4 [&_td]:pr-4 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-4':
              !isTablet,
            ' [&_thead]:relative [&_thead]:after:absolute [&_thead]:after:-left-px [&_thead]:after:-right-px [&_thead]:after:-top-px [&_thead]:after:bottom-0 [&_thead]:after:rounded-t-lg [&_thead]:after:border [&_thead]:after:border-blue-400 [&_tr.last-edited-row_td:first-child]:after:border-l [&_tr.last-edited-row_td:last-child]:after:border-r [&_tr.last-edited-row_td]:after:border-b [&_tr.last-edited-row_td]:after:border-blue-400 [&_tr.last-row_td:first-child]:after:rounded-bl-lg [&_tr.last-row_td:last-child]:after:rounded-br-lg [&_tr.previous-row_td:first-child]:after:border-l [&_tr.previous-row_td:last-child]:after:border-r [&_tr_td>div]:relative [&_tr_td]:relative [&_tr_td]:after:absolute [&_tr_td]:after:-inset-px [&_tr_td]:after:border-blue-400 [&_tr_td_*]:z-[1]':
              isEditStepActive,
          },
        )}
        renderSubComponent={renderSubComponent}
        data={
          !tableData.length
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
            : tableData
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
