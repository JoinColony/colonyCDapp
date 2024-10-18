import { CaretDown } from '@phosphor-icons/react';
import { type Row, createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { useMemo } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { useSearchStreamingPaymentsQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  convertToMonthlyAmount,
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';

import StreamingActionsTable from '../StreamingActionsTable/StreamingActionsTable.tsx';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import { type SearchStreamingPaymentFilterVariable } from './FiltersContext/types.ts';
import { type StreamingPaymentFilters } from './partials/StreamingPaymentFilters/types.ts';
import UserField from './partials/UserField/UserField.tsx';
import UserStreams from './partials/UserStreams/UserStreams.tsx';
import { type StreamingTableFieldModel } from './types.ts';
import {
  filterByActionStatus,
  filterByEndCondition,
  searchStreamingPayments,
} from './utils.ts';

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
        .filter(([, value]) => value === true)
        .map(([tokenAddress]) => ({
          tokenAddress: { eq: tokenAddress },
        }))
    : [];

  return {
    and: [
      { colonyId: { eq: colonyAddress } },
      ...activeTokens,
      dateFilter,
    ].filter((obj) => Object.keys(obj).length > 0),
  };
};

export const useStreamingPaymentTable = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { activeFilters, searchFilter } = useStreamingFiltersContext();

  const { data, loading } = useSearchStreamingPaymentsQuery({
    variables: {
      filter: getSearchStreamingPaymentsFilterVariable(
        colonyAddress,
        useMemo(() => activeFilters, [activeFilters]),
      ),
    },
    fetchPolicy: 'network-only',
  });

  const { currentBlockTime: blockTime } = useCurrentBlockTime();
  const { totalMembers: members } = useMemberContext();
  const allTokens = useGetAllTokens();

  const groupedStreamingPayments: StreamingTableFieldModel[] = (
    data?.searchStreamingPayments?.items || []
  )
    .filter(notNull)
    .map((item) => {
      const { amountAvailableToClaim } = getStreamingPaymentAmountsLeft(
        item,
        Math.floor(blockTime ?? Date.now() / 1000),
      );
      const paymentStatus = getStreamingPaymentStatus({
        streamingPayment: item,
        currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
        amountAvailableToClaim,
      });
      const selectedToken = allTokens.find(
        (token) => token.token.tokenAddress === item.tokenAddress,
      );

      return {
        title: item.actions?.items[0]?.metadata?.customTitle || '',
        token: item.token || selectedToken?.token,
        nativeDomainId: item.nativeDomainId,
        paymentId: item.id,
        amount: item.amount,
        creatorAddress: item.creatorAddress,
        recipientAddress: item.recipientAddress,
        interval: item.interval,
        transactionId: item.actions?.items[0]?.transactionHash || '',
        id: item.id,
        nativeId: item.nativeId,
        startTime: item.startTime,
        endTime: item.endTime,
        tokenAddress: item.tokenAddress,
        createdAt: item.createdAt,
        status: paymentStatus,
        endCondition: item.metadata?.endCondition,
      };
    })
    .reduce<StreamingTableFieldModel[]>((result, item) => {
      const { recipientAddress } = item;

      let existingEntryIndex = result.findIndex((entry) => {
        return entry.user === recipientAddress;
      });

      if (existingEntryIndex < 0) {
        result.push({
          user: recipientAddress,
          userStreams: [],
          actions: [],
        });
        existingEntryIndex = result.length - 1;
      }

      const existingUser = result[existingEntryIndex];
      const tokenAddress = item.token?.tokenAddress || '';

      let userStreamIndex = existingUser.userStreams.findIndex(
        (stream) => stream.tokenAddress === tokenAddress,
      );

      const isPaymentActive = item.status === StreamingPaymentStatus.Active;

      if (isPaymentActive) {
        if (userStreamIndex < 0) {
          existingUser.userStreams.push({
            tokenAddress,
            amount: '0',
            tokenDecimals: item.token?.decimals || DEFAULT_TOKEN_DECIMALS,
            tokenSymbol: item.token?.symbol || '',
          });
          userStreamIndex = existingUser.userStreams.length - 1;
        }

        const monthlyAmount = convertToMonthlyAmount(
          BigNumber.from(item.amount),
          Number(item.interval),
        );

        const currentStream = existingUser.userStreams[userStreamIndex];
        const totalAmount = BigNumber.from(currentStream.amount)
          .add(monthlyAmount)
          .toString();

        existingUser.userStreams[userStreamIndex] = {
          ...currentStream,
          amount: totalAmount,
        };
      }

      existingUser.actions = [...existingUser.actions, item];

      return result;
    }, [])
    .sort((a, b) => {
      const aHasActive = a.actions.some(
        (action) => action.status === StreamingPaymentStatus.Active,
      );
      const bHasActive = b.actions.some(
        (action) => action.status === StreamingPaymentStatus.Active,
      );

      if (aHasActive === bHasActive) {
        return 0;
      }
      return aHasActive ? -1 : 1;
    });

  const searchedStreamingPayments = useMemo(
    () =>
      searchStreamingPayments(groupedStreamingPayments, members, searchFilter),
    [groupedStreamingPayments, searchFilter, members],
  );

  const filteredActions = searchedStreamingPayments.filter(
    (action) =>
      filterByActionStatus(action, activeFilters.statuses) &&
      filterByEndCondition(action, activeFilters.endConditions),
  );

  return {
    items: filteredActions,
    loading,
  };
};
