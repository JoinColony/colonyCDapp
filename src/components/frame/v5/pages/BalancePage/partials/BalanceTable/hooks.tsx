import { Id } from '@colony/colony-js';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import { useColonyExpenditureBalances } from '~hooks/useColonyExpenditureBalances.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import CurrencyConversion from '~shared/CurrencyConversion/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type NativeTokenStatus, type Token } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/index.ts';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types.ts';

import TokenCell from '../TokenCell/index.ts';

import { useFiltersContext } from './Filters/FiltersContext/FiltersContext.ts';
import { type BalanceTableFieldModel } from './types.ts';

export const useBalancesData = (): BalanceTableFieldModel[] => {
  const {
    colony: { tokens: colonyTokens, balances, nativeToken },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { attributeFilters, tokenTypes, searchFilter } = useFiltersContext();
  const { balancesByToken: expenditureBalances } =
    useColonyExpenditureBalances();

  const tokensData = useMemo(
    () =>
      colonyTokens?.items.filter(notNull).map((item) => {
        const colonyTokenBalance = getBalanceForTokenAndDomain(
          balances,
          item.token.tokenAddress,
          selectedDomain ? Number(selectedDomain.nativeId) : undefined,
        );

        let totalBalance = colonyTokenBalance;
        if (!selectedDomain || selectedDomain.nativeId === Id.RootDomain) {
          // When "All teams" or Root domain is selected, add the token balance held in expenditures
          const expenditureTokenBalance =
            expenditureBalances[item.token.tokenAddress] ?? 0;

          totalBalance = totalBalance.add(expenditureTokenBalance);
        }

        return {
          ...item,
          balance: totalBalance,
        };
      }) ?? [],
    [colonyTokens?.items, balances, selectedDomain, expenditureBalances],
  );

  const filteredTokens = tokensData?.filter((token) => {
    if (attributeFilters.native) {
      if (
        Object.values(tokenTypes).some((tokenTypeFilter) => tokenTypeFilter)
      ) {
        return (
          token.token?.tokenAddress === nativeToken.tokenAddress &&
          tokenTypes[token.token?.tokenAddress || 0]
        );
      }
      return token.token?.tokenAddress === nativeToken.tokenAddress;
    }

    if (Object.values(tokenTypes).some((tokenTypeFilter) => tokenTypeFilter)) {
      return tokenTypes[token.token?.tokenAddress || 0];
    }

    return true;
  });

  const searchedTokens = filteredTokens?.filter(
    ({ token }) =>
      token?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      token?.symbol.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const sortedTokens = useMemo(
    () =>
      searchedTokens?.sort((a, b) => {
        if (!a.balance || !b.balance || a.balance.eq(b.balance)) return 0;

        return a.balance.gt(b.balance) ? -1 : 1;
      }),
    [searchedTokens],
  );

  return sortedTokens;
};

export const useBalanceTableColumns = (
  nativeToken: Token,
  nativeTokenStatus?: NativeTokenStatus | null,
): ColumnDef<BalanceTableFieldModel, string>[] => {
  const isMobile = useMobile();

  const columns: ColumnDef<BalanceTableFieldModel, string>[] = useMemo(() => {
    const columnHelper = createColumnHelper<BalanceTableFieldModel>();

    return [
      columnHelper.display({
        id: 'asset',
        header: () => formatText({ id: 'table.row.asset' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        cell: ({ row }) => {
          if (!row.original.token) return [];

          return (
            <TokenCell
              token={row.original.token}
              tokenAddress={nativeToken.tokenAddress}
              nativeTokenStatus={nativeTokenStatus}
            />
          );
        },
      }),
      columnHelper.display({
        id: 'symbol',
        size: isMobile ? 60 : 100,
        header: () => formatText({ id: 'table.row.symbol' }),
        headCellClassName: isMobile ? 'pr-2 pl-0' : undefined,
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
        size: isMobile ? 110 : 165,
        headCellClassName: clsx('text-right', {
          'pl-0 pr-2': isMobile,
        }),
        cell: ({ row }) => {
          const currentTokenBalance = row.original.balance;

          return (
            <div className="ml-auto text-right">
              <Numeral
                value={currentTokenBalance}
                decimals={getTokenDecimalsWithFallback(
                  row.original.token?.decimals,
                )}
                className="block text-gray-900 text-1"
                suffix={row.original.token?.symbol}
              />
              <CurrencyConversion
                tokenBalance={currentTokenBalance}
                tokenDecimals={
                  row.original.token
                    ? getTokenDecimalsWithFallback(row.original.token.decimals)
                    : 0
                }
                contractAddress={row.original.token?.tokenAddress ?? ''}
                className="block !text-sm text-gray-600"
              />
            </div>
          );
        },
      }),
    ];
  }, [isMobile, nativeToken.tokenAddress, nativeTokenStatus]);

  return columns;
};
