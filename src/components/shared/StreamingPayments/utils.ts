import { differenceInMonths, isAfter } from 'date-fns';
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

const isDateWithinPastMonth = (currentDate: Date, dateToCheck: Date) =>
  isAfter(currentDate, dateToCheck) &&
  differenceInMonths(currentDate, dateToCheck) === 0;

export const calculateStreamedFunds = (
  items: {
    startDate: Date;
    streamedFunds: number;
  }[],
) => {
  const totalStreamedFunds = items.length
    ? items.reduce((sum, item) => {
        return sum + Number(item.streamedFunds);
      }, 0)
    : 0;

  return totalStreamedFunds;
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

      const isItemsWithinLastMonth = isDateWithinPastMonth(
        new Date(currentTimestamp * 1000),
        new Date(+item.startTime * 1000),
      );

      const {
        totalAvailable,
        totalClaimed,
        isAtLeastOnePaymentActive,
        ratePerSecond,
        itemsWithinLastMonth,
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
        itemsWithinLastMonth: isItemsWithinLastMonth
          ? [
              ...itemsWithinLastMonth,
              {
                startDate: new Date(+item.startTime * 1000),
                streamedFunds:
                  amountClaimedToDateToCurrency &&
                  amountAvailableToClaimToCurrency
                    ? amountClaimedToDateToCurrency.toNumber() +
                      amountAvailableToClaimToCurrency.toNumber()
                    : 0,
              },
            ]
          : itemsWithinLastMonth,
      };
    },
    Promise.resolve({
      totalAvailable: new Decimal(0),
      totalClaimed: new Decimal(0),
      ratePerSecond: new Decimal(0),
      isAtLeastOnePaymentActive: false,
      itemsWithinLastMonth: [],
    }),
  );

  const {
    totalClaimed,
    totalAvailable,
    isAtLeastOnePaymentActive,
    ratePerSecond,
    itemsWithinLastMonth,
  } = await totals;

  return {
    totalClaimed: totalClaimed.toNumber(),
    totalAvailable: totalAvailable.toNumber(),
    ratePerSecond: ratePerSecond.toNumber(),
    isAtLeastOnePaymentActive,
    itemsWithinLastMonth,
  };
};
