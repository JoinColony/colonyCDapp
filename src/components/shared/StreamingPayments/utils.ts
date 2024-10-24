import { differenceInYears, differenceInMonths, isAfter } from 'date-fns';
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

const isDateWithinPastYear = (currentDate: Date, dateToCheck: Date) =>
  isAfter(currentDate, dateToCheck) &&
  differenceInYears(currentDate, dateToCheck) === 0;

export const calculateAverageStreamingPayment = (
  currentDate: Date,
  items: {
    startDate: Date;
    claimedFunds: number;
  }[],
) => {
  const oldestItemDate = items.length
    ? items.reduce((oldest, item) => {
        return item.startDate < oldest.startDate ? item : oldest;
      }).startDate
    : 0;

  const monthsDifference =
    oldestItemDate !== 0 ? differenceInMonths(currentDate, oldestItemDate) : 0;

  const totalClaimedFunds = items.length
    ? items.reduce((sum, item) => {
        return sum + Number(item.claimedFunds);
      }, 0)
    : 0;

  return monthsDifference !== 0
    ? totalClaimedFunds / monthsDifference
    : totalClaimedFunds;
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

      const isItemsCountedToAverage = isDateWithinPastYear(
        new Date(currentTimestamp * 1000),
        new Date(+item.startTime * 1000),
      );

      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond,
        itemsCountedToAverage,
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
        itemsCountedToAverage: isItemsCountedToAverage
          ? [
              ...itemsCountedToAverage,
              {
                startDate: new Date(+item.startTime * 1000),
                claimedFunds: amountClaimedToDateToCurrency
                  ? amountClaimedToDateToCurrency.toNumber()
                  : 0,
              },
            ]
          : itemsCountedToAverage,
      };
    },
    Promise.resolve({
      totalAvailable: new Decimal(0),
      totalClaimed: new Decimal(0),
      ratePerSecond: new Decimal(0),
      isAtLeastOnePaymentActive: false,
      itemsCountedToAverage: [],
    }),
  );

  const {
    totalClaimed,
    totalAvailable,
    isAtLeastOnePaymentActive,
    ratePerSecond,
    itemsCountedToAverage,
  } = await totals;

  return {
    totalClaimed: totalClaimed.toNumber(),
    totalAvailable: totalAvailable.toNumber(),
    ratePerSecond: ratePerSecond.toNumber(),
    isAtLeastOnePaymentActive,
    itemsCountedToAverage,
  };
};
