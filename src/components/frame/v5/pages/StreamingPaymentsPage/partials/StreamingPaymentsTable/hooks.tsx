import { CaretDown } from '@phosphor-icons/react';
import { createColumnHelper } from '@tanstack/react-table';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import React, { useEffect, useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { useSearchStreamingPaymentsQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  convertToMonthlyAmount,
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { useStreamingFiltersContext } from './FiltersContext/StreamingFiltersContext.ts';
import { type SearchStreamingPaymentFilterVariable } from './FiltersContext/types.ts';
import { type StreamingPaymentFilters } from './partials/StreamingPaymentFilters/types.ts';
import UserField from './partials/UserField/UserField.tsx';
import UserStreams from './partials/UserStreams/UserStreams.tsx';
import {
  type StreamingPaymentItem,
  type StreamingTableFieldModel,
} from './types.ts';
import {
  filterByActionStatus,
  filterByEndCondition,
  searchStreamingPayments,
  sortStreamingPayments,
} from './utils.ts';

export const useStreamingTableColumns = (loading: boolean) => {
  return useMemo(() => {
    const helper = createColumnHelper<StreamingTableFieldModel>();

    return [
      helper.display({
        id: 'user',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <UserField
            address={row.original.user}
            isLoading={loading}
            toggleExpanded={row.toggleExpanded}
          />
        ),
      }),
      helper.display({
        id: 'amount',
        staticSize: loading ? '0px' : '208px',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) =>
          loading ? null : (
            <UserStreams
              items={row.original.tokenTotalsPerMonth}
              toggleExpanded={row.toggleExpanded}
            />
          ),
      }),
      helper.display({
        id: 'expander',
        staticSize: loading ? '50%' : '2.25rem',
        header: () => null,
        enableSorting: false,
        cell: ({ row: { getIsExpanded, toggleExpanded } }) =>
          loading ? (
            <div className="flex items-center justify-end gap-[.625rem] pr-[1.125rem] sm:gap-[1.875rem]">
              <div className="h-5 w-[6.25rem] rounded-sm skeleton" />
              <CaretDown size={18} className="text-gray-100" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => toggleExpanded()}
              className="toggler flex h-full w-full items-center"
            >
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
      ...(activeTokens.length > 0 ? [{ or: activeTokens }] : []),
      dateFilter,
    ].filter((obj) => Object.keys(obj).length > 0),
  };
};

export const useStreamingPaymentTable = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { activeFilters, searchFilter } = useStreamingFiltersContext();

  const { data, loading, refetch } = useSearchStreamingPaymentsQuery({
    variables: {
      filter: getSearchStreamingPaymentsFilterVariable(
        colonyAddress,
        useMemo(() => activeFilters, [activeFilters]),
      ),
    },
    fetchPolicy: 'network-only',
  });

  const { currentBlockTime: blockTime, fetchCurrentBlockTime } =
    useCurrentBlockTime();
  const { totalMembers: members } = useMemberContext();
  const allTokens = useGetAllTokens();

  const nativeDomainId = useGetSelectedDomainFilter()?.nativeId;

  const filteredByDomainId = useMemo(
    () =>
      nativeDomainId
        ? data?.searchStreamingPayments?.items.filter(
            (item) => item?.nativeDomainId === nativeDomainId,
          )
        : data?.searchStreamingPayments?.items,
    [data?.searchStreamingPayments?.items, nativeDomainId],
  );

  const groupedStreamingPayments = (filteredByDomainId || [])
    .filter(notNull)
    .map((item) => {
      const { amountAvailableToClaim, amountClaimedToDate } =
        getStreamingPaymentAmountsLeft(
          item,
          Math.floor(blockTime ?? Date.now() / 1000),
        );
      const paymentStatus = getStreamingPaymentStatus({
        streamingPayment: item,
        currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
      });
      const selectedToken = allTokens.find(
        (token) => token.token.tokenAddress === item.tokenAddress,
      );
      const summedAmount = BigNumber.from(amountAvailableToClaim).add(
        BigNumber.from(amountClaimedToDate),
      );

      return {
        ...item,
        title: item.actions?.items[0]?.metadata?.customTitle || '',
        token: item.token || selectedToken?.token,
        paymentId: item.id,
        totalStreamedAmount: summedAmount.toString(),
        transactionId: item.actions?.items[0]?.transactionHash || '',
        status: paymentStatus,
        endCondition: item.metadata?.endCondition,
      };
    })
    .reduce<StreamingPaymentItem>((result, item) => {
      const { recipientAddress } = item;

      const newResult = { ...result };

      if (!newResult[recipientAddress]) {
        newResult[recipientAddress] = {
          tokenTotalsPerMonth: {},
          actions: [],
        };
      }

      const existingUser = newResult[recipientAddress];
      const tokenAddress = item.token?.tokenAddress || item.tokenAddress;

      const isPaymentActive = item.status === StreamingPaymentStatus.Active;

      if (!existingUser.tokenTotalsPerMonth[tokenAddress]) {
        existingUser.tokenTotalsPerMonth[tokenAddress] = {
          amount: '0',
          tokenDecimals: getTokenDecimalsWithFallback(item.token?.decimals),
          tokenSymbol: item.token?.symbol || '',
        };
      }

      const monthlyAmount = isPaymentActive
        ? convertToMonthlyAmount(
            BigNumber.from(item.amount),
            BigNumber.from(item.interval),
          )
        : '0';

      const currentStream = existingUser.tokenTotalsPerMonth[tokenAddress];
      const totalAmount = BigNumber.from(currentStream.amount)
        .add(monthlyAmount)
        .toString();

      existingUser.tokenTotalsPerMonth[tokenAddress] = {
        ...currentStream,
        amount: totalAmount,
      };

      existingUser.actions = [...existingUser.actions, item];

      return newResult;
    }, {});

  const paymentsArray: StreamingTableFieldModel[] = Object.entries(
    groupedStreamingPayments,
  ).map(([user, paymentData]) => ({
    user,
    ...paymentData,
  }));

  const searchedStreamingPayments = useMemo(
    () =>
      paymentsArray
        .map((action) => searchStreamingPayments(action, members, searchFilter))
        .filter(notNull),
    [paymentsArray, searchFilter, members],
  );

  const filteredActions = searchedStreamingPayments
    .map((action) => filterByActionStatus(action, activeFilters.statuses))
    .filter(notNull)
    .map((action) => filterByEndCondition(action, activeFilters.endConditions))
    .filter(notNull);

  const sortedActions = useMemo(
    () => sortStreamingPayments(filteredActions, activeFilters),
    [filteredActions, activeFilters],
  );

  useEffect(() => {
    fetchCurrentBlockTime();
  }, [data, fetchCurrentBlockTime]);

  return {
    items: sortedActions,
    loading,
    refetch,
  };
};
