import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import {
  ExtendedSupportedCurrencies,
  TimeframeType,
  type SupportedCurrencies,
  useGetCachedDomainBalanceQuery,
  useGetDomainBalanceQuery,
} from '~gql';
import { useCurrencyHistoricalConversionRate } from '~hooks/useCurrencyHistoricalConversionRate.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type ColonyBalances } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { convertFromTokenToCurrency } from '~utils/currency/convertFromTokenToCurrency.ts';
import { fetchCurrentPrice } from '~utils/currency/currency.ts';
import { type CoinGeckoSupportedCurrencies } from '~utils/currency/index.ts';

export const useTotalData = (domainId?: string) => {
  const { colony } = useColonyContext();

  const { currency } = useCurrencyContext();

  const { data, loading } = useGetDomainBalanceQuery({
    variables: {
      input: {
        colonyAddress: colony.colonyAddress,
        domainId: domainId ?? '',
        selectedCurrency: currency as unknown as ExtendedSupportedCurrencies,
        timeframePeriod: 1,
        timeframeType: TimeframeType.Total,
      },
    },
  });

  const domainBalanceData = data?.getDomainBalance;

  return {
    total: domainBalanceData?.total ?? '0',
    loading,
  };
};
export const usePreviousTotalData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { currency } = useCurrencyContext();
  const { data, loading } = useGetCachedDomainBalanceQuery({
    variables: {
      colonyAddress,
      filter: {
        domainId: { eq: selectedDomain?.id ?? '' },
        timeframeType: { eq: TimeframeType.Total },
      },
    },
  });

  const previousBalance = data?.cacheTotalBalanceByColonyAddress?.items[0];

  const conversionRate = useCurrencyHistoricalConversionRate({
    tokenSymbol: ExtendedSupportedCurrencies.Usdc,
    date: previousBalance?.date ?? new Date(),
    conversionDenomination: currency as unknown as CoinGeckoSupportedCurrencies,
  });

  return {
    loading,
    /**
     * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
     */
    previousTotal: convertFromTokenToCurrency(
      previousBalance?.totalUSDC,
      conversionRate,
    ),
  };
};

const calculateTotalFunds = async (
  balances: ColonyBalances,
  currency: SupportedCurrencies,
  selectedDomainNativeId: number | undefined,
): Promise<Decimal | null> => {
  let isError = false;
  const funds = balances.items
    ?.filter(notNull)
    .filter(({ domain }) =>
      !selectedDomainNativeId
        ? domain === null
        : domain?.nativeId === selectedDomainNativeId,
    )
    .reduce(
      async (total, { balance, token: { tokenAddress, decimals } }) => {
        const currentPrice = await fetchCurrentPrice({
          contractAddress: tokenAddress,
          conversionDenomination: currency,
        });

        if (currentPrice == null) {
          isError = true;
        }

        const balanceInWeiToEth = new Decimal(balance).div(10 ** decimals);

        return (await total).add(
          new Decimal(balanceInWeiToEth).mul(currentPrice ?? 0),
        );
      },
      Promise.resolve(new Decimal(0)),
    );

  if (isError) {
    return null;
  }

  return (await funds) ?? new Decimal(0);
};

export const useTotalFunds = () => {
  const selectedDomain = useGetSelectedDomainFilter();
  const { colony } = useColonyContext();
  const { currency } = useCurrencyContext();
  const { balances: colonyBalances } = colony || {};
  const [totalFunds, setTotalFunds] = useState<Decimal | null>(new Decimal(0));

  useEffect(() => {
    const getTotalFunds = async (balances: ColonyBalances) => {
      const funds = await calculateTotalFunds(
        balances,
        currency,
        selectedDomain?.nativeId,
      );
      setTotalFunds(funds);
    };

    if (colonyBalances) {
      getTotalFunds(colonyBalances);
    }
  }, [colonyBalances, currency, selectedDomain]);

  return totalFunds;
};
