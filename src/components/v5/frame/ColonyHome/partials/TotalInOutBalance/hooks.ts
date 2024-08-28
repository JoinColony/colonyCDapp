import { subMonths, format } from 'date-fns';
import numbro from 'numbro';
import { useEffect, useMemo, useState } from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import { TimeframeType, useGetDomainBalanceQuery } from '~gql';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamHexColor, getTeamHexSecondaryColor } from '~utils/teams.ts';

import { MSG } from './consts.ts';
import { type BarChartDataItem, type LegendItem } from './types.ts';
import { getMonthShortName, sortByLabel } from './utils.ts';

export const useData = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { currency } = useCurrencyContext();
  const timeframePeriod = 4;
  const timeframeType = TimeframeType.Monthly;
  const { data, loading } = useGetDomainBalanceQuery({
    variables: {
      input: {
        colonyAddress,
        domainAddress: selectedDomain?.id ?? `${colonyAddress}_1`,
        selectedCurrency: currency, // @TODO need to add proper type
        timeframePeriod,
        timeframeType,
      },
    },
  });

  const domainBalanceData = data?.getDomainBalance;

  const now = Date.now();

  const timeframeBalanceFallback = Array.from(Array(timeframePeriod)).map(
    (_, index) => {
      const date = subMonths(now, timeframePeriod - index - 1);

      return {
        label: format(date, 'MM'),
        in: '0',
        out: '0',
      };
    },
  );

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
    last30Days: {
      in: domainBalanceData?.last30Days?.totalIn ?? '0',
      out: domainBalanceData?.last30Days?.totalOut ?? '0',
    },
    timeframe: timeframeBalanceArray ?? timeframeBalanceFallback,
  };
};

export const useColorTheme = () => {
  const computedStyles = getComputedStyle(document.documentElement);
  const selectedDomain = useGetSelectedDomainFilter();
  const nativeDomainId = selectedDomain?.nativeId ?? undefined;
  const {
    colony: { domains },
  } = useColonyContext();

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeDomainId,
  )?.metadata?.color;

  const teamPrimaryColorCssVariable = getTeamHexColor(selectedTeamColor);
  const teamSecondaryColorCssVariable =
    getTeamHexSecondaryColor(selectedTeamColor);

  return {
    primary: computedStyles.getPropertyValue(teamPrimaryColorCssVariable),
    secondary: computedStyles.getPropertyValue(teamSecondaryColorCssVariable),
  };
};

export const useBarChartLegend = () => {
  const colorTheme = useColorTheme();

  return useMemo<LegendItem[]>(
    () => [
      {
        color: colorTheme.secondary,
        label: formatText(MSG.paymentsLegendTitle),
      },
      {
        color: colorTheme.primary,
        label: formatText(MSG.incomeLegendTitle),
      },
    ],
    [colorTheme.primary, colorTheme.secondary],
  );
};

export const useBarChartConfig = (
  data: BarChartDataItem[],
  isLoading?: boolean,
) => {
  const [chartStyle, setChartStyle] = useState<any>({});
  const colorTheme = useColorTheme();
  const legend = useBarChartLegend();
  const { currency } = useCurrencyContext();
  const stringifiedData = JSON.stringify(data);

  useEffect(() => {
    const updateChartStyle = () => {
      const computedStyles = getComputedStyle(document.documentElement);
      setChartStyle({
        gray100: computedStyles.getPropertyValue('--color-gray-100'),
        gray200: computedStyles.getPropertyValue('--color-gray-200'),
        gray400: computedStyles.getPropertyValue('--color-gray-400'),
        baseBlack: computedStyles.getPropertyValue('--color-base-black'),
        baseWhite: computedStyles.getPropertyValue('--color-base-white'),
        fontFamily: computedStyles.getPropertyValue(
          '--onboard-font-family-normal',
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
  }, []);

  const chartStepSize = useMemo(() => {
    let max = BigInt(data[0].in ?? 0);
    const updateMax = (value) => {
      if (value > max) {
        max = value;
      }
    };
    data.forEach((item) => {
      updateMax(BigInt(item.in ?? 0));
      updateMax(BigInt(item.out ?? 0));
    });
    try {
      // We want to show exactly 5 steps, including 0
      return Number(max / BigInt(5 - 1));
    } catch {
      return 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedData]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        backgroundOverlayPlugin: {
          hoverBackgroundColor: chartStyle.gray100,
        },
        legend: {
          display: false,
        },
        tooltip: {
          usePointStyle: true,
          displayColors: false,
          backgroundColor: chartStyle.baseBlack,
          cornerRadius: 12,
          bodyFont: {
            size: 12,
            weight: '600',
            family: chartStyle.fontFamily,
          },
          xAlign: 'center',
          yAlign: 'bottom',
          padding: {
            top: 6,
            right: 12,
            bottom: 6,
            left: 12,
          },
          callbacks: {
            title: () => '',
            labelTextColor: () => chartStyle.baseWhite,
            label: (tooltipItem) =>
              numbro(tooltipItem.raw).format({
                thousandSeparated: true,
                prefix: currencySymbolMap[currency],
              }),
          },
        },
      },

      hover: !isLoading
        ? {
            mode: 'index',
            intersect: false,
          }
        : null,

      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false,
          },
          border: {
            display: true,
            color: chartStyle.gray200,
          },
          ticks: {
            color: chartStyle.gray400,
            font: {
              size: 10,
              family: chartStyle.fontFamily,
            },
          },
        },
        y: {
          beginAtZero: true,
          border: {
            display: false,
            dash: [5, 6],
          },
          grid: {
            display: true,
            color: chartStyle.gray200,
            lineWidth: 1,
            tickWidth: 0,
          },
          ticks: {
            color: chartStyle.gray400,
            font: {
              size: 10,
              family: chartStyle.fontFamily,
            },
            stepSize: chartStepSize,
            count: 5,
            callback(value) {
              const convertedValue = convertToDecimal(value, 0);
              return numbro(convertedValue?.toString()).format({
                average: true,
                mantissa: 1,
              });
            },
          },
        },
      },
    };
  }, [chartStyle, chartStepSize, currency, isLoading]);

  return {
    options,
    data: {
      labels: data.map((item) => getMonthShortName(item.label ?? '')),
      datasets: [
        {
          label: legend[0].label,
          data: data.map((item) => item.out),
          backgroundColor: [colorTheme.secondary],
          hoverBackgroundColor: [colorTheme.secondary],
          borderRadius: 4,
          maxBarThickness: 22,
          minBarLength: 2,
        },
        {
          label: legend[1].label,
          data: data.map((item) => item.in),
          backgroundColor: [colorTheme.primary],
          hoverBackgroundColor: [colorTheme.primary],
          borderRadius: 4,
          maxBarThickness: 22,
          minBarLength: 2,
        },
      ],
    },
  };
};
