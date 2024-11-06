import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useGetStreamingPaymentsByColonyQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';

import { type StreamingPaymentItems } from './types.ts';
import { calculateTotalsFromStreams } from './utils.ts';

interface useStreamingPaymentsTotalFundsProps {
  isFilteredByWalletAddress?: boolean;
  nativeDomainId?: number;
}

export const useStreamingPaymentsTotalFunds = ({
  isFilteredByWalletAddress = true,
  nativeDomainId = undefined,
}: useStreamingPaymentsTotalFundsProps) => {
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};
  const { currentBlockTime: blockTime } = useCurrentBlockTime();
  const { colony } = useColonyContext();

  const { data, loading, fetchMore } = useGetStreamingPaymentsByColonyQuery({
    variables: {
      ...(isFilteredByWalletAddress &&
        walletAddress && {
          recipientAddress: walletAddress,
        }),
      ...(nativeDomainId && {
        domainId: nativeDomainId,
      }),
      colonyId: colony.colonyAddress,
    },
    onCompleted: (receivedData) => {
      if (receivedData?.getStreamingPaymentsByColony?.nextToken) {
        fetchMore({
          variables: {
            nextToken: receivedData.getStreamingPaymentsByColony.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              ...prev,
              getStreamingPaymentsByColony: {
                ...prev.getStreamingPaymentsByColony,
                items: [
                  ...(prev?.getStreamingPaymentsByColony?.items || []),
                  ...(fetchMoreResult?.getStreamingPaymentsByColony?.items ||
                    []),
                ],
                nextToken:
                  fetchMoreResult?.getStreamingPaymentsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const streamingPayments = useMemo(
    () => data?.getStreamingPaymentsByColony?.items?.filter(notNull) || [],
    [data?.getStreamingPaymentsByColony?.items],
  );

  const { currency } = useCurrencyContext();

  const [totalFunds, setTotalFunds] = useState<{
    totalAvailable: number;
    totalClaimed: number;
  }>({
    totalAvailable: 0,
    totalClaimed: 0,
  });
  const [isAnyPaymentActive, setIsAnyPaymentActive] = useState(false);
  const [ratePerSecond, setRatePerSecond] = useState<number>(0);
  const [activeStreamingPayments, setActiveStreamingPayments] = useState(0);
  const [totalLastMonthStreaming, setTotalLastMonthStreaming] = useState(0);

  const getTotalFunds = useCallback(
    async (items: StreamingPaymentItems) => {
      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond: ratePerSecondValue,
        lastMonthStreaming,
      } = await calculateTotalsFromStreams({
        streamingPayments: items,
        currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
        currency,
        colony,
      });

      setTotalLastMonthStreaming(lastMonthStreaming);

      setIsAnyPaymentActive(isAtLeastOnePaymentActive);
      setTotalFunds({
        totalAvailable,
        totalClaimed,
      });
      setRatePerSecond(ratePerSecondValue);
    },
    [blockTime, colony, currency],
  );

  const getTotalActiveStreamingPayments = useCallback(
    (items: StreamingPaymentItems) => {
      const activeStreams = items.filter((item) => {
        const { amountAvailableToClaim } = getStreamingPaymentAmountsLeft(
          item,
          Math.floor(blockTime ?? Date.now() / 1000),
        );
        return (
          getStreamingPaymentStatus({
            streamingPayment: item,
            currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
            amountAvailableToClaim,
          }) === StreamingPaymentStatus.Active
        );
      });

      setActiveStreamingPayments(activeStreams.length);
    },
    [blockTime],
  );

  useEffect(() => {
    fetchMore({
      variables: {
        ...(isFilteredByWalletAddress &&
          walletAddress && {
            recipientAddress: walletAddress,
          }),
        ...(nativeDomainId && {
          domainId: nativeDomainId,
        }),
        colonyId: colony.colonyAddress,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          ...prev,
          getStreamingPaymentsByColony: {
            ...prev.getStreamingPaymentsByColony,
            items: [
              ...(prev?.getStreamingPaymentsByColony?.items || []),
              ...(fetchMoreResult?.getStreamingPaymentsByColony?.items || []),
            ],
            nextToken: fetchMoreResult?.getStreamingPaymentsByColony?.nextToken,
          },
        };
      },
    });
  }, [
    colony.colonyAddress,
    fetchMore,
    walletAddress,
    isFilteredByWalletAddress,
    nativeDomainId,
  ]);

  useEffect(() => {
    getTotalFunds(streamingPayments);
    getTotalActiveStreamingPayments(streamingPayments);
  }, [getTotalFunds, streamingPayments, getTotalActiveStreamingPayments]);

  return {
    totalStreamed: totalFunds.totalClaimed + totalFunds.totalAvailable,
    totalFunds,
    isAnyPaymentActive,
    ratePerSecond,
    loading,
    currency,
    getTotalFunds,
    streamingPayments,
    activeStreamingPayments,
    totalLastMonthStreaming,
  };
};
