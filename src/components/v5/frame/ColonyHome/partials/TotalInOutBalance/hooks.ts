import { type WatchQueryFetchPolicy } from '@apollo/client/core';
import { type ResponsiveBarSvgProps, type BarDatum } from '@nivo/bar';
import { useState, useEffect, useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import {
  ExtendedSupportedCurrencies,
  TimeframeType,
  useGetCachedDomainBalanceQuery,
  useGetDomainBalanceQuery,
} from '~gql';
import { useCurrencyHistoricalConversionRate } from '~hooks/useCurrencyHistoricalConversionRate.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type CoinGeckoSupportedCurrencies } from '~utils/currency/types.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamHexColor, getTeamHexSecondaryColor } from '~utils/teams.ts';

import { CHART_CONFIG_VALUES, MSG } from './consts.ts';
import { convertFromTokenToCurrency, sortByLabel } from './utils.ts';

export const usePreviousLast30DaysData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedDomainId = selectedDomain?.id ?? '';
  const { currency } = useCurrencyContext();
  const memoizedValues = useMemo(() => {
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

  const { data, loading } = useGetCachedDomainBalanceQuery(
    memoizedValues.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedValues.abortController.abort();
      }
    };
  }, [memoizedValues.abortController, loading]);

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
    previousTotalIn: convertFromTokenToCurrency(
      previousBalance?.totalUSDCIn,
      conversionRate,
    ),
    /**
     * The cached data is stored in USDC due to the running the lambda at a scheduled time and not on demand
     */
    previousTotalOut: convertFromTokenToCurrency(
      previousBalance?.totalUSDCOut,
      conversionRate,
    ),
  };
};

export const useLast30DaysData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedDomainId = selectedDomain?.id ?? '';
  const { currency } = useCurrencyContext();
  const memoizedValues = useMemo(() => {
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
        fetchPolicy: 'cache-first' as WatchQueryFetchPolicy,
      },
    };
  }, [currency, selectedDomainId, colonyAddress]);

  const { data, loading } = useGetDomainBalanceQuery(
    memoizedValues.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedValues.abortController.abort();
      }
    };
  }, [memoizedValues.abortController, loading]);

  const domainBalanceData = data?.getDomainBalance;

  return {
    loading,
    totalIn: domainBalanceData?.totalIn ?? '0',
    totalOut: domainBalanceData?.totalOut ?? '0',
  };
};

export const useData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const selectedDomainId = selectedDomain?.id ?? '';
  const { currency } = useCurrencyContext();
  const memoizedValues = useMemo(() => {
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
    memoizedValues.queryOptions,
  );

  useEffect(() => {
    return () => {
      if (loading) {
        memoizedValues.abortController.abort();
      }
    };
  }, [memoizedValues.abortController, loading]);

  const domainBalanceData = data?.getDomainBalance;

  const timeframeBalanceArray = useMemo(() => {
    return domainBalanceData?.timeframe
      ?.map((timeframeBalance) => ({
        label: timeframeBalance?.key,
        in: timeframeBalance?.value?.totalIn,
        out: timeframeBalance?.value?.totalOut,
      }))
      .sort(sortByLabel);
  }, [domainBalanceData?.timeframe]);

  return {
    loading,
    totalIn: domainBalanceData?.totalIn ?? '0',
    totalOut: domainBalanceData?.totalOut ?? '0',
    timeframe: timeframeBalanceArray,
  };
};

export const useDomainColorVariables = () => {
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId ?? undefined;
  const {
    colony: { domains },
  } = useColonyContext();

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeDomainId,
  )?.metadata?.color;

  return {
    primaryColorVariableName: getTeamHexColor(selectedTeamColor),
    secondaryColorVariableName: getTeamHexSecondaryColor(selectedTeamColor),
  };
};

