import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMobile } from '~hooks';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import CurrencyConversion from '~shared/CurrencyConversion/index.ts';
import Numeral, { getFormattedNumeralValue } from '~shared/Numeral/index.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/index.ts';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types.ts';

import TokenAvatar from '../TokenAvatar/index.ts';

import { useFiltersContext } from './Filters/FilterContext/FiltersContext.tsx';
import { type BalanceTableFieldModel } from './types.ts';

export const useBalancesData = (): BalanceTableFieldModel[] => {
  const {
    colony: { tokens: colonyTokens, balances, nativeToken },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { attributeFilters, tokenTypes, searchFilter } = useFiltersContext();

  const tokensData = useMemo(
    () =>
      colonyTokens?.items.map((item) => {
        const currentTokenBalance =
          getBalanceForTokenAndDomain(
            balances,
            item?.token?.tokenAddress || '',
            selectedDomain ? Number(selectedDomain.nativeId) : undefined,
          ) || 0;
        const decimals = getTokenDecimalsWithFallback(item?.token.decimals);
        const convertedValue = convertToDecimal(
          currentTokenBalance,
          decimals || 0,
        );

        const formattedValue = getFormattedNumeralValue(
          convertedValue,
          currentTokenBalance,
        );

        return {
          ...item,
          balance: typeof formattedValue === 'string' ? formattedValue : '',
        };
      }),
    [colonyTokens, balances, selectedDomain],
  );

  const filteredTokens = tokensData?.filter((token) => {
    if (
      Object.values(attributeFilters).some((attributeFilter) => attributeFilter)
    ) {
      return attributeFilters.native
        ? token.token?.tokenAddress === nativeToken.tokenAddress
        : token.token?.tokenAddress !== nativeToken.tokenAddress;
    }

    if (Object.values(tokenTypes).some((tokenTypeFilter) => tokenTypeFilter)) {
      return tokenTypes[token?.token?.tokenAddress || 0];
    }

    return true;
  });

  const searchedTokens = filteredTokens?.filter(
    ({ token }) =>
      token?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      token?.symbol.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const sortedTokens =
    useMemo(
      () =>
        searchedTokens?.sort((a, b) => {
          if (!a.balance || !b.balance) return 0;
          return parseInt(b.balance, 10) - parseInt(a.balance, 10);
        }),
      [searchedTokens],
    ) || [];

  return sortedTokens;
};

export const useBalanceTableColumns = (
  nativeToken,
  balances,
  nativeTokenStatus,
  domainId = 1,
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
          'pr-2 pl-0': isMobile,
        }),
        cell: ({ row }) => {
          const currentTokenBalance =
            getBalanceForTokenAndDomain(
              balances,
              row.original.token?.tokenAddress || '',
              domainId,
            ) || 0;

          return (
            <div className="text-right ml-auto">
              <Numeral
                value={currentTokenBalance}
                decimals={getTokenDecimalsWithFallback(
                  row.original.token?.decimals,
                )}
                className="text-1 text-gray-900 block"
                suffix={row.original.token?.symbol}
              />
              <CurrencyConversion
                tokenBalance={currentTokenBalance}
                contractAddress={row.original.token?.tokenAddress ?? ''}
                className="text-gray-600 !text-sm block"
              />
            </div>
          );
        },
      }),
    ];
  }, [
    balances,
    domainId,
    isMobile,
    nativeToken.tokenAddress,
    nativeTokenStatus,
  ]);

  return columns;
};
