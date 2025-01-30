import { useCallback, useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useColonyStreamingPayments } from '~hooks/useColonyStreamingPayments.ts';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { getStreamingPaymentStatus } from '~utils/streamingPayments.ts';

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

  const { streamingPayments, fetchMore, loading } = useColonyStreamingPayments({
    ...(isFilteredByWalletAddress &&
      walletAddress && {
        recipientAddress: walletAddress,
      }),
    ...(nativeDomainId && {
      domainId: nativeDomainId,
    }),
    colonyId: colony.colonyAddress,
  });

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
    async (items: StreamingPaymentItems, currentTimestamp: number) => {
      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond: ratePerSecondValue,
        lastMonthStreaming,
      } = await calculateTotalsFromStreams({
        streamingPayments: items,
        currentTimestamp,
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
    [colony, currency],
  );

  const getTotalActiveStreamingPayments = useCallback(
    (items: StreamingPaymentItems) => {
      const activeStreams = items.filter((item) => {
        return (
          getStreamingPaymentStatus({
            streamingPayment: item,
            currentTimestamp: Math.floor(blockTime ?? Date.now() / 1000),
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
    if (streamingPayments.length) {
      getTotalFunds(
        streamingPayments,
        Math.floor(blockTime ?? Date.now() / 1000),
      );
      getTotalActiveStreamingPayments(streamingPayments);
    }
  }, [
    blockTime,
    getTotalFunds,
    streamingPayments,
    getTotalActiveStreamingPayments,
  ]);

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
