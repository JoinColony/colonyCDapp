import { isAfter, differenceInDays, subDays } from 'date-fns';
import Decimal from 'decimal.js';

import { type ColonyFragment, type SupportedCurrencies } from '~gql';
import { StreamingPaymentStatus } from '~types/streamingPayments.ts';
import { fetchCurrentPrice } from '~utils/currency/currency.ts';
import {
  getStreamingPaymentAmountsLeft,
  getStreamingPaymentStatus,
} from '~utils/streamingPayments.ts';
import {
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

import { type StreamingPaymentItems } from './types.ts';

export const calculateToCurrency = async ({
  amount,
  tokenAddress,
  currency,
  colony,
}: {
  amount: string;
  tokenAddress: string;
  currency: SupportedCurrencies;
  colony: ColonyFragment;
}): Promise<Decimal | null> => {
  const currentToken = getSelectedToken(colony, tokenAddress);
  const { decimals } = currentToken || {};

  const currentPrice = await fetchCurrentPrice({
    contractAddress: tokenAddress,
    conversionDenomination: currency,
  });

  if (currentPrice === null) {
    return null;
  }

  const balanceInWeiToEth = new Decimal(amount).div(
    10 ** getTokenDecimalsWithFallback(decimals),
  );

  return new Decimal(balanceInWeiToEth).mul(currentPrice ?? 0);
};

const calculateStreamsForLast30Days = ({
  startTimestamp,
  endTimestamp,
  currentTimestamp,
  interval,
  totalClaimedAmount,
}: {
  startTimestamp: number;
  endTimestamp: number;
  currentTimestamp: number;
  interval: number;
  totalClaimedAmount: number;
}) => {
  const intervalInDays = interval / 24 / 3600;

  const startDate = new Date(startTimestamp * 1000);
  const currentDate = new Date(currentTimestamp * 1000);
  // eslint-disable-next-line no-restricted-globals
  const endDate = isNaN(new Date(endTimestamp * 1000) as any)
    ? currentDate
    : new Date(endTimestamp * 1000);

  const date30DaysAgo = subDays(currentDate, 30);

  if (isAfter(startDate, date30DaysAgo)) {
    return totalClaimedAmount;
  }
  if (isAfter(endDate, date30DaysAgo)) {
    const daysIncludedInLast30Days = Math.abs(
      differenceInDays(
        startDate > date30DaysAgo ? startDate : date30DaysAgo,
        endDate > currentDate ? currentDate : endDate,
      ),
    );
    const totalDays = Math.abs(differenceInDays(startDate, endDate));
    const totalStreams = totalDays / intervalInDays;
    const streamsPerDay = totalStreams / totalDays;
    const amountPerOneStream = totalClaimedAmount / totalStreams;
    const streamedFundsInLast30Days =
      daysIncludedInLast30Days * streamsPerDay * amountPerOneStream;

    return streamedFundsInLast30Days;
  }
  return 0;
};

export const calculateTotalsFromStreams = async ({
  colony,
  currency,
  streamingPayments,
  currentTimestamp,
}: {
  streamingPayments: StreamingPaymentItems;
  currentTimestamp: number;
  currency: SupportedCurrencies;
  colony: ColonyFragment;
}) => {
  const totals = streamingPayments.reduce(
    async (result, item) => {
      if (!item) {
        return result;
      }

      const { amountClaimedToDate, amountAvailableToClaim } =
        getStreamingPaymentAmountsLeft(item, currentTimestamp);

      const paymentStatus = getStreamingPaymentStatus({
        streamingPayment: item,
        currentTimestamp,
        amountAvailableToClaim,
      });

      const amountAvailableToClaimToCurrency = await calculateToCurrency({
        amount: amountAvailableToClaim,
        tokenAddress: item.tokenAddress,
        currency,
        colony,
      });

      const amountClaimedToDateToCurrency = await calculateToCurrency({
        amount: amountClaimedToDate,
        tokenAddress: item.tokenAddress,
        currency,
        colony,
      });

      const ratePerSecondValue = new Decimal(item.amount || '0').div(
        item.interval || 1,
      );

      const ratePerSecondToCurrency = await calculateToCurrency({
        amount: ratePerSecondValue.toString(),
        tokenAddress: item.tokenAddress,
        currency,
        colony,
      });

      const streamedFundsInLast30Days = calculateStreamsForLast30Days({
        currentTimestamp,
        endTimestamp: Number(item.endTime),
        startTimestamp: Number(item.startTime),
        interval: Number(item.interval),
        totalClaimedAmount: amountClaimedToDateToCurrency?.toNumber() ?? 0,
      });

      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond,
        lastMonthStreaming,
      } = await result;

      return {
        totalAvailable: totalAvailable.add(
          amountAvailableToClaimToCurrency ?? '0',
        ),
        totalClaimed: totalClaimed.add(amountClaimedToDateToCurrency ?? '0'),
        ratePerSecond: ratePerSecond.add(ratePerSecondToCurrency ?? '0'),
        isAtLeastOnePaymentActive:
          paymentStatus === StreamingPaymentStatus.Active ||
          isAtLeastOnePaymentActive,
        lastMonthStreaming: lastMonthStreaming.add(
          paymentStatus === StreamingPaymentStatus.Active
            ? streamedFundsInLast30Days
            : 0,
        ),
      };
    },
    Promise.resolve({
      totalAvailable: new Decimal(0),
      totalClaimed: new Decimal(0),
      ratePerSecond: new Decimal(0),
      isAtLeastOnePaymentActive: false,
      itemsWithinLastMonth: [],
      lastMonthStreaming: new Decimal(0),
    }),
  );

  const {
    totalClaimed,
    totalAvailable,
    isAtLeastOnePaymentActive,
    ratePerSecond,
    lastMonthStreaming,
  } = await totals;

  return {
    totalClaimed: totalClaimed.toNumber(),
    totalAvailable: totalAvailable.toNumber(),
    ratePerSecond: ratePerSecond.toNumber(),
    isAtLeastOnePaymentActive,
    lastMonthStreaming: lastMonthStreaming.toNumber(),
  };
};
