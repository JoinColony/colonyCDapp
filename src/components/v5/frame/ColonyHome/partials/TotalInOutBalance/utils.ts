import { format, parse, setMonth, setWeek, startOfWeek } from 'date-fns';
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

export const parseTimeframeKey = (key: string = '') => {
  let parsedDate = new Date();
  if (/^\d{2}-\d{2}-\d{4}$/.test(key)) {
    parsedDate = parse(key, 'dd-MM-yyyy', new Date());
  } else if (/^\d{2}W-\d{4}$/.test(key)) {
    const [weekString, yearString] = key.split('W-');
    const year = parseInt(yearString, 10);
    const week = parseInt(weekString, 10);
    const startOfYearDate = new Date(year, 0, 1);
    parsedDate = startOfWeek(setWeek(startOfYearDate, week), {
      weekStartsOn: 1,
    });
  }

  return format(parsedDate, 'MM');
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
  const convertedValue = convertToDecimal(value, 18);
  return numbro(convertedValue?.toString()).format({
    average: true,
    totalLength: 2,
  });
};

export const getFormattedFullAmount = (value, prefix) => {
  const convertedValue = convertToDecimal(value, 18);
  return numbro(convertedValue?.toString()).format({
    thousandSeparated: true,
    mantissa: 2,
    prefix,
  });
};
