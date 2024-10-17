import { CaretDown } from '@phosphor-icons/react';
import { type Row, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSearchStreamingPaymentsQuery } from '~gql';

import StreamingActionsTable from '../StreamingActionsTable/StreamingActionsTable.tsx';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import { type SearchStreamingPaymentFilterVariable } from './FiltersContext/types.ts';
import { type StreamingPaymentFilters } from './partials/StreamingPaymentFilters/types.ts';
import UserField from './partials/UserField/UserField.tsx';
import UserStreams from './partials/UserStreams/UserStreams.tsx';
import { type StreamingTableFieldModel } from './types.ts';

export const useRenderSubComponent = () => {
  return ({ row }: { row: Row<StreamingTableFieldModel> }) => (
    <StreamingActionsTable actionRow={row} />
  );
};

export const useStreamingTableColumns = (loading: boolean) => {
  return useMemo(() => {
    const helper = createColumnHelper<StreamingTableFieldModel>();

    return [
      helper.display({
        id: 'user',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <UserField address={row.original.user} isLoading={loading} />
        ),
      }),
      helper.display({
        id: 'amount',
        staticSize: '8.5rem',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) =>
          loading ? (
            <div className="h-5 w-10 skeleton" />
          ) : (
            <UserStreams items={row.original.userStreams} />
          ),
      }),
      helper.display({
        id: 'expander',
        staticSize: '2.25rem',
        header: () => null,
        enableSorting: false,
        cell: ({ row: { getIsExpanded, toggleExpanded } }) =>
          loading ? (
            <div className="h-4 w-4 skeleton" />
          ) : (
            <button type="button" onClick={() => toggleExpanded()}>
              <CaretDown
                size={18}
                className={clsx('transition', {
                  'rotate-180': getIsExpanded(),
                })}
              />
            </button>
          ),
        cellContentWrapperClassName: 'pl-0',
      }),
    ];
  }, [loading]);
};

const getSearchStreamingPaymentsFilterVariable = (
  colonyAddress: string,
  { dateFrom, dateTo, tokenTypes }: StreamingPaymentFilters = {},
): SearchStreamingPaymentFilterVariable => {
  const dateFilter =
    dateFrom && dateTo
      ? {
          createdAt: {
            range: [dateFrom?.toISOString(), dateTo?.toISOString()],
          },
        }
      : {
          ...(dateFrom
            ? {
                createdAt: {
                  gte: dateFrom?.toISOString(),
                },
              }
            : {}),
          ...(dateTo
            ? {
                createdAt: {
                  lte: dateTo?.toISOString(),
                },
              }
            : {}),
        };
  const activeTokens = tokenTypes
    ? Object.entries(tokenTypes)
        .filter(([, value]) => value)
        .map(([key]) => key)
    : [];

  return {
    colonyId: { eq: colonyAddress },
    // @TODO: Add support for multiple tokens
    tokenAddress:
      tokenTypes && tokenTypes?.length ? { eq: activeTokens[0] } : undefined,
    ...dateFilter,
  };
};

export const useStreamingPaymentTable = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { activeFilters } = useStreamingFiltersContext();
  const { data, loading } = useSearchStreamingPaymentsQuery({
    variables: {
      filter: getSearchStreamingPaymentsFilterVariable(
        colonyAddress,
        useMemo(() => activeFilters, [activeFilters]),
      ),
    },
    fetchPolicy: 'network-only',
  });

  return {
    items: data?.searchStreamingPayments?.items || [],
    loading,
  };
};
