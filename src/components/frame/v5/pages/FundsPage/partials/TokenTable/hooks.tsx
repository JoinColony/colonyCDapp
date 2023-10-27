import React, { useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';

import Numeral from '~shared/Numeral';
import { ColonyClaims } from '~types';
import { formatText } from '~utils/intl';
import AcceptButton from '../AcceptButton';

export const useTokenTableColumns = (): ColumnDef<ColonyClaims, string>[] => {
  const columnHelper = useMemo(() => createColumnHelper<ColonyClaims>(), []);

  const columns: ColumnDef<ColonyClaims, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'amount',
        header: () => formatText({ id: 'incomingFundsPage.table.amount' }),
        cell: ({ row }) => (
          <Numeral
            value={row.original.amount}
            decimals={row.original.token?.decimals}
            suffix={row.original.token?.symbol}
            className="text-1 text-gray-900"
          />
        ),
      }),
      columnHelper.display({
        id: 'claim',
        size: 20,
        header: () => formatText({ id: 'incomingFundsPage.table.claim' }),
        cell: ({ row }) => (
          <AcceptButton tokenAddress={row.original.token?.tokenAddress || ''} />
        ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper],
  );

  return columns;
};