export const useCssProperties = () => {
  const [cssProperties, setCssProperties] = useState<any>({});
  const domainColorVariables = useDomainColorVariables();

  useEffect(() => {
    const updateChartStyle = () => {
      const computedStyles = getComputedStyle(document.documentElement);
      setCssProperties({
        gray100: computedStyles.getPropertyValue('--color-gray-100'),
        gray200: computedStyles.getPropertyValue('--color-gray-200'),
        gray400: computedStyles.getPropertyValue('--color-gray-400'),
        baseBlack: computedStyles.getPropertyValue('--color-base-black'),
        baseWhite: computedStyles.getPropertyValue('--color-base-white'),
        fontFamily: computedStyles.getPropertyValue(
          '--onboard-font-family-normal',
        ),
        primary: computedStyles.getPropertyValue(
          domainColorVariables.primaryColorVariableName,
        ),
        secondary: computedStyles.getPropertyValue(
          domainColorVariables.secondaryColorVariableName,
        ),
      });
    };
    const observer = new MutationObserver(updateChartStyle);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    updateChartStyle();

    return () => {
      observer.disconnect();
    };
  }, [
    domainColorVariables.primaryColorVariableName,
    domainColorVariables.secondaryColorVariableName,
  ]);

  return cssProperties;
};

export const useBarChartLegend = () => {
  const cssProperties = useCssProperties();

  return useMemo<any>(
    () => [
      {
        color: cssProperties.secondary,
        label: formatText(MSG.paymentsLegendTitle),
      },
      {
        color: cssProperties.primary,
        label: formatText(MSG.incomeLegendTitle),
      },
    ],
    [cssProperties.primary, cssProperties.secondary],
  );
};

export const useChartYSteps = () => {
  const { timeframe: barChartData } = useData();
  const stringifiedBarChartData = JSON.stringify(barChartData);

  const steps = useMemo(() => {
    // Initialise the step value to 10k
    let stepValue = 10000;
    const computedSteps: number[] = [];
    let max = BigInt(barChartData?.[0]?.in ?? 0);
    const updateMax = (value) => {
      if (value > max) {
        max = value;
      }
    };
    barChartData?.forEach((item) => {
      updateMax(BigInt(item.in ?? 0));
      updateMax(BigInt(item.out ?? 0));
    });
    if (max) {
      // We want to show exactly 5 steps, including 0
      stepValue = Number(max / BigInt(5 - 1));
    }

    for (let i = 0; i <= 4; i += 1) {
      computedSteps.push(i * stepValue);
    }

    return computedSteps;
    // We need to disable this rule given we pass the stringified value as the useMemo dependency for comparison optimisation purposes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedBarChartData]);

  return steps;
};

export const useBarChartConfig = <T extends BarDatum>(): Partial<
  ResponsiveBarSvgProps<T>
> => {
  const cssProperties = useCssProperties();

  const barChartConfig = useMemo(() => {
    return {
      theme: {
        background: 'transparent',
      },
      colors: ({ id }) =>
        id === 'in' ? cssProperties.primary : cssProperties.secondary,
      keys: ['out', 'in'],
      indexBy: 'label',
      groupMode: 'grouped' as any,
      margin: {
        top: CHART_CONFIG_VALUES.MARGIN_TOP,
        right: CHART_CONFIG_VALUES.MARGIN_RIGHT,
        bottom: CHART_CONFIG_VALUES.MARGIN_BOTTOM,
        left: CHART_CONFIG_VALUES.MARGIN_LEFT,
      },
      padding: CHART_CONFIG_VALUES.PADDING,
      innerPadding: CHART_CONFIG_VALUES.INNER_PADDING,
      enableLabel: false,
      valueScale: { type: 'linear' as any },
      indexScale: { type: 'band' as any, round: true },
      minValue: 0,
      axisTop: null,
      axisRight: null,
      // needed to override the default bar component
      barComponent: () => null,
    };
  }, [cssProperties.primary, cssProperties.secondary]);

  return barChartConfig;
};
