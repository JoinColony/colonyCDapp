import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { type NativeTokenStatusInput } from '~gql';
import CurrencyConversion from '~shared/CurrencyConversion/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type Token } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/index.ts';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types.ts';

import TokenAvatar from '../TokenAvatar/index.ts';

import { type BalanceTableFieldModel } from './types.ts';

export const useBalanceTableColumns = (
  nativeToken: Token,
  nativeTokenStatus?: NativeTokenStatusInput | null,
): ColumnDef<BalanceTableFieldModel, string>[] => {
  const columnHelper = useMemo(
    () => createColumnHelper<BalanceTableFieldModel>(),
    [],
  );

  const columns: ColumnDef<BalanceTableFieldModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'asset',
        header: () => formatText({ id: 'table.row.asset' }),
        cell: ({ row }) => {
          if (!row.original.token || !nativeTokenStatus) return [];

          return (
            <TokenAvatar
              token={row.original.token}
              tokenAddress={nativeToken.tokenAddress}
              nativeTokenStatus={nativeTokenStatus}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'symbol',
        size: 100,
        header: () => formatText({ id: 'table.row.symbol' }),
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.token?.symbol}</span>
        ),
      }),
      columnHelper.display({
        id: 'type',
        size: 130,
        header: () => formatText({ id: 'table.row.type' }),
        cell: ({ row }) => {
          const isTokenNative =
            row.original.token?.tokenAddress === nativeToken.tokenAddress;
          return (
            <span className="hidden sm:flex">
              {isTokenNative && (
                <TokenTypeBadge tokenType={TOKEN_TYPE.native}>
                  {formatText({ id: 'token.type.native' })}
                </TokenTypeBadge>
              )}
            </span>
          );
        },
      }),
      columnHelper.accessor('balance', {
        header: () => formatText({ id: 'table.row.balance' }),
        size: 165,
        cell: ({ row }) => {
          return (
            <div className="flex flex-col justify-center">
              <Numeral
                value={row.original.balance}
                decimals={getTokenDecimalsWithFallback(
                  row.original.token?.decimals,
                )}
                className="text-1 text-gray-900"
                suffix={row.original.token?.symbol}
              />
              <CurrencyConversion
                tokenBalance={row.original.balance}
                contractAddress={row.original.token?.tokenAddress ?? ''}
                className="text-gray-600 !text-sm"
              />
            </div>
          );
        },
      }),
    ],
    [columnHelper, nativeToken.tokenAddress, nativeTokenStatus],
  );

  return columns;
};
