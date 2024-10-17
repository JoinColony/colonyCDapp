import { type ResponsiveBarSvgProps, type BarDatum } from '@nivo/bar';
import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { formatText } from '~utils/intl.ts';
import { getTeamHexColor, getTeamHexSecondaryColor } from '~utils/teams.ts';

import { CHART_CONFIG_VALUES, MSG } from './consts.ts';

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

export const useBarChartLegend = () => {
  const { primaryColorVariableName, secondaryColorVariableName } =
    useDomainColorVariables();

  return useMemo<any>(
    () => [
      {
        color: `var(${secondaryColorVariableName})`,
        label: formatText(MSG.paymentsLegendTitle),
      },
      {
        color: `var(${primaryColorVariableName})`,
        label: formatText(MSG.incomeLegendTitle),
      },
    ],
    [primaryColorVariableName, secondaryColorVariableName],
  );
};

export const useBarChartConfig = <T extends BarDatum>(): Partial<
  ResponsiveBarSvgProps<T>
> => {
  const { primaryColorVariableName, secondaryColorVariableName } =
    useDomainColorVariables();

  const barChartConfig = useMemo(() => {
    return {
      theme: {
        background: 'transparent',
      },
      colors: ({ id }) =>
        `var(${id === 'in' ? primaryColorVariableName : secondaryColorVariableName})`,
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
  }, [primaryColorVariableName, secondaryColorVariableName]);

  return barChartConfig;
};
