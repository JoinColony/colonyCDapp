import { CoinVertical, CubeFocus, ShieldCheck } from '@phosphor-icons/react';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { isEqual } from 'lodash';
import React, { useMemo, useState } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';
import { useChainOptions } from '~v5/common/ActionSidebar/partials/ChainSelect/hooks.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

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

  const validChainFilters = useChainOptions();

  const colonyTokens = useMemo(
    () =>
      colony.tokens?.items.filter(notNull).sort((a, b) => {
        if (!a.token || !b.token) return 0;

        // Native chain tokens should always be last
        if (a.token.tokenAddress === ADDRESS_ZERO) {
          return 1;
        }

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

      // Native chain tokens should always be last
      if (a.token.tokenAddress === ADDRESS_ZERO) {
        return 1;
      }

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

  const chainFilters = validChainFilters.map(({ icon: Icon, label }) => ({
    name: label,
    symbol: label,
    label: (
      <div className="flex items-start gap-2">
        {Icon && <Icon size={20} />}
        {label}
      </div>
    ),
  }));

  const tokenTypeFilters = colonyTokens.map(({ token }) => ({
    name: token.tokenAddress,
    symbol: token.symbol,
    label: (
      <div className="flex items-center gap-2">
        <TokenAvatar
          size={18}
          tokenName={token.name}
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
        />
        {multiLineTextEllipsis(token.symbol, 5)}
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
      {
        name: 'chain',
        filterName: formatText({ id: 'incomingFundsPage.filter.chain' }),
        label: formatText({ id: 'incomingFundsPage.filter.chain' }),
        icon: CubeFocus,
        title: formatText({ id: 'incomingFundsPage.filter.availableChains' }),
        items: chainFilters,
        containerClassName: 'sm:max-w-full',
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

  const searchedTokens = useMemo(() => {
    const searchedChains = activeFilters.find(
      (activeFilter) => activeFilter?.filterName === 'Chain',
    )?.filters;

    const searchedChainIds = validChainFilters
      .filter(({ label }) => searchedChains?.includes(label))
      ?.map(({ value }) => value);

    const searchedTokensByChainIds = visibleTokens.filter(({ token }) =>
      searchedChainIds?.length && token
        ? searchedChainIds.includes(token?.chainMetadata.chainId)
        : true,
    );

    const searchResults = searchedTokensByChainIds.filter(
      ({ token }) =>
        token?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        token?.symbol.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return searchResults;
  }, [activeFilters, searchValue, validChainFilters, visibleTokens]);

  return {
    filters,
    searchedTokens,
    activeFilters,
  };
};
