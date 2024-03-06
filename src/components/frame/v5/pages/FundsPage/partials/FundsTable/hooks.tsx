import { CoinVertical, ShieldCheck } from '@phosphor-icons/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { isEqual } from 'lodash';
import React, { useMemo, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import { type FilterProps } from '../Filter/types.ts';
import TokenTable from '../TokenTable/index.ts';

import {
  type FundsTableFilters,
  type FundsTableModel,
  type UseFundsTableProps,
} from './types.ts';

export const useFundsTableColumns = (): ColumnDef<
  FundsTableModel,
  string
>[] => {
  const columnHelper = useMemo(() => createColumnHelper<FundsTableModel>(), []);

  const columns: ColumnDef<FundsTableModel, string>[] = useMemo(
    () => [
      columnHelper.display({
        header: () => null,
        id: 'token',
        cell: ({ row }) => (
          <TokenTable
            key={row.original.token?.tokenAddress}
            token={row.original.token}
          />
        ),
      }),
    ],
    [columnHelper],
  );

  return columns;
};

export const useFundsTable = (): UseFundsTableProps => {
  const { colony } = useColonyContext();
  const claims = useColonyFundsClaims();
  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items.filter(notNull).sort((a, b) => {
        if (!a.token || !b.token) return 0;

        return a.token.name
          .toLowerCase()
          .localeCompare(b.token.name.toLowerCase());
      }) || [],
    [colony.tokens?.items],
  );
  const colonyClaims = colonyTokens.filter(({ token }) =>
    claims.some(
      ({ token: claimToken }) =>
        claimToken?.tokenAddress === token?.tokenAddress,
    ),
  );
  const unapprovedClaims = claims
    .filter(
      ({ token: claimToken }) =>
        !colonyTokens.some(
          ({ token: colonyToken }) =>
            colonyToken?.tokenAddress === claimToken?.tokenAddress,
        ),
    )
    .filter((claim, index, self) => {
      const firstIndex = self.findIndex(
        ({ token: claimToken }) =>
          claimToken?.tokenAddress === claim.token?.tokenAddress,
      );
      return firstIndex === index;
    })
    .sort((a, b) => {
      if (!a.token || !b.token) return 0;

      return a.token.name
        .toLowerCase()
        .localeCompare(b.token.name.toLowerCase());
    });
  const allClaims = [...colonyClaims, ...unapprovedClaims].map((token) => ({
    ...token,
    isApproved: colonyTokens.some(
      ({ token: colonyToken }) =>
        colonyToken.tokenAddress === token?.token?.tokenAddress,
    ),
  }));

  const defaultStatusFilter = {
    approved: true,
    unapproved: false,
  };
  const [searchValue, setSearchValue] = useState('');
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [filterValue, setFilterValue] = useState<Partial<FundsTableFilters>>({
    status: defaultStatusFilter,
    type: {},
  });

  const visibleTokens = allClaims.filter((visibleToken) => {
    const { type = {}, status } = filterValue;

    if (status && status.approved && status.unapproved) {
      return (
        visibleToken &&
        (!Object.values(type).some((tokenTypeFilter) => tokenTypeFilter) ||
          type[visibleToken?.token?.tokenAddress || 0])
      );
    }
    if (status && status.approved) {
      return (
        visibleToken.isApproved &&
        (!Object.values(type).some((tokenTypeFilter) => tokenTypeFilter) ||
          type[visibleToken?.token?.tokenAddress || 0])
      );
    }
    if (status && status.unapproved) {
      return (
        !visibleToken.isApproved &&
        (!Object.values(type).some((tokenTypeFilter) => tokenTypeFilter) ||
          type[visibleToken?.token?.tokenAddress || 0])
      );
    }

    if (Object.values(type).some((tokenTypeFilter) => tokenTypeFilter)) {
      return type[visibleToken?.token?.tokenAddress || 0];
    }

    return true;
  });

  const searchedTokens = visibleTokens.filter(
    ({ token }) =>
      token?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      token?.symbol.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const tokenTypeFilters = colonyTokens.map(({ token }) => ({
    name: token.tokenAddress,
    symbol: token.symbol,
    label: (
      <div className="flex items-center gap-2">
        <TokenIcon token={token} size="xxxs" />
        {token.symbol}
      </div>
    ),
  }));

  const filters: FilterProps<FundsTableFilters> = {
    onChange: (value) => {
      if (!isEqual(value.status, defaultStatusFilter)) {
        setIsStatusChanged(true);
      }

      setFilterValue(value);
    },
    onSearch: setSearchValue,
    searchValue,
    value: filterValue,
    searchInputLabel: formatMessage({
      id: 'filter.incoming.funds.search.title',
    }),
    searchInputPlaceholder: formatMessage({
      id: 'filter.incoming.funds.input.placeholder',
    }),
    items: [
      {
        name: 'type',
        filterName: formatText({ id: 'incomingFundsPage.filter.type' }),
        label: formatText({ id: 'incomingFundsPage.filter.tokenType' }),
        title: formatText({ id: 'incomingFundsPage.filter.approvedTokens' }),
        icon: CoinVertical,
        items: tokenTypeFilters,
      },
      {
        name: 'status',
        filterName: formatText({ id: 'incomingFundsPage.filter.status' }),
        label: formatText({ id: 'incomingFundsPage.filter.tokenStatus' }),
        icon: ShieldCheck,
        title: formatText({ id: 'incomingFundsPage.filter.tokenStatus' }),
        items: [
          {
            name: 'approved',
            label: formatText({ id: 'incomingFundsPage.filter.approved' }),
          },
          {
            name: 'unapproved',
            label: formatText({ id: 'incomingFundsPage.filter.unapproved' }),
          },
        ],
      },
    ],
  };

  const activeFilters = filters.items
    .map((item) => {
      const activeItem = filters.value[item.name];

      if (item.name === 'status' && !isStatusChanged) {
        return undefined;
      }

      if (activeItem) {
        const activeFilter = Object.keys(activeItem).filter(
          (key) => activeItem[key],
        );
        const activeFiltersForItem = activeFilter.map((filterKey) => {
          const filter = item.items.find((f) => f.name === filterKey);

          return filter?.symbol || filter?.label;
        });

        return activeFiltersForItem.length > 0
          ? { filterName: item.filterName, filters: activeFiltersForItem }
          : null;
      }

      return undefined;
    })
    .filter(Boolean);

  return {
    filters,
    searchedTokens,
    activeFilters,
  };
};
