import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { useGetStreamingPaymentsByColonyQuery } from '~gql';
import useCurrentBlockTime from '~hooks/useCurrentBlockTime.ts';
import { notNull } from '~utils/arrays/index.ts';

import { type StreamingPaymentItems } from './types.ts';
import { calculateTotalsFromStreams } from './utils.ts';

export const useStreamingPaymentsTotalFunds = () => {
  const { user } = useAppContext();
  const { walletAddress } = user ?? {};
  const { currentBlockTime: blockTime } = useCurrentBlockTime();
  const { colony } = useColonyContext();

  const { data, loading, fetchMore } = useGetStreamingPaymentsByColonyQuery({
    variables: {
      recipientAddress: walletAddress ?? '',
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

  const getTotalFunds = useCallback(
    async (items: StreamingPaymentItems, currentTimestamp: number) => {
      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond: ratePerSecondValue,
      } = await calculateTotalsFromStreams({
        streamingPayments: items,
        currentTimestamp,
        currency,
        colony,
      });

      setIsAnyPaymentActive(isAtLeastOnePaymentActive);
      setTotalFunds({ totalAvailable, totalClaimed });
      setRatePerSecond(ratePerSecondValue);
    },
    [colony, currency],
  );

  useEffect(() => {
    fetchMore({
      variables: {
        recipientAddress: walletAddress ?? '',
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
  }, [colony.colonyAddress, fetchMore, walletAddress]);

  useEffect(() => {
    if (streamingPayments.length) {
      getTotalFunds(
        streamingPayments,
        Math.floor(blockTime ?? Date.now() / 1000),
      );
    }
  }, [blockTime, getTotalFunds, streamingPayments]);

  return {
    totalFunds,
    isAnyPaymentActive,
    ratePerSecond,
    loading,
    currency,
    getTotalFunds,
    streamingPayments,
  };
};
