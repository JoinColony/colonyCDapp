import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { useStagedPaymentContext } from '~context/StagedPaymentContext/StagedPaymentContext.ts';
import { useTablet } from '~hooks';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { type Expenditure } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import { type StagedPaymentRecipientsFieldModel } from '~v5/common/ActionSidebar/partials/forms/StagedPaymentForm/partials/StagedPaymentRecipientsField/types.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { Table } from '~v5/common/Table/Table.tsx';
import { renderCellContent } from '~v5/common/Table/utils.tsx';

import AmountField from '../PaymentBuilderTable/partials/AmountField/AmountField.tsx';
import { type MilestoneItem } from '../StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

import ClaimDelayTooltip from './partials/ClaimDelayTooltip/ClaimDelayTooltip.tsx';
import ReleaseAllButton from './partials/ReleaseAllButton/ReleaseAllButton.tsx';
import ReleaseButton from './partials/ReleaseButton/ReleaseButton.tsx';
import { type StagedPaymentTableProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.StagedPaymentTable';

const MSG = defineMessages({
  payNow: {
    id: `${displayName}.payNow`,
    defaultMessage: 'Pay now',
  },
  released: {
    id: `${displayName}.released`,
    defaultMessage: 'Released',
  },
});

interface StagedPaymentTableColumnsProps {
  data: MilestoneItem[];
  isPaymentStep?: boolean;
  isLoading?: boolean;
  expenditure: Expenditure;
}

const useStagedPaymentTableColumns = ({
  data,
  isPaymentStep,
  isLoading,
  expenditure,
}: StagedPaymentTableColumnsProps) => {
  const { isPendingStagesRelease, allMilestonesSlotIdsAwaitingRelease } =
    useStagedPaymentContext();
  const dataRef = useWrapWithRef(data);
  const hasMoreThanOneToken = dataRef.current.length > 1;
  const isTablet = useTablet();
  const { stagedExpenditureAddress } = useEnabledExtensions();
  const hasMoreThanOneMilestone =
    dataRef.current.filter((item) => !item.isClaimed).length > 1;

  const isCorrectExtensionInstalled =
    !!expenditure.stagedExpenditureAddress &&
    expenditure.stagedExpenditureAddress === stagedExpenditureAddress;

  const columns: ColumnDef<StagedPaymentRecipientsFieldModel, string>[] =
    useMemo(() => {
      const columnHelper =
        createColumnHelper<StagedPaymentRecipientsFieldModel>();

      const releaseTableSpacer = isTablet
        ? []
        : [
            columnHelper.display({
              id: 'release',
              staticSize: '60px',
              enableSorting: false,
              cell: () => null,
            }),
          ];

      return [
        columnHelper.accessor('milestone', {
          header: () => formatText({ id: 'table.row.milestone' }),
          enableSorting: false,
          cell: ({ row }) => (
            <div key={row.id} className="flex sm:py-4">
              <p
                className={clsx('text-md', {
                  'h-5 w-14 skeleton': isLoading,
                })}
              >
                {row.original.milestone}
              </p>
            </div>
          ),
          footer: hasMoreThanOneToken
            ? ({ table }) => {
                const { length: dataLength } = table.getRowModel().rows;

                return (
                  <span className="flex min-h-[1.875rem] items-center text-xs text-gray-400">
                    {dataLength < 1
                      ? formatText({ id: 'table.footer.total' })
                      : formatText(
                          { id: 'table.footer.totalMilestones' },
                          { payments: dataLength },
                        )}
                  </span>
                );
              }
            : undefined,
        }),
        columnHelper.accessor('amount', {
          staticSize: '210px',
          enableSorting: false,
          header: () => formatText({ id: 'table.row.amount' }),
          cell: ({ row }) => (
            <AmountField
              key={row.id}
              tokenAddress={row.original.tokenAddress || ''}
              amount={row.original.amount || '0'}
              isLoading={isLoading}
            />
          ),
          ...((!isTablet || !isPaymentStep) && {
            footer: hasMoreThanOneToken
              ? () => {
                  return (
                    <div
                      className={clsx({
                        'w-[calc(200%+35px)] min-w-[120px]': isTablet,
                      })}
                    >
                      <PaymentBuilderPayoutsTotal
                        data={dataRef.current}
                        itemClassName={clsx({ 'justify-end': isTablet })}
                        buttonClassName="justify-end md:justify-start"
                      />
                    </div>
                  );
                }
              : undefined,
          }),
        }),
        ...(isPaymentStep
          ? [
              columnHelper.display({
                id: 'release',
                staticSize: '60px',
                enableSorting: false,
                cell: ({ row }) => {
                  const { original } = row;
                  const currentMilestone = dataRef.current.find(
                    (item) => item.slotId === original.slotId,
                  );
                  const isClaimed = currentMilestone?.isClaimed;

                  return isClaimed ? (
                    <div
                      className={clsx('flex items-center', {
                        'justify-end': !isTablet,
                      })}
                    >
                      <PillsBase
                        className={clsx(
                          'bg-teams-blue-50 text-sm font-medium text-teams-blue-400',
                        )}
                      >
                        {formatText(MSG.released)}
                      </PillsBase>
                    </div>
                  ) : (
                    <>
                      {isCorrectExtensionInstalled ? (
                        <div className="flex items-center justify-end gap-3">
                          <ReleaseButton
                            description={MSG.payNow}
                            items={currentMilestone ? [currentMilestone] : []}
                            className="w-auto flex-shrink-0 text-left sm:text-center"
                          />
                          <ClaimDelayTooltip
                            finalizedAt={expenditure.finalizedAt ?? 0}
                            claimDelay={row.original.claimDelay || '0'}
                          />
                        </div>
                      ) : undefined}
                    </>
                  );
                },
                footer:
                  hasMoreThanOneMilestone && isCorrectExtensionInstalled
                    ? () => (
                        <div
                          className={clsx({
                            'w-[calc(200%+35px)] min-w-[120px]': isTablet,
                          })}
                        >
                          {isTablet && (
                            <div className="">
                              <PaymentBuilderPayoutsTotal
                                data={dataRef.current}
                                itemClassName="justify-end md:justify-start"
                                buttonClassName="justify-end md:justify-start"
                              />
                            </div>
                          )}

                          <ReleaseAllButton items={dataRef.current} />
                        </div>
                      )
                    : () =>
                        isTablet ? (
                          <div
                            className={clsx({
                              'w-[calc(200%+35px)] min-w-[120px]': isTablet,
                            })}
                          >
                            {isTablet && (
                              <div className="">
                                <PaymentBuilderPayoutsTotal
                                  data={dataRef.current}
                                  itemClassName="justify-end md:justify-start"
                                  buttonClassName="justify-end md:justify-start"
                                />
                              </div>
                            )}
                          </div>
                        ) : undefined,
              }),
            ]
          : releaseTableSpacer),
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      hasMoreThanOneToken,
      isPaymentStep,
      hasMoreThanOneMilestone,
      isCorrectExtensionInstalled,
      isLoading,
      dataRef,
      expenditure.finalizedAt,
      // Even though this is not directly used, it is needed to refresh the ReleaseButton
      isPendingStagesRelease,
      allMilestonesSlotIdsAwaitingRelease.length,
      isTablet,
    ]);

  return columns;
};

const StagedPaymentTable: FC<StagedPaymentTableProps> = ({
  expenditure,
  isPaymentStep,
  isLoading,
}) => {
  const isTablet = useTablet();

  const { slots } = expenditure;
  const { stages } = expenditure.metadata ?? {};
  const data: MilestoneItem[] = useMemo(
    () =>
      stages?.map((item) => {
        const payout = (slots || []).find((slot) => slot.id === item.slotId);
        const amount = payout?.payouts?.[0].amount;
        const tokenAddress = payout?.payouts?.[0].tokenAddress;
        const isClaimed = payout?.payouts?.[0].isClaimed;

        return {
          milestone: item.name,
          amount: amount || '0',
          tokenAddress: tokenAddress || ADDRESS_ZERO,
          slotId: item.slotId,
          isClaimed: isClaimed || false,
          claimDelay: payout?.claimDelay || '0',
        };
      }) ?? [],
    [stages, slots],
  );

  const columns = useStagedPaymentTableColumns({
    data,
    isPaymentStep,
    isLoading,
    expenditure,
  });

  return (
    <div>
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.stages' })}
      </h5>
      {!!data.length && (
        <Table<StagedPaymentRecipientsFieldModel>
          className={clsx(
            '[&_tfoot>tr>td]:border-gray-200 [&_tfoot>tr>td]:py-2 md:[&_tfoot>tr>td]:border-t',
            {
              '[&_tfoot>tr>td:empty]:hidden [&_th]:w-[6.25rem]': isTablet,
              '[&_table]:table-auto lg:[&_table]:table-fixed [&_td:first-child]:pl-4 [&_td]:pr-5 [&_tfoot_td:first-child]:pl-4 [&_tfoot_td:not(:first-child)]:pl-0 [&_th:first-child]:pl-4 [&_th:not(:first-child)]:pl-0 [&_th]:pr-5':
                !isTablet,
            },
          )}
          columns={columns}
          data={data}
          layout={isTablet ? 'vertical' : 'horizontal'}
          borders={{
            visible: true,
            type: 'unset',
          }}
          renderCellWrapper={renderCellContent}
          overrides={{
            initialState: {
              pagination: {
                pageIndex: 0,
                pageSize: 400,
              },
            },
          }}
        />
      )}
    </div>
  );
};

StagedPaymentTable.displayName = displayName;

export default StagedPaymentTable;
