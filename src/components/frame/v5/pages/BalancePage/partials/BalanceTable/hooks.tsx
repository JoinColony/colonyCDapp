import { Id } from '@colony/colony-js';
import {
  type ColumnDef,
  createColumnHelper,
  type Row,
} from '@tanstack/react-table';
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
import { getObjectValues } from '~utils/objects/index.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import TokenTypeBadge from '~v5/common/Pills/TokenTypeBadge/index.ts';
import { TOKEN_TYPE } from '~v5/common/Pills/TokenTypeBadge/types.ts';
import { type NullableColumnDef } from '~v5/common/Table/types.ts';
import { makeMenuColumn } from '~v5/common/Table/utils.tsx';
import { type MeatBallMenuProps } from '~v5/shared/MeatBallMenu/types.ts';

import TokenCell from '../TokenCell/index.ts';

import { useFiltersContext } from './Filters/FiltersContext/FiltersContext.ts';
import { type BalanceTableFieldModel } from './types.ts';

export const useBalancesData = (): BalanceTableFieldModel[] => {
  const {
    colony: { tokens: colonyTokens, balances, nativeToken },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { filters, searchFilter } = useFiltersContext();
  const { balancesByToken: expenditureBalances, loading } =
    useColonyExpenditureBalances();

  const {
    attribute: attributeFilters,
    token: tokenFilters,
    chain: chainFilters,
  } = filters;

  const tokensData = useMemo(
    () =>
      colonyTokens?.items.filter(notNull).map((item) => {
        const colonyTokenBalance = getBalanceForTokenAndDomain({
          balances,
          tokenAddress: item.token.tokenAddress,
          tokenChainId: item.token.chainMetadata.chainId,
          domainId: selectedDomain
            ? Number(selectedDomain.nativeId)
            : undefined,
        });

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
          loading,
        };
      }) ?? [],
    [
      colonyTokens?.items,
      balances,
      selectedDomain,
      expenditureBalances,
      loading,
    ],
  );

  const filteredTokens = tokensData?.filter(({ token: { tokenAddress } }) => {
    if (attributeFilters.native.isChecked) {
      if (getObjectValues(tokenFilters).some(({ isChecked }) => isChecked)) {
        return (
          tokenAddress === nativeToken.tokenAddress &&
          tokenFilters[tokenAddress || 0]
        );
      }
      return tokenAddress === nativeToken.tokenAddress;
    }

    if (getObjectValues(tokenFilters).some(({ isChecked }) => isChecked)) {
      return tokenFilters[tokenAddress]?.isChecked;
    }

    return true;
  });

  const searchedChainIds = getObjectValues(chainFilters)
    .filter(({ isChecked }) => isChecked)
    .map(({ id }) => id);

  const searchedTokens = filteredTokens?.filter(({ token }) =>
    searchedChainIds.length
      ? searchedChainIds.includes(token.chainMetadata.chainId)
      : true &&
        (token?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          token?.symbol.toLowerCase().includes(searchFilter.toLowerCase())),
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
  getMenuProps?: (
    row: Row<BalanceTableFieldModel>,
  ) => MeatBallMenuProps | undefined,
): ColumnDef<BalanceTableFieldModel, string>[] => {
  const isMobile = useMobile();

  const columnHelper = useMemo(
    () => createColumnHelper<BalanceTableFieldModel>(),
    [],
  );

  const menuColumn: NullableColumnDef<BalanceTableFieldModel> = useMemo(
    () =>
      getMenuProps
        ? makeMenuColumn({
            helper: columnHelper,
            getMenuProps,
            cellProps: {
              staticSize: isMobile ? '2.25rem' : undefined,
              size: 60,
            },
          })
        : null,
    [columnHelper, getMenuProps, isMobile],
  );

  const columns: ColumnDef<BalanceTableFieldModel, string>[] = useMemo(() => {
    return [
      columnHelper.display({
        id: 'asset',
        header: () => formatText({ id: 'table.row.asset' }),
        headCellClassName: isMobile ? 'pr-2' : undefined,
        cell: ({ row }) => {
          if (!row.original.token) return [];

          if (row.original.loading) {
            return <div className="h-4 w-40 skeleton" />;
          }

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
        cell: ({ row }) => {
          if (row.original.loading) {
            return <div className="h-4 w-12 skeleton" />;
          }

          return (
            <span className="text-gray-600">
              {multiLineTextEllipsis(row.original.token?.symbol ?? '', 5)}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'type',
        size: 130,
        header: () => formatText({ id: 'table.row.type' }),
        cell: ({ row }) => {
          if (row.original.loading) {
            return <div className="h-4 w-12 skeleton" />;
          }

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
        id: 'balance',
        header: () => formatText({ id: 'table.row.balance' }),
        size: isMobile ? 110 : 165,
        headCellClassName: clsx('text-right', {
          'pl-0 pr-2': isMobile,
        }),
        cell: ({ row }) => {
          const currentTokenBalance = row.original.balance;

          if (row.original.loading) {
            return <div className="ml-auto h-4 w-24 skeleton" />;
          }

          return (
            <div className="ml-auto text-right">
              <Numeral
                value={currentTokenBalance}
                decimals={getTokenDecimalsWithFallback(
                  row.original.token?.decimals,
                )}
                className="block text-gray-900 text-1"
                suffix={` ${multiLineTextEllipsis(row.original.token?.symbol ?? '', 5)}`}
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
  }, [isMobile, nativeToken.tokenAddress, nativeTokenStatus, columnHelper]);

  return menuColumn ? [...columns, menuColumn] : columns;
};
