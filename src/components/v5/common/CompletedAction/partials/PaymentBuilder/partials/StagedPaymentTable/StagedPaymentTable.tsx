import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { useMobile, useTablet } from '~hooks';
import useWrapWithRef from '~hooks/useWrapWithRef.ts';
import { formatText } from '~utils/intl.ts';
import PaymentBuilderPayoutsTotal from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderPayoutsTotal/index.ts';
import { type StagedPaymentRecipientsFieldModel } from '~v5/common/ActionSidebar/partials/forms/StagedPaymentForm/partials/StagedPaymentRecipientsField/types.ts';
import Table from '~v5/common/Table/Table.tsx';

import AmountField from '../PaymentBuilderTable/partials/AmountField/AmountField.tsx';

import ReleaseAllButton from './partials/ReleaseAllButton/ReleaseAllButton.tsx';
import { type StagedPaymentTableProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.StagedPaymentTable';

const MSG = defineMessages({
  release: {
    id: `${displayName}.release`,
    defaultMessage: 'Release',
  },
});

const useStagedPaymentTableColumns = (
  data: StagedPaymentRecipientsFieldModel[],
  isReleaseStep?: boolean,
  isLoading?: boolean,
) => {
  const hasMoreThanOneToken = data.length > 1;
  const dataRef = useWrapWithRef(data);
  const isMobile = useMobile();

  const columns: ColumnDef<StagedPaymentRecipientsFieldModel, string>[] =
    useMemo(() => {
      const columnHelper =
        createColumnHelper<StagedPaymentRecipientsFieldModel>();

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
          staticSize: '180px',
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
          footer: hasMoreThanOneToken
            ? () => (
                <>
                  <PaymentBuilderPayoutsTotal
                    data={dataRef.current}
                    itemClassName="justify-end md:justify-start"
                    buttonClassName="justify-end md:justify-start"
                  />
                  {isMobile && isReleaseStep && dataRef.current.length > 1 && (
                    <ReleaseAllButton />
                  )}
                </>
              )
            : undefined,
        }),
        ...(isReleaseStep
          ? [
              columnHelper.display({
                id: 'release',
                staticSize: '90px',
                enableSorting: false,
                cell: ({ row }) => (
                  <button
                    key={row.id}
                    type="button"
                    className="w-full text-left underline transition-colors text-3 hover:text-blue-400 sm:text-center"
                  >
                    {formatText(MSG.release)}
                  </button>
                ),
                footer:
                  !isMobile && dataRef.current.length > 1
                    ? () => <ReleaseAllButton />
                    : undefined,
              }),
            ]
          : []),
      ];
    }, [dataRef, hasMoreThanOneToken, isReleaseStep, isMobile, isLoading]);

  return columns;
};

const StagedPaymentTable: FC<StagedPaymentTableProps> = ({
  stages,
  slots,
  isReleaseStep,
  isLoading,
}) => {
  const isTablet = useTablet();
  const data = useMemo(
    () =>
      stages.map((item) => {
        const payout = (slots || []).find((slot) => slot.id === item.slotId);
        const amount = payout?.payouts?.[0].amount;
        const tokenAddress = payout?.payouts?.[0].tokenAddress;

        return {
          milestone: item.name,
          amount: amount || '0',
          tokenAddress: tokenAddress || ADDRESS_ZERO,
        };
      }),
    [stages, slots],
  );

  const columns = useStagedPaymentTableColumns(data, isReleaseStep, isLoading);

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
          verticalLayout={isTablet}
          columns={columns}
          data={data}
          withBorder={false}
          renderCellWrapper={(_, content) => content}
          initialState={{
            pagination: {
              pageSize: 400,
            },
          }}
        />
      )}
    </div>
  );
};

StagedPaymentTable.displayName = displayName;

export default StagedPaymentTable;
