import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import Numeral from '~shared/Numeral/index.ts';
import { type ColonyClaims } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import AcceptButton from '../AcceptButton/index.ts';

export const useTokenTableColumns = (): ColumnDef<ColonyClaims, string>[] => {
  const columnHelper = useMemo(() => createColumnHelper<ColonyClaims>(), []);

  const columns: ColumnDef<
    ColonyClaims,
    string | boolean | null | undefined
  >[] = useMemo(
    () => [
      columnHelper.accessor('amount', {
        sortingFn: (a, b) => {
          return BigNumber.from(a.original.amount).gt(
            BigNumber.from(b.original.amount),
          )
            ? 1
            : -1;
        },
        header: () => formatText({ id: 'incomingFundsPage.table.amount' }),
        cell: ({ row }) => (
          <Numeral
            value={row.original.amount}
            decimals={row.original.token?.decimals}
            suffix={` ${row.original.token?.symbol}`}
            className="text-gray-900 text-1"
          />
        ),
      }),
      columnHelper.accessor('isClaimed', {
        size: 120,
        sortUndefined: -1,
        sortingFn: (a, b) => {
          if (a.original.isClaimed && b.original.isClaimed) {
            return 0;
          }
          if (a.original.isClaimed) {
            return -1;
          }
          return 1;
        },
        header: () => formatText({ id: 'incomingFundsPage.table.claim' }),
        cell: ({ row }) => {
          return (
            <div className="flex w-full items-center justify-end">
              {row.original.isClaimed ? (
                <p className="w-full text-right text-sm text-gray-400">
                  {formatText({ id: 'incomingFundsPage.table.accepted' })}
                </p>
              ) : (
                <AcceptButton
                  tokenAddresses={[row.original.token?.tokenAddress || '']}
                >
                  {formatText({ id: 'button.accept' })}
                </AcceptButton>
              )}
            </div>
          );
        },
      }),
    ],
    [columnHelper],
  );

  return columns;
};
