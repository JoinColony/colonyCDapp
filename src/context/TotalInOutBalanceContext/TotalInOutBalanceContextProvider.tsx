import { type WatchQueryFetchPolicy } from '@apollo/client';
import React, {
  useMemo,
  type FC,
  type PropsWithChildren,
  useEffect,
} from 'react';

import { useBalanceCurrencyContext } from '~context/BalanceCurrencyContext/BalanceCurrencyContext.ts';
import {
  ExtendedSupportedCurrencies,
  TimeframeType,
  useGetDomainBalanceQuery,
  useGetCachedDomainBalanceQuery,
} from '~gql';
import { useCurrencyHistoricalConversionRate } from '~hooks/useCurrencyHistoricalConversionRate.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { convertFromTokenToCurrency } from '~utils/currency/convertFromTokenToCurrency.ts';
import { type CoinGeckoSupportedCurrencies } from '~utils/currency/types.ts';

import { useColonyContext } from '../ColonyContext/ColonyContext.ts';

import { TotalInOutBalanceContext } from './TotalInOutBalanceContext.ts';

const TotalInOutBalanceContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedDomainId = selectedDomain?.id ?? '';
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
            domainId: selectedDomainId,
            selectedCurrency:
              currency as unknown as ExtendedSupportedCurrencies,
            timeframePeriod: 30,
            timeframeType: TimeframeType.Daily,
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
  }, [currency, selectedDomainId, colonyAddress]);

  const memoizedPreviousQueryVariables = useMemo(() => {
    const abortController = new AbortController();
    return {
      abortController,
      queryOptions: {
        variables: {
          colonyAddress,
          filter: {
            domainId: { eq: selectedDomainId },
            timeframeType: { eq: TimeframeType.Daily },
          },
        },
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
        fetchPolicy: 'cache-first' as WatchQueryFetchPolicy,
      },
    };
  }, [selectedDomainId, colonyAddress]);

  const { data, loading } = useGetDomainBalanceQuery(
    memoizedQueryVariables.queryOptions,
  );

  const { data: previousData, loading: previousLoading } =
    useGetCachedDomainBalanceQuery(memoizedPreviousQueryVariables.queryOptions);

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedQueryVariables.abortController.abort();
      }
    };
  }, [memoizedQueryVariables.abortController, loading]);

  useEffect(() => {
    return () => {
      if (previousLoading) {
        memoizedPreviousQueryVariables.abortController.abort();
      }
    };
  }, [memoizedPreviousQueryVariables.abortController, previousLoading]);

  const domainBalanceData = data?.getDomainBalance;

  const previousBalance =
    previousData?.cacheTotalBalanceByColonyAddress?.items[0];

  const previousDataConversionRate = useCurrencyHistoricalConversionRate({
    tokenSymbol: ExtendedSupportedCurrencies.Usdc,
    date: previousBalance?.date ?? new Date(),
    conversionDenomination: currency as unknown as CoinGeckoSupportedCurrencies,
  });

  const value = useMemo(() => {
    /**
     * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
     */
    const previousTotalIn = convertFromTokenToCurrency(
      previousBalance?.totalUSDCIn,
      previousDataConversionRate,
    );

    /**
     * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
     */
    const previousTotalOut = convertFromTokenToCurrency(
      previousBalance?.totalUSDCOut,
      previousDataConversionRate,
    );

    return {
      loading: loading || previousLoading || currencyLoading,
      totalIn: convertAmount(domainBalanceData?.totalIn ?? '0'),
      totalOut: convertAmount(domainBalanceData?.totalOut ?? '0'),
      previousTotalIn: convertAmount(previousTotalIn),
      previousTotalOut: convertAmount(previousTotalOut),
    };
  }, [
    previousLoading,
    previousBalance?.totalUSDCIn,
    previousBalance?.totalUSDCOut,
    domainBalanceData?.totalIn,
    domainBalanceData?.totalOut,
    loading,
    currencyLoading,
    previousDataConversionRate,
    convertAmount,
  ]);

  return (
    <TotalInOutBalanceContext.Provider value={value}>
      {children}
    </TotalInOutBalanceContext.Provider>
  );
};

export default TotalInOutBalanceContextProvider;
