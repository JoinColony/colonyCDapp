import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import Numeral from '~shared/Numeral/index.ts';
import { ColonyClaims } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import AcceptButton from '../AcceptButton/index.ts';

export const useTokenTableColumns = (): ColumnDef<ColonyClaims, string>[] => {
  const columnHelper = useMemo(() => createColumnHelper<ColonyClaims>(), []);

  const columns: ColumnDef<ColonyClaims, string>[] = useMemo(
    () => [
      columnHelper.accessor('amount', {
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
        size: 101,
        header: () => formatText({ id: 'incomingFundsPage.table.claim' }),
        cell: ({ row }) => (
          <AcceptButton
            tokenAddresses={[row.original.token?.tokenAddress || '']}
          >
            {formatText({ id: 'button.accept' })}
          </AcceptButton>
        ),
      }),
    ],
    [columnHelper],
  );

  return columns;
};
