import { CoinVertical, ShieldCheck } from '@phosphor-icons/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
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

  const [searchValue, setSearchValue] = useState('');

  const [value, setValue] = useState<Partial<FundsTableFilters>>({
    status: {
      approved: true,
      unapproved: false,
    },
    type: {},
  });

  const visibleTokens = allClaims.filter((visibleToken) => {
    const { type = {}, status } = value;

    if (Object.values(type).some((tokenTypeFilter) => tokenTypeFilter)) {
      return type[visibleToken?.token?.tokenAddress || 0];
    }

    return (
      ((!status || status.approved) && visibleToken.isApproved) ||
      (status && status.unapproved && !visibleToken.isApproved)
    );
  });

  const searchedTokens = visibleTokens.filter(
    ({ token }) =>
      token?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      token?.symbol.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const tokenTypeFilters = colonyTokens.map(({ token }) => ({
    name: token.tokenAddress,
    label: (
      <div className="flex items-center gap-2">
        <TokenIcon token={token} size="xxxs" />
        {token.symbol}
      </div>
    ),
  }));

  const filters: FilterProps<FundsTableFilters> = {
    onChange: setValue,
    onSearch: setSearchValue,
    searchValue,
    value,
    searchInputLabel: formatMessage({
      id: 'filter.incoming.funds.search.title',
    }),
    searchInputPlaceholder: formatMessage({
      id: 'filter.incoming.funds.input.placeholder',
    }),
    items: [
      {
        name: 'status',
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
      {
        name: 'type',
        label: formatText({ id: 'incomingFundsPage.filter.tokenType' }),
        title: formatText({ id: 'incomingFundsPage.filter.approvedTokens' }),
        icon: CoinVertical,
        items: tokenTypeFilters,
      },
    ],
  };

  return {
    filters,
    searchedTokens,
  };
};
