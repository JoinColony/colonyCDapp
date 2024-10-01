import { type WatchQueryFetchPolicy } from '@apollo/client';
import React, {
  useMemo,
  type FC,
  type PropsWithChildren,
  useEffect,
} from 'react';

import { useBalanceCurrencyContext } from '~context/BalanceCurrencyContext/BalanceCurrencyContext.ts';
import {
  type ExtendedSupportedCurrencies,
  TimeframeType,
  useGetDomainBalanceQuery,
} from '~gql';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { sortByLabel } from '~v5/frame/ColonyHome/partials/TotalInOutBalance/utils.ts';

import { useColonyContext } from '../ColonyContext/ColonyContext.ts';

import { TotalInOutBalanceChartContext } from './TotalInOutBalanceChartContext.ts';

const TotalInOutBalanceChartContextProvider: FC<PropsWithChildren> = ({
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
            timeframePeriod: 4,
            timeframeType: TimeframeType.Monthly,
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
  }, [currency, selectedDomainId, colonyAddress]);

  const { data, loading } = useGetDomainBalanceQuery(
    memoizedQueryVariables.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedQueryVariables.abortController.abort();
      }
    };
  }, [memoizedQueryVariables.abortController, loading]);

  const domainBalanceData = data?.getDomainBalance;

  const value = useMemo(() => {
    const timeframeBalanceArray = domainBalanceData?.timeframe
      ?.map((timeframeBalance) => ({
        label: timeframeBalance?.key,
        in: convertAmount(timeframeBalance?.value?.totalIn ?? '0'),
        out: convertAmount(timeframeBalance?.value?.totalOut ?? '0'),
      }))
      .sort(sortByLabel);

    let stepValue = 10000;
    const ySteps: number[] = [];
    let max = BigInt(timeframeBalanceArray?.[0]?.in ?? 0);
    const updateMax = (currentValue) => {
      if (currentValue > max) {
        max = currentValue;
      }
    };
    timeframeBalanceArray?.forEach((item) => {
      updateMax(BigInt(item.in ?? 0));
      updateMax(BigInt(item.out ?? 0));
    });
    if (max) {
      // We want to show exactly 5 steps, including 0
      stepValue = Number(max / BigInt(5 - 1));
    }

    for (let i = 0; i <= 4; i += 1) {
      ySteps.push(i * stepValue);
    }

    return {
      loading: loading || currencyLoading,
      totalIn: convertAmount(domainBalanceData?.totalIn ?? '0'),
      totalOut: convertAmount(domainBalanceData?.totalOut ?? '0'),
      timeframe: timeframeBalanceArray,
      ySteps,
    };
  }, [
    domainBalanceData?.totalIn,
    domainBalanceData?.totalOut,
    domainBalanceData?.timeframe,
    loading,
    convertAmount,
    currencyLoading,
  ]);

  return (
    <TotalInOutBalanceChartContext.Provider value={value}>
      {children}
    </TotalInOutBalanceChartContext.Provider>
  );
};

export default TotalInOutBalanceChartContextProvider;