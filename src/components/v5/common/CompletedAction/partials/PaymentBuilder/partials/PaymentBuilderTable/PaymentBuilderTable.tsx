import { CaretDown, WarningCircle } from '@phosphor-icons/react';
import { type Row, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { type FC, useMemo, useState, useEffect } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { type ExpenditureSlotFragment, ExpenditureStatus } from '~gql';
import { useMobile, useTablet } from '~hooks';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { type ExpenditurePayoutWithSlotId } from '~types/expenditures.ts';
import { getClaimableExpenditurePayouts } from '~utils/expenditures.ts';
import { convertPeriodToHours } from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import { Table } from '~v5/common/Table/Table.tsx';
import { renderCellContent } from '~v5/common/Table/utils.tsx';

import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';

import AmountField from './partials/AmountField/AmountField.tsx';
import ClaimStatusBadge from './partials/ClaimStatusBadge/ClaimStatusBadge.tsx';
import EditContent from './partials/EditContent/EditContent.tsx';
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
  const { selectedEditingAction, currentStep } = usePaymentBuilderContext();
  const isEditStepActive =
    currentStep?.startsWith(ExpenditureStep.Edit) && !!selectedEditingAction;

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

const useRenderSubComponent = (
  setIsExpanded: (id: number, isExpanded: boolean) => void,
) => {
  return ({ row }: { row: Row<PaymentBuilderTableModel> }) => {
    setIsExpanded(row.original.id, row.getIsExpanded());

    return <EditContent actionRow={row} />;
  };
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
  const [allRowsChanged, setAllRowsChanged] = useState(false);
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
        id: items.length + index + 1,
        isLoading: true,
      }),
    );

    return [...populatedItems, ...placeholderItems];
  }, [expendituresGlobalClaimDelay, items, expectedNumberOfPayouts]);

  const newDataWithChanges = useMemo(() => {
    if (!expenditureSlotChanges) {
      return data.sort((a, b) => a.id - b.id);
    }
    const { newSlots, oldSlots } = expenditureSlotChanges;

    const unchangedSlots: PaymentBuilderTableModel[] = [];
    const changedSlots: PaymentBuilderTableModel[] = [];

    newSlots.forEach((newSlot) => {
      const found = oldSlots.some(
        (oldSlot) => JSON.stringify(oldSlot) === JSON.stringify(newSlot),
      );

      const newItemSlot = newSlots.find((slot) => slot.id === newSlot.id);
      const oldItemSlot = oldSlots.find((slot) => slot.id === newSlot.id);

      if (found) {
        unchangedSlots.push({
          amount: newSlot.payouts?.[0].amount ?? '0',
          claimDelay: newSlot?.claimDelay ?? '0',
          id: newSlot.id,
          isClaimed: newSlot.payouts?.[0].isClaimed ?? false,
          isLoading: false,
          recipient: newSlot?.recipientAddress ?? '',
          tokenAddress: newSlot.payouts?.[0].tokenAddress ?? '',
        });
      } else {
        changedSlots.push({
          amount: newSlot.payouts?.[0].amount ?? '0',
          claimDelay: newSlot.claimDelay ?? '',
          id: newSlot.id,
          isClaimed: newSlot.payouts?.[0].isClaimed ?? false,
          isLoading: false,
          newValues: newItemSlot,
          oldValues: oldItemSlot,
          recipient: newSlot.recipientAddress ?? '',
          tokenAddress: newSlot.payouts?.[0].tokenAddress ?? '',
        });
      }
    });

    return [
      ...changedSlots,
      ...unchangedSlots.filter((item) => item.amount !== '0'),
    ];
  }, [expenditureSlotChanges, data]);

  const filteredData = newDataWithChanges.filter((item) =>
    BigNumber.from(item.amount).gt(0),
  );

  const dataToShow = isEditStepActive ? newDataWithChanges : filteredData;

  const columns = useGetPaymentBuilderColumns({
    data: newDataWithChanges,
    status,
    slots: items,
    finalizedTimestamp,
    expectedNumberOfPayouts,
  });

  const [expandedRowsIds, setExpandedRowsIds] = useState<Array<number>>([]);

  const renderSubComponent = useRenderSubComponent((id, isExpanded) => {
    if (isExpanded && !expandedRowsIds.includes(id)) {
      setExpandedRowsIds([...expandedRowsIds, id]);
    }
    if (!isExpanded && expandedRowsIds.includes(id)) {
      setExpandedRowsIds(expandedRowsIds.filter((item) => item !== id));
    }
  });
  const tableRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tableRefCurrent = tableRef.current;

    if (isEditStepActive && tableRefCurrent) {
      const tableRows = tableRefCurrent.querySelectorAll('tbody > tr');
      const tableBodys = tableRefCurrent.querySelectorAll('tbody');

      const changedItemsCount = newDataWithChanges.filter(
        (item) => item.newValues,
      ).length;
      const lastChangedTableRow =
        tableRows[changedItemsCount + expandedRowsIds.length - 1];
      const hasAllRowsChanged = changedItemsCount === newDataWithChanges.length;
      const rowsBeforeLastChanged = Array.from(tableRows).slice(
        0,
        changedItemsCount - 1,
      );

      if (rowsBeforeLastChanged.length) {
        rowsBeforeLastChanged.forEach((row) => {
          row.classList.add('previous-row');
        });
      }

      const editedRowsLength = changedItemsCount + expandedRowsIds.length;
      setAllRowsChanged(hasAllRowsChanged);

      if (isTablet) {
        tableBodys.forEach((tbody, index) => {
          if (index < changedItemsCount) {
            tbody.classList.add('tablet-edited');
          } else {
            tbody.classList.remove('tablet-edited');
          }
        });
      } else {
        tableRows.forEach((row, index) => {
          if (index < editedRowsLength) {
            row.classList.add('edited');
          } else {
            row.classList.remove('edited');
          }
        });
      }

      if (lastChangedTableRow) {
        lastChangedTableRow.classList.add('last-edited-row');
        if (hasAllRowsChanged) {
          lastChangedTableRow.classList.add('last-row');
        }
      }

      const observers = Array.from(tableRows).map((row) => {
        const observer = new MutationObserver(() => {
          if (
            !row.classList.contains('previous-row') &&
            rowsBeforeLastChanged.includes(row)
          ) {
            row.classList.add('previous-row');
          }

          if (
            row === lastChangedTableRow &&
            !row.classList.contains('last-edited-row')
          ) {
            row.classList.add('last-edited-row');
          }

          if (
            row === lastChangedTableRow &&
            hasAllRowsChanged &&
            !row.classList.contains('last-row')
          ) {
            row.classList.add('last-row');
          }

          return undefined;
        });

        observer.observe(row, {
          attributes: true,
          attributeFilter: ['class'],
        });

        return observer;
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());

        tableRows.forEach((row) => {
          row.classList.remove(
            'previous-row',
            'last-edited-row',
            'last-row',
            'edited',
            'tablet-edited',
          );
        });
      };
    }

    return () => {};
  }, [isEditStepActive, newDataWithChanges, expandedRowsIds, isTablet]);

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
        className={clsx(
          {
            '[&_tbody>tr>td]:px-[18px] [&_tbody>tr>td]:py-[10px] [&_tr.edited:last-child>td:last-child]:before:h-[calc(100%-5px)] [&_tr.edited:not(:last-child)>td:first-child]:relative [&_tr.edited:not(:last-child)>td:first-child]:after:absolute [&_tr.edited:not(:last-child)>td:first-child]:after:left-0 [&_tr.edited:not(:last-child)>td:first-child]:after:top-0 [&_tr.edited:not(:last-child)>td:first-child]:after:h-[calc(100%+1px)] [&_tr.edited:not(:last-child)>td:first-child]:after:w-[1px] [&_tr.edited:not(:last-child)>td:first-child]:after:translate-x-[-1px] [&_tr.edited:not(:last-child)>td:first-child]:after:rounded-none [&_tr.edited:not(:last-child)>td:first-child]:after:bg-blue-400 [&_tr.edited>td:last-child]:relative [&_tr.edited>td:last-child]:before:absolute [&_tr.edited>td:last-child]:before:right-0 [&_tr.edited>td:last-child]:before:top-0 [&_tr.edited>td:last-child]:before:h-[calc(100%+1px)] [&_tr.edited>td:last-child]:before:w-[1px] [&_tr.edited>td:last-child]:before:translate-x-[1px] [&_tr.edited>td:last-child]:before:bg-blue-400':
              !isTablet,
          },
          {
            '[&_thead]:relative [&_thead]:after:absolute [&_thead]:after:-left-px [&_thead]:after:-right-px [&_thead]:after:-top-px [&_thead]:after:bottom-0 [&_thead]:after:rounded-t-lg [&_thead]:after:border-b [&_thead]:after:border-blue-400':
              !isTablet && isEditStepActive,
          },
          {
            '[&_tr.edited:last-child>td]:after:border-b-1 [&_tr.edited:last-child>td:first-child]:after:border-l-1 [&_tr.edited:last-child>td:first-child]:after:h-full [&_tr.edited:last-child>td:not(:first-child)]:after:border-l-0 [&_tr.edited:last-child>td]:relative [&_tr.edited:last-child>td]:after:absolute [&_tr.edited:last-child>td]:after:bottom-0 [&_tr.edited:last-child>td]:after:right-0 [&_tr.edited:last-child>td]:after:h-[17px] [&_tr.edited:last-child>td]:after:w-[calc(100%+2px)] [&_tr.edited:last-child>td]:after:translate-x-[1px] [&_tr.edited:last-child>td]:after:border [&_tr.edited:last-child>td]:after:border-r-0 [&_tr.edited:last-child>td]:after:border-t-0 [&_tr.edited:last-child>td]:after:border-blue-400 [&_tr.edited>td:first-child]:after:rounded-bl-lg [&_tr.edited>td:last-child]:after:rounded-r-lg':
              !isTablet && allRowsChanged,
          },
          {
            '[&_tr.last-edited-row>td]:border-b-1 [&_tr.last-edited-row>td]:border [&_tr.last-edited-row>td]:border-l-0 [&_tr.last-edited-row>td]:border-r-0 [&_tr.last-edited-row>td]:border-t-0 [&_tr.last-edited-row>td]:border-blue-400':
              !isTablet && !allRowsChanged,
          },
        )}
        rows={{
          renderSubComponent,
          canExpand: () => true,
        }}
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
            : dataToShow
        }
        columns={columns}
        renderCellWrapper={renderCellContent}
        overrides={{
          initialState: {
            pagination: {
              pageIndex: 0,
              pageSize: 400,
            },
          },
        }}
        layout={isTablet ? 'vertical' : 'horizontal'}
        borders={{
          visible: true,
          type: 'unset',
        }}
      />
    </div>
  );
};

PaymentBuilderTable.displayName = displayName;

export default PaymentBuilderTable;
