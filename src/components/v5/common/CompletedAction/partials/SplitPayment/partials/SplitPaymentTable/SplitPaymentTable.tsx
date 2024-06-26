import clsx from 'clsx';
import React, { type FC, useMemo } from 'react';

import { useTablet } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Table from '~v5/common/Table/index.ts';

import { useGetSplitPaymentColumns } from './hooks.tsx';
import {
  type SplitPaymentTableModel,
  type SplitPaymentTableProps,
} from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.SplitPayment.partials.SplitPaymentTable';

const SplitPaymentTable: FC<SplitPaymentTableProps> = ({
  items,
  status,
  isLoading,
}) => {
  const isTablet = useTablet();

  const data = useMemo<SplitPaymentTableModel[]>(
    () =>
      items.flatMap(
        (item) =>
          item.payouts?.map((payout) => ({
            recipient: item.recipientAddress || '',
            amount: payout.amount || '0',
            tokenAddress: payout.tokenAddress || '',
            percent: 0,
            id: item.id,
          })) || [],
      ) || [],
    [items],
  );

  const columns = useGetSplitPaymentColumns(data, status, isLoading);

  return (
    <div className="mt-7">
      <h5 className="mb-3 mt-6 text-2">
        {formatText({ id: 'actionSidebar.payments' })}
      </h5>
      <Table<SplitPaymentTableModel>
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
                  percent: 0,
                  amount: '0',
                  tokenAddress: '0x000',
                  id: 0,
                },
                {
                  recipient: '0x000',
                  percent: 0,
                  amount: '0',
                  tokenAddress: '0x000',
                  id: 1,
                },
                {
                  recipient: '0x000',
                  percent: 0,
                  amount: '0',
                  tokenAddress: '0x000',
                  id: 2,
                },
              ]
            : data
        }
        columns={columns}
        renderCellWrapper={(_, content) => content}
        verticalLayout={isTablet}
        withBorder={false}
      />
    </div>
  );
};

SplitPaymentTable.displayName = displayName;

export default SplitPaymentTable;
