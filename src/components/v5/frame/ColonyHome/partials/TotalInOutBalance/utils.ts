import { format, setMonth } from 'date-fns';
import { BigNumber } from 'ethers';
import numbro from 'numbro';

import { convertToDecimal } from '~utils/convertToDecimal.ts';

import { type BarChartDataItem } from './types.ts';

export const sortByLabel = (a: BarChartDataItem, b: BarChartDataItem) =>
  parseInt(a.label ?? 0, 10) - parseInt(b.label ?? 0, 10);

export const getMonthShortName = (month: string) => {
  const parsedMonth = parseInt(month, 10) - 1;

  const now = Date.now();

  return format(new Date(setMonth(now, parsedMonth)), 'MMM');
};

export const getFallbackData = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const fallbackData: any = [];

  for (let i = 0; i < 4; i += 1) {
    fallbackData.push({
      label: format(new Date(setMonth(now, currentMonth - i)), 'MM'),
      in: 0,
      out: 0,
    });
  }

  return fallbackData.sort(sortByLabel);
};

export const getFormattedShortAmount = (value) => {
  const convertedValue = convertToDecimal(value, 0);
  return numbro(convertedValue?.toString()).format({
    average: true,
    totalLength: 2,
  });
};

export const getFormattedFullAmount = (value, prefix) => {
  const convertedValue = convertToDecimal(value, 0);
  return numbro(convertedValue?.toString()).format({
    thousandSeparated: true,
    mantissa: 2,
    prefix,
  });
};

export const convertFromTokenToCurrency = (
  value?: string | null,
  conversionRate?: number | null,
) =>
  BigNumber.from(value ?? 0)
    .mul(BigNumber.from(conversionRate ?? 0))
    .toString();

/**
 * To get the trend of the current value based on the previous value
 * We use the rule of three
 * previous ... 100%
 * (current - previous) ... x
 * @param current This is the current balance value
 * @param previous This is the previous balance value
 * @returns
 */
export const getValuesTrend = (current: string, previous: string) => {
  const convertedCurrent = BigNumber.from(current);
  const convertedPrevious = BigNumber.from(previous);

  let trend = convertedCurrent.isZero()
    ? BigNumber.from(0)
    : BigNumber.from(100);

  if (!convertedPrevious.isZero()) {
    trend = convertedCurrent
      .sub(convertedPrevious)
      .mul(100)
      .div(convertedPrevious);
  }

  return {
    value: `${trend.toString()}%`,
    isIncrease: trend.gte(0),
  };
};
