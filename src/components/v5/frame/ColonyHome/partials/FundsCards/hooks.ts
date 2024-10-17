import { useEffect, useMemo } from 'react';

import { useBalanceCurrencyContext } from '~context/BalanceCurrencyContext/BalanceCurrencyContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  ExtendedSupportedCurrencies,
  TimeframeType,
  useGetCachedDomainBalanceQuery,
  useGetDomainBalanceQuery,
} from '~gql';
import { useCurrencyHistoricalConversionRate } from '~hooks/useCurrencyHistoricalConversionRate.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { useSubDomains } from '~hooks/useSubDomains.ts';
import { convertFromTokenToCurrency } from '~utils/currency/convertFromTokenToCurrency.ts';
import { type CoinGeckoSupportedCurrencies } from '~utils/currency/index.ts';

export const useTotalData = (domainId?: string) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const {
    currency,
    convertAmount,
    loading: currencyLoading,
  } = useBalanceCurrencyContext();

  const memoizedQueryVariables = useMemo(() => {
    const abortController = new AbortController();
    return {
      abortController,
      queryOptions: {
        variables: {
          input: {
            colonyAddress,
            domainId: domainId ?? '',
            selectedCurrency:
              currency as unknown as ExtendedSupportedCurrencies,
            timeframePeriod: 1,
            timeframeType: TimeframeType.Total,
          },
        },
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
        notifyOnNetworkStatusChange: true,
      },
    };
  }, [currency, domainId, colonyAddress]);

  const { data, loading } = useGetDomainBalanceQuery(
    memoizedQueryVariables.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedQueryVariables.abortController.abort();
      }
    };
  }, [loading, memoizedQueryVariables.abortController]);

  const domainBalanceData = data?.getDomainBalance;

  return {
    total: convertAmount(domainBalanceData?.total ?? '0'),
    loading: loading || currencyLoading,
  };
};
export const usePreviousTotalData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const {
    currency,
    convertAmount,
    loading: currencyLoading,
  } = useBalanceCurrencyContext();

  const memoizedQueryVariables = useMemo(() => {
    const abortController = new AbortController();
    return {
      abortController,
      queryOptions: {
        variables: {
          colonyAddress,
          filter: {
            domainId: { eq: selectedDomain?.id ?? '' },
            timeframeType: { eq: TimeframeType.Total },
          },
        },
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      },
    };
  }, [selectedDomain?.id, colonyAddress]);

  const { data, loading } = useGetCachedDomainBalanceQuery(
    memoizedQueryVariables.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedQueryVariables.abortController.abort();
      }
    };
  }, [loading, memoizedQueryVariables.abortController]);

  const previousBalance = data?.cacheTotalBalanceByColonyAddress?.items[0];

  const conversionRate = useCurrencyHistoricalConversionRate({
    tokenSymbol: ExtendedSupportedCurrencies.Usdc,
    date: previousBalance?.date ?? new Date(),
    conversionDenomination: currency as unknown as CoinGeckoSupportedCurrencies,
  });

  /**
   * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
   */
  const previousTotal = convertFromTokenToCurrency(
    previousBalance?.totalUSDC,
    conversionRate,
  );

  return {
    loading: loading || currencyLoading,
    /**
     * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
     */
    previousTotal: convertAmount(previousTotal),
  };
};

export const useIsAddNewTeamVisible = () => {
  const subTeams = useSubDomains();

  const selectedDomain = useGetSelectedDomainFilter();

  // In case "All teams" selected we have "General" team created by default
  // @TODO: probably with nested teams this functionality will change
  if (!selectedDomain && (!subTeams || subTeams.length <= 1)) {
    return true;
  }
  return selectedDomain?.isRoot && (!subTeams || subTeams.length < 1);
};
